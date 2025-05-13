const User = require("../models/user.model");
// const OTP = require("../models/otp.model");
const FreelancerProfile = require("../models/freelancer.model");
const ClientProfile = require("../models/client.model");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const crypto = require("crypto");
const emailService = require("../utils/emailServices");
const {
	getLocationInfo,
	isSuspiciousLocation,
	formatLocation,
} = require("../utils/location");
const OTP = require("../models/otp.model");
const uploadToCloudinary = require("../utils/cloudinary");

const sendOTP = async (req, res) => {
	const { email } = req.body;

	if (!email) {
		res.status(400).json({ message: "Email is required" });
		return;
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({
			success: false,
			message: "Please provide a valid email address",
		});
	}

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		res.status(400).json({ message: "User already exists" });
		return;
	}

	const otp = Math.floor(100000 + Math.random() * 900000).toString();
	console.log(otp);
	await OTP.findOneAndDelete({ email });
	await OTP.create({ email, otp });

	const emailSent = await emailService.sendOTPEmail(email, otp);

	if (!emailSent) {
		res.status(500).json({ message: "Failed to send OTP email" });
		return;
	}

	res.status(200).json({ message: "OTP sent successfully" });
};

const resendOTP = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Email is required",
			});
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({
				success: false,
				message: "Please provide a valid email address",
			});
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists",
			});
		}

		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		console.log(otp);
		await OTP.findOneAndDelete({ email });
		await OTP.create({ email, otp });

		const emailSent = await emailService.sendOTPEmail(email, otp);

		if (!emailSent) {
			return res.status(500).json({
				success: false,
				message: "Failed to send OTP email",
			});
		}

		return res.status(200).json({
			success: true,
			message: "OTP resent successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to resend OTP",
			error: error.message,
		});
	}
};

const signup = async (req, res) => {
	try {
		const { email, password, firstName, lastName, role,otp } = req.body;

		if (!email || !password || !firstName || !lastName || !role || !otp) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({
				success: false,
				message: "Please provide a valid email address",
			});
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists",
			});
		}
		// check if otp is valid
		const recentOtp = await OTP.findOne({ email })
		.sort({ createdAt: -1 })
		.limit(1);
	  // check the otp and recent otp (macthes from db and recent)
	  if (!recentOtp || recentOtp.otp !== otp) {
		return res.status(400).json({ message: "Invalid OTP" });
	  }
  
	  // hash the password
	  const hashedPassword = await bcrypt.hash(password, 10);

		const ip = req.ip || req.connection.remoteAddress;
		const locationInfo = getLocationInfo(ip);

		const user = await User.create({
			email,
			password,
			firstName,
			lastName,
			role,
			location: {
				city: locationInfo.city,
				country: locationInfo.country,
				timezone: locationInfo.timezone,
			},
		});

		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);

		try {
			await emailService.sendWelcomeEmail(user.email, {
				name: `${user.firstName} ${user.lastName}`,
				location: formatLocation(locationInfo),
			});
		} catch (emailError) {
			console.error("Failed to send welcome email:", emailError);
		}

		res.status(201).json({
			success: true,
			message: "User created successfully",
			token,
			user: {
				id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role,
			},
		});
	} catch (error) {
		console.error("Signup error:", error);
		res.status(500).json({
			success: false,
			message: "Failed to create user",
		});
	}
};

