const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const generateOTP = () => {
	return Math.floor(100000 + Math.random() * 900000).toString();
};

const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({
				message: "All fields are required",
			});
		}

		let user = await User.findOne({ email });

		if (user && user.isVerified) {
			return res.status(400).json({
				message: "Email already registered",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const otp = generateOTP();

		const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

		if (user) {
			user.name = name;
			user.password = hashedPassword;
			user.otp = otp;
			user.otpExpiresAt = otpExpiresAt;
		} else {
			user = new User({
				name,
				email,
				password: hashedPassword,
				otp,
				otpExpiresAt,
			});
		}

		await user.save();

		await sendEmail(email, otp);

		res.status(201).json({
			message: "Registration successful. OTP sent to your email.",
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Server error",
			error: error.message,
		});
	}
};

const verifyOTP = async (req, res) => {
	try {
		const { email, otp } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		if (user.isVerified) {
			return res.status(400).json({
				message: "Email already verified",
			});
		}

		if (!user.otp || user.otp !== otp) {
			return res.status(400).json({
				message: "Invalid OTP",
			});
		}

		if (user.otpExpiresAt < new Date()) {
			return res.status(400).json({
				message: "OTP expired",
			});
		}

		user.isVerified = true;
		user.otp = undefined;
		user.otpExpiresAt = undefined;

		await user.save();

		res.json({
			message: "Email verified successfully",
		});
	} catch (error) {
		res.status(500).json({
			message: "Server error",
			error: error.message,
		});
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		if (!user.isVerified) {
			return res.status(401).json({
				message: "Please verify your email first",
			});
		}

		const passwordMatch = await bcrypt.compare(
			password,
			user.password
		);

		if (!passwordMatch) {
			return res.status(401).json({
				message: "Invalid email or password",
			});
		}

		const token = jwt.sign(
			{
				userId: user._id,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "1d",
			}
		);

		res.json({
			message: "Login successful",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		res.status(500).json({
			message: "Server error",
			error: error.message,
		});
	}
};

module.exports = {
	register,
	verifyOTP,
	login,
};