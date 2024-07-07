import crypto from "crypto";
import nodemailer from "nodemailer";

// Function to generate a security token
const generateSecurityToken = () => crypto.randomBytes(16).toString("hex");

// Function to set the token expiry time (10 minutes from now)
const generateTokenExpiry = () => new Date(Date.now() + 10 * 60 * 1000);

// Function to send the security token via email
const sendSecurityTokenEmail = (email, token) => {
	// Configure the email transporter
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	// Email content
	const mailOptions = {
		from: `"CC Fraud Detection" <${process.env.EMAIL_USER}>`,
		to: email,
		subject: "Your Security Token",
		html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333;">CCFraudDetection</h2>
        <p style="color: #555;">Dear User,</p>
        <p style="color: #555;">Your security token is <strong>${token}</strong>. It is valid for 10 minutes.</p>
        <p style="color: #555; display: none;">Click the button below to copy the token to your clipboard:</p>
        <div style="display: none; align-items: center;">
          <input 
            id="tokenInput" 
            value="${token}" 
            readonly 
            style="width: 70%; padding: 10px; font-size: 16px; border: 1px solid #ddd; border-radius: 5px; margin-right: 10px;"
          />
          <button 
            style="background-color: #007bff; color: #fff; border: none; padding: 10px 20px; font-size: 16px; border-radius: 5px; cursor: pointer;"
            onclick="document.getElementById('tokenInput').select(); document.execCommand('copy'); alert('Token copied to clipboard!')"
          >
            Copy Token
          </button>
        </div>
        <p style="color: #555;">Thank you,<br/>CCFraudDetection Team</p>
      </div>
    `,
	};

	// Send the email
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
};

export { generateSecurityToken, generateTokenExpiry, sendSecurityTokenEmail };