const login = async (req, res) => {
	try {
		const { email, password, totpToken } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Email and password are required",
			});
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "error while checking password",
			});
		}

		const ip =
			req.headers["x-forwarded-for"] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.ip ||
			"Unknown";

		const locationInfo = await getLocationInfo(ip);
		const isSuspicious = isSuspiciousLocation(
			user.location?.current,
			locationInfo
		);

		// Handle 2FA
		if (user.twoFactorEnabled) {
			// If no TOTP token provided, return early with 2FA requirement
			if (!totpToken) {
				return res.json({
					success: true,
					requiresTwoFactor: true,
					userId: user._id,
					email: user.email,
					suspiciousLogin: isSuspicious,
				});
			}

			// Verify TOTP token if provided
			const isValidToken = speakeasy.totp.verify({
				secret: user.twoFactorSecret,
				encoding: "base32",
				token: totpToken,
			});

			if (!isValidToken) {
				return res.status(401).json({
					success: false,
					message: "Invalid 2FA token",
				});
			}
		}
		// If suspicious login detected and 2FA not enabled
		else if (isSuspicious) {
			return res.json({
				success: true,
				requireSecurityUpgrade: true,
				message: "Suspicious login detected. Please set up 2FA to continue.",
				userId: user._id,
			});
		}

		// Update location info
		if (user.location?.current) {
			user.location.previous = { ...user.location.current };
		}
		user.location.current = {
			ip: locationInfo.ip,
			city: locationInfo.city,
			country: locationInfo.country,
			timezone: locationInfo.timezone,
			coordinates: locationInfo.coordinates,
			lastUpdated: new Date(),
		};

		// Update last active and save
		user.lastActive = new Date();
		await user.save();

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);
		user.token = token;
		user.password = undefined;
		// Send login notification email
		try {
			await emailService.sendLoginNotificationEmail(user.email, {
				name: `${user.firstName} ${user.lastName}`,
				time: new Date().toLocaleString(),
				location: formatLocation(locationInfo),
				device: req.headers["user-agent"] || "Unknown Device",
				suspicious: isSuspicious,
			});
		} catch (emailError) {
			console.error("Failed to send login notification:", emailError);
		}

		// Return success response with user data
		res
			.cookie("token", token, {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
			})
			.status(201)
			.json({
				success: true,
				message: "User logged in successfully",

				token,
				user: {
					id: user._id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					role: user.role,
					status: user.status,
					phoneNumber: user.phoneNumber,
					avatar: user.avatar || null,
					isVerified: user.isVerified,
					twoFactorEnabled: user.twoFactorEnabled,
					location: user.location?.current
						? {
								city: user.location.current.city,
								country: user.location.current.country,
								timezone: user.location.current.timezone,
								coordinates: user.location.current.coordinates,
						  }
						: null,
					lastActive: user.lastActive,
				},
			});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({
			success: false,
			message: "Login failed",
			error: error.message,
		});
	}
};

const updateProfile = async (req, res) => {
	try {
		const userId = req.user.id;
		const { firstName, lastName, phoneNumber, location } = req.body;

		let avatar;
		if (req.file) {
			const result = await uploadToCloudinary(req.file, "avatars");
			avatar = result.url;
		}

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				firstName,
				lastName,
				phoneNumber,
				location,
				avatar: avatar || undefined,
			},
			{ new: true, runValidators: true }
		).select("-password");

		res.json({
			success: true,
			message: "Profile updated successfully",
			data: updatedUser,
		});
	} catch (error) {
		console.error("Profile update error:", error);
		res.status(500).json({
			success: false,
			message: "Profile update failed",
		});
	}
};

const setup2FA = async (req, res) => {
	try {
		const userId = req.user.id;
		const user = await User.findById(userId);

		const secret = speakeasy.generateSecret({
			name: `SkillBridge:${user.email}`,
		});

		user.twoFactorSecret = secret.base32;
		await user.save();

		const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

		res.json({
			success: true,
			data: {
				qrCode: qrCodeUrl,
				secret: secret.base32,
			},
		});
	} catch (error) {
		console.error("2FA setup error:", error);
		res.status(500).json({
			success: false,
			message: "2FA setup failed",
		});
	}
};

