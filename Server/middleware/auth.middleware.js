const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = async (req, res, next) => {
	try {
		const token = req.header("Authorization")?.replace("Bearer ", "");
		// console.log("Auth header:", req.headers.authorization);

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Authentication token is required",
			});
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "User not found",
			});
		}

		req.user = user;
		next();
	} catch (error) {
		console.error("JWT verify error ->", error.message); // add this

		return res.status(401).json({ success: false, message: "Invalid token" });
	}
};

const admin = async (req, res, next) => {
	try {
		const token = req.header("Authorization")?.replace("Bearer ", "");

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Authentication token is required",
			});
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "User not found",
			});
		}

		if (user.role !== "admin") {
			return res.status(401).json({
				success: false,
				message: "User is not an admin",
			});
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "Invalid token",
		});
	}
};

exports.isClient = async (req, res, next) => {
	try {
		if (req.user.role !== "client") {
			return res.status(401).json({
				success: false,
				message: "User is not a client",
			});
		}
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "Invalid token",
		});
	}
};

exports.isFreelancer = async (req, res, next) => {
	try {
		if (req.user.role !== "freelancer") {
			return res.status(401).json({
				success: false,
				message: "User is not a freelancer",
			});
		}
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "Invalid token",
		});
	}
};

module.exports = auth;
