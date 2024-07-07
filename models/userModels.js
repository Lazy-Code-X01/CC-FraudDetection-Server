import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		securityToken: {
			type: String,
		},
		tokenExpiry: {
			type: Date,
		},
	},
	{
		timestamps: true,
	},
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// Method to set security token and expiry time
userSchema.methods.setSecurityToken = function (token, expiry) {
	this.securityToken = token;
	this.tokenExpiry = expiry;
};

const User = mongoose.model("User", userSchema);

export default User;