const verify2FA = async (req, res) => {
	try {
		const { token, tempToken } = req.body;

		if (!token || !tempToken) {
			return res.status(400).json({
				success: false,
				message: "Token and temporary token are required",
			});
		}

		// Verify temp token
		let decoded;
		try {
			decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
			if (decoded.type !== "2fa_pending") {
				throw new Error("Invalid token type");
			}
		} catch (err) {
			return res.status(401).json({
				success: false,
				message: "Invalid or expired session. Please login again.",
			});
		}

		const user = await User.findById(decoded.userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		const verified = speakeasy.totp.verify({
			secret: user.twoFactorSecret,
			encoding: "base32",
			token,
		});

		if (!verified) {
			return res.status(401).json({
				success: false,
				message: "Invalid 2FA token",
			});
		}

		// Generate new full access token
		const newToken = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);

		res.json({
			success: true,
			token: newToken,
			user: {
				id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role,
				avatar: user.avatar,
				twoFactorEnabled: user.twoFactorEnabled,
				location: user.location?.current
					? {
							city: user.location.current.city,
							country: user.location.current.country,
							timezone: user.location.current.timezone,
					  }
					: null,
			},
		});
	} catch (error) {
		console.error("2FA verification error:", error);
		res.status(500).json({
			success: false,
			message: "2FA verification failed",
			error: error.message,
		});
	}
};

const disable2FA = async (req, res) => {
	try {
		const userId = req.user.id;
		const { token } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		const verified = speakeasy.totp.verify({
			secret: user.twoFactorSecret,
			encoding: "base32",
			token,
		});

		if (!verified) {
			return res.status(401).json({
				success: false,
				message: "Invalid 2FA token",
			});
		}

		user.twoFactorEnabled = false;
		user.twoFactorSecret = null;
		await user.save();

		res.json({
			success: true,
			message: "2FA disabled successfully",
		});
	} catch (error) {
		console.error("Disable 2FA error:", error);
		res.status(500).json({
			success: false,
			message: "Failed to disable 2FA",
			error: error.message,
		});
	}
};

const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await User.findOne({ email, isDeleted: false });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		const resetToken = crypto.randomBytes(32).toString("hex");
		console.log(resetToken);
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpires = Date.now() + 3600000;
		await user.save();

		const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

		const emailSent = await emailService.sendPasswordResetEmail(email, {
			name: `${user.firstName} ${user.lastName}`,
			resetUrl,
		});

		if (!emailSent) {
			return res.status(500).json({
				success: false,
				message: "Failed to send reset email",
			});
		}

		res.json({
			success: true,
			message: "Password reset email sent",
		});
	} catch (error) {
		console.error("Forgot password error:", error);
		res.status(500).json({
			success: false,
			message: "Failed to send reset email",
		});
	}
};

const resetPassword = async (req, res) => {
	try {
		const { token, newPassword } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired reset token",
			});
		}

		// if (!validatePassword(newPassword)) {
		// 	return res.status(400).json({
		// 		success: false,
		// 		message: "Password must meet security requirements",
		// 	});
		// }

		const isCurrentPasswordMatch = await bcrypt.compare(
			newPassword,
			user.password
		);
		if (isCurrentPasswordMatch) {
			return res.status(400).json({
				success: false,
				message: "New password cannot be the same as your current password",
			});
		}

		for (const prevPassword of user.previousPasswords) {
			const isPrevPasswordMatch = await bcrypt.compare(
				newPassword,
				prevPassword
			);
			if (isPrevPasswordMatch) {
				return res.status(400).json({
					success: false,
					message: "Cannot reuse any of your previous 5 passwords",
				});
			}
		}

		user.previousPasswords.push(user.password);
		if (user.previousPasswords.length > 5) {
			user.previousPasswords.shift();
		}

		user.password = newPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();

		console.log("password changed successfully");

		res.json({
			success: true,
			message: "Password reset successful",
		});
	} catch (error) {
		console.error("Reset password error:", error);
		res.status(500).json({
			success: false,
			message: "Password reset failed",
		});
	}
};

