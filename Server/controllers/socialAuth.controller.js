const User = require("../models/user.model");
const FreelancerProfile = require("../models/freelancer.model");
const ClientProfile = require("../models/client.model");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { getLocationInfo } = require("../utils/location");
const emailService = require("../utils/emailServices");

// GitHub Authentication
const githubAuth = async (req, res) => {
    try {
        const { code } = req.body;
        
        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Authorization code is required"
            });
        }

        console.log('Attempting GitHub authentication with code:', code);

        // Step 1: Exchange code for access token
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://github.com/login/oauth/access_token',
            data: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
                redirect_uri: process.env.GITHUB_CALLBACK_URL
            },
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log('Token response:', tokenResponse.data);

        if (!tokenResponse.data.access_token) {
            console.error('Token response error:', tokenResponse.data);
            return res.status(400).json({
                success: false,
                message: 'Failed to get access token from GitHub',
                details: tokenResponse.data.error_description || 'No error description provided'
            });
        }

        // Step 2: Get user data using the access token
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${tokenResponse.data.access_token}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'SkillBridge-App'
            }
        });

        // Step 3: Get user's email
        const emailResponse = await axios.get('https://api.github.com/user/emails', {
            headers: {
                'Authorization': `token ${tokenResponse.data.access_token}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'SkillBridge-App'
            }
        });

        const primaryEmail = emailResponse.data.find(email => email.primary)?.email;

        if (!primaryEmail) {
            return res.status(400).json({
                success: false,
                message: 'No primary email found in GitHub account'
            });
        }

        // Check if user exists
        let user = await User.findOne({ email: primaryEmail });

        if (!user) {
            // Return data for role selection
            return res.json({
                success: true,
                requiresRole: true,
                email: primaryEmail,
                name: {
                    firstName: userResponse.data.name?.split(' ')[0] || 'GitHub',
                    lastName: userResponse.data.name?.split(' ')[1] || 'User'
                },
                avatar: userResponse.data.avatar_url,
                provider: 'github'
            });
        }

        // Generate JWT token for existing user
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error('GitHub authentication error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to authenticate with GitHub',
            details: error.response?.data?.message || error.message
        });
    }
};

// LinkedIn Authentication
const linkedinAuth = async (req, res) => {
    try {
        const { code } = req.body;

        // Exchange code for access token
        const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', {
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.LINKEDIN_CALLBACK_URL,
            client_id: process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET
        });

        const accessToken = tokenResponse.data.access_token;

        // Get LinkedIn profile data
        const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'cache-control': 'no-cache',
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });

        // Get LinkedIn email
        const emailResponse = await axios.get(
            'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
            {
                headers: { Authorization: `Bearer ${accessToken}` }
            }
        );

        const email = emailResponse.data.elements[0]['handle~'].emailAddress;
        const linkedinProfile = profileResponse.data;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Return data for role selection
            return res.json({
                success: true,
                requiresRole: true,
                email,
                name: {
                    firstName: linkedinProfile.localizedFirstName,
                    lastName: linkedinProfile.localizedLastName
                },
                avatar: linkedinProfile.profilePicture?.displayImage,
                provider: 'linkedin'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error('LinkedIn authentication error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to authenticate with LinkedIn'
        });
    }
};

// Complete Social Registration
const completeSocialRegistration = async (req, res) => {
    try {
        const { email, role, name, avatar, provider } = req.body;

        if (!['freelancer', 'client'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role specified'
            });
        }

        // Get location info
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const locationInfo = await getLocationInfo(ip);

        // Create user
        const user = await User.create({
            email,
            firstName: name.firstName,
            lastName: name.lastName,
            role,
            status: 'active',
            isVerified: true,
            avatar,
            authProvider: provider,
            location: {
                current: {
                    ip: locationInfo.ip,
                    city: locationInfo.city,
                    country: locationInfo.country,
                    timezone: locationInfo.timezone,
                    coordinates: locationInfo.coordinates,
                    lastUpdated: new Date()
                }
            }
        });

        // Create role-specific profile
        if (role === 'freelancer') {
            await FreelancerProfile.create({
                user: user._id,
                title: "New Freelancer",
                bio: "Professional freelancer ready to work on exciting projects",
                skills: [],
                hourlyRate: 0,
                availability: {
                    status: 'Available',
                    hoursPerWeek: 40,
                    timezone: locationInfo.timezone
                },
                rating: {
                    average: 0,
                    count: 0
                },
                stats: {
                    totalEarnings: 0,
                    completedProjects: 0,
                    ongoingProjects: 0,
                    successRate: 0
                },
                socialProfiles: {
                    github: provider === 'github' ? `https://github.com/${name.firstName}` : '',
                    linkedin: provider === 'linkedin' ? `https://linkedin.com/in/${name.firstName}` : ''
                }
            });
        } else {
            await ClientProfile.create({
                user: user._id,
                company: {
                    name: '',
                    website: '',
                    size: '1-10',
                    description: 'New client looking for talented freelancers'
                },
                businessDetails: {
                    type: 'Individual',
                    verificationStatus: 'Pending'
                },
                projects: {
                    active: [],
                    completed: [],
                    cancelled: []
                },
                financials: {
                    totalSpent: 0,
                    activeProjectsBudget: 0
                },
                rating: {
                    average: 0,
                    count: 0
                },
                stats: {
                    totalProjects: 0,
                    activeProjects: 0,
                    completedProjects: 0,
                    totalFreelancersHired: 0
                },
                preferences: {
                    communicationChannel: 'Email',
                    timezone: locationInfo.timezone,
                    currency: 'USD',
                    language: 'English'
                }
            });
        }

        // Send welcome email
        await emailService.sendWelcomeEmail(user.email, {
            name: `${user.firstName} ${user.lastName}`,
            role: user.role
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatar: user.avatar,
                location: user.location.current
            }
        });

    } catch (error) {
        console.error('Social registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete registration',
            details: error.message
        });
    }
};

module.exports = {
    githubAuth,
    linkedinAuth,
    completeSocialRegistration
};
