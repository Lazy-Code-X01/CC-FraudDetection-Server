import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";
import generateToken from "../utils/generateToken.js";
import {
	generateSecurityToken,
	generateTokenExpiry,
	sendSecurityTokenEmail,
} from "../utils/securityTokenUtils.js";

//@desc    Auth user/set token
//route    POST /api/users/auth
//@access  Public
const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		generateToken(res, user._id);
		res.status(201).json({
			_id: user._id,
			email: user.email,
		});
	} else {
		res.status(401);
		throw new Error("Invalid email or password");
	}
});

//@desc    Register a new user
//route    POST /api/users
//@access  Public
const registerUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// checking if user exists
	const userExists = await User.findOne({ email });
	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}

	const user = await User.create({
		email,
		password,
	});

	if (user) {
		generateToken(res, user._id);
		res.status(201).json({
			_id: user._id,
			email: user.email,
		});
	} else {
		res.status(400);

		throw new Error("Invalid user data");
	}
});

//@desc    Logout  user
//route    POST /api/users/logout
//@access  Public
const logoutUser = asyncHandler(async (req, res) => {
	res.cookie("jwt", "", {
		httpOnly: true,
		expires: new Date(0),
	});
	res.status(200).json({ message: "User Logged out" });
});

//@desc    Send security token for card validation
//route    POST /api/users/send-token
//@access  Private
const sendToken = asyncHandler(async (req, res) => {
	const { email } = req.body;

	const user = await User.findOne({ email });

	if (user) {
		const token = generateSecurityToken();
		const tokenExpiry = generateTokenExpiry();
		user.setSecurityToken(token, tokenExpiry);
		await user.save();

		sendSecurityTokenEmail(email, token);
		res.status(200).json({
			message: "Security token sent to email",
		});
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

//@desc    Validate security token and perform card validation
//route    POST /api/users/validate-card
//@access  Private
const validateCard = asyncHandler(async (req, res) => {
	const { email, token, cardNumber, expiryDate, cvv } = req.body;

	const user = await User.findOne({ email });

	if (user && user.securityToken === token && user.tokenExpiry > new Date()) {
		// Process card validation
		res.status(200).json({ message: "Card validated successfully" });
	} else {
		res.status(401);
		throw new Error("Invalid or expired security token");
	}
});

export { authUser, registerUser, logoutUser, sendToken, validateCard };

// |