const getProfile = async (req, res) => {
	try {
		const userId = req.params.id || req.user.id;

		const user = await User.findById(userId)
			.select(
				"-password -twoFactorSecret -resetPasswordToken -resetPasswordExpires"
			)
			.lean();

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		let profileData = {};
		if (user.role === "freelancer") {
			const freelancerProfile = await FreelancerProfile.findOne({
				user: userId,
			})
				.populate("skills")
				.populate("completedProjects")
				.populate("reviews")
				.lean();
			profileData = { ...freelancerProfile };
		} else if (user.role === "client") {
			const clientProfile = await ClientProfile.findOne({ user: userId })
				.populate("postedProjects")
				.populate("activeProjects")
				.lean();
			profileData = { ...clientProfile };
		}

		res.json({
			success: true,
			data: {
				...user,
				profile: profileData,
			},
		});
	} catch (error) {
		console.error("Get profile error:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch profile",
		});
	}
};

const deleteAccount = async (req, res) => {
	try {
		const userId = req.user.id;
		const { password } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: "Invalid password",
			});
		}

		await User.findByIdAndUpdate(userId, {
			$set: {
				isDeleted: true,
				status: "deleted",
				email: `deleted.${userId}@deleted.com`,
				firstName: "Deleted",
				lastName: "User",
				password: crypto.randomBytes(32).toString("hex"),
				phoneNumber: null,
				avatar: null,
				lastActive: new Date(),
				location: null,
				twoFactorEnabled: false,
				twoFactorSecret: null,
				resetPasswordToken: null,
				resetPasswordExpires: null,
				previousPasswords: [],
			},
		});

		if (user.role === "freelancer") {
			await FreelancerProfile.findOneAndUpdate(
				{ userId: userId },
				{ $set: { isDeleted: true } }
			);
		} else if (user.role === "client") {
			await ClientProfile.findOneAndUpdate(
				{ userId: userId },
				{ $set: { isDeleted: true } }
			);
		}

		res.json({
			success: true,
			message: "Account deleted successfully",
		});
	} catch (error) {
		console.error("Delete account error:", error);
		res.status(500).json({
			success: false,
			message: "Failed to delete account",
		});
	}
};

const changePassword = async (req, res) => {
	try {
		const userId = req.user.id;
		const { currentPassword, newPassword } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		const isMatch = await bcrypt.compare(currentPassword, user.password);
		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: "Current password is incorrect",
			});
		}

		if (!validatePassword(newPassword)) {
			return res.status(400).json({
				success: false,
				message: "New password must meet security requirements",
			});
		}

		user.password = newPassword;
		await user.save();

		res.json({
			success: true,
			message: "Password changed successfully",
		});
	} catch (error) {
		console.error("Change password error:", error);
		res.status(500).json({
			success: false,
			message: "Failed to change password",
		});
	}
};

const googleLogin = async (req, res) => {
	try {
		const { credential, role } = req.body;

		if (!credential) {
			return res.status(400).json({
				success: false,
				message: "Google ID token is required",
			});
		}

		// Validate role if provided for new users
		if (role && !["client", "freelancer"].includes(role)) {
			return res.status(400).json({
				success: false,
				message: "Invalid role. Must be either 'client' or 'freelancer'",
			});
		}

		const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
		const ticket = await client.verifyIdToken({
			idToken: credential,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		if (!payload) {
			return res.status(400).json({
				success: false,
				message: "Invalid Google token",
			});
		}

		const { email, email_verified, given_name, family_name, picture, locale } =
			payload;

		if (!email_verified) {
			return res.status(400).json({
				success: false,
				message: "Google email not verified",
			});
		}

		let user = await User.findOne({ email });

		const ip =
			req.headers["x-forwarded-for"] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.ip ||
			"Unknown";

		const locationInfo = await getLocationInfo(ip);

		if (!user) {
			// For new users, role must be provided
			if (!role) {
				return res.status(400).json({
					success: false,
					message: "Role is required for new user registration",
					requiresRole: true,
					email,
					name: {
						firstName: given_name || "",
						lastName: family_name || "",
					},
					avatar: picture || null,
				});
			}

			// Generate a secure random password for Google users
			const randomPassword = crypto.randomBytes(32).toString("hex");
			const hashedPassword = await bcrypt.hash(randomPassword, 10);

			// Create new user with Google data
			user = await User.create({
				email,
				password: hashedPassword,
				firstName: given_name || "User",
				lastName: family_name || "",
				role: role,
				status: "active",
				isVerified: true,
				avatar: picture || null,
				authProvider: "google",
				location: {
					current: {
						ip: locationInfo.ip,
						city: locationInfo.city,
						country: locationInfo.country,
						timezone: locationInfo.timezone,
						coordinates: locationInfo.coordinates,
						lastUpdated: new Date(),
					},
				},
				lastActive: new Date(),
			});

			// Create corresponding profile based on role
			if (role === "freelancer") {
				await FreelancerProfile.create({
					userId: user._id,
					user: user._id,
					skills: [],
					hourlyRate: 0,
					title: "Freelancer",
					bio: "New freelancer on the platform",
					availability: "available",
					rating: 0,
					totalEarnings: 0,
					completedJobs: 0,
					languages: [],
					education: [],
					workExperience: [],
					portfolio: [],
				});
			} else if (role === "client") {
				await ClientProfile.create({
					userId: user._id,
					user: user._id,
					company: "",
					industry: "",
					totalSpent: 0,
					postedJobs: 0,
					description: "New client on the platform",
					website: "",
					socialMedia: {
						linkedin: "",
						twitter: "",
						facebook: "",
					},
				});
			}
		} else {
			// Update existing user's Google data
			user.firstName = given_name || user.firstName;
			user.lastName = family_name || user.lastName;
			user.avatar = picture || user.avatar;
			user.isVerified = true;

			// Update location
			if (user.location?.current) {
				user.location.previous = { ...user.location.current };
			}

			user.location.current = {
				ip: locationInfo.ip,
				city: locationInfo.city,
				country: locationInfo.country,
				timezone: locationInfo.timezone,
				coordinates: locationInfo.coordinates,
				lastUpdated: new Date(),
			};

			user.lastActive = new Date();
			await user.save();
		}

		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);

		// Send login notification
		try {
			await emailService.sendLoginNotificationEmail(user.email, {
				name: `${user.firstName} ${user.lastName}`,
				time: new Date().toLocaleString(),
				location: formatLocation(locationInfo),
				device: req.headers["user-agent"] || "Unknown Device",
				suspicious: false,
			});
		} catch (emailError) {
			console.error("Failed to send login notification:", emailError);
		}

		// Get profile data based on role
		let profile = null;
		if (user.role === "freelancer") {
			profile = await FreelancerProfile.findOne({ userId: user._id });
		} else if (user.role === "client") {
			profile = await ClientProfile.findOne({ userId: user._id });
		}

		res.json({
			success: true,
			token,
			user: {
				id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role,
				status: user.status,
				phoneNumber: user.phoneNumber,
				avatar: user.avatar || null,
				isVerified: user.isVerified,
				twoFactorEnabled: user.twoFactorEnabled,
				location: user.location?.current
					? {
							city: user.location.current.city,
							country: user.location.current.country,
							timezone: user.location.current.timezone,
							coordinates: user.location.current.coordinates,
					  }
					: null,
				lastActive: user.lastActive,
				profile: profile, // Include role-specific profile data
			},
		});
	} catch (error) {
		console.error("Google login error:", error);
		res.status(500).json({
			success: false,
			message: "Failed to authenticate with Google",
			error: error.message,
		});
	}
};

const logout = async (req, res) => {
	try {
		const userId = req.user.id;
		const user = await User.findById(userId);

		if (user) {
			user.lastActive = new Date();
			await user.save();
		}

		res.json({
			success: true,
			message: "Logged out successfully",
		});
	} catch (error) {
		console.error("Logout error:", error);
		res.status(500).json({
			success: false,
			message: "Logout failed",
			error: error.message,
		});
	}
};

module.exports = {
	signup,
	resendOTP,
	sendOTP,
	login,
	updateProfile,
	setup2FA,
	verify2FA,
	resetPassword,
	forgotPassword,
	googleLogin,
	deleteAccount,
	changePassword,
	getProfile,
	disable2FA,
	logout,
};
