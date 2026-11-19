
const db = require("../config/db");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Hash OTP before saving
const hashOTP = (otp) => {
  return crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(otp)
    .digest("hex");
};

// STEP 1: Send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await db.execute(
      "SELECT id FROM users WHERE email = ? AND is_active = TRUE",
      [normalizedEmail]
    );

    // Generic response avoids revealing whether account exists
    if (users.length === 0) {
      return res.json({
        success: true,
        message: "If the account exists, an OTP will be sent.",
      });
    }

    // Prevent repeated OTP requests within 60 seconds
    const [recentOTPs] = await db.execute(
      `SELECT id FROM password_reset_otps
       WHERE email = ?
       AND created_at > DATE_SUB(NOW(), INTERVAL 60 SECOND)`,
      [normalizedEmail]
    );

    if (recentOTPs.length > 0) {
      return res.status(429).json({
        success: false,
        message: "Please wait 60 seconds before requesting another OTP.",
      });
    }

    // Invalidate previous OTPs
    await db.execute(
      `UPDATE password_reset_otps
       SET used_at = NOW()
       WHERE email = ? AND used_at IS NULL`,
      [normalizedEmail]
    );

    // Generate secure 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = hashOTP(otp);

    // OTP expires in 5 minutes
    await db.execute(
      `INSERT INTO password_reset_otps
       (email, otp_hash, expires_at)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))`,
      [normalizedEmail, otpHash]
    );

    // Send OTP email
    try {
      await transporter.sendMail({
        from: `"SyscoTech Security" <${process.env.EMAIL_USER}>`,
        to: normalizedEmail,
        subject: "SyscoTech - Password Reset OTP",
        html: `
          <div style="font-family:Arial;padding:25px;">
            <h2 style="color:#f28c00;">SyscoTech</h2>
            <h3>Password Reset Request</h3>
            <p>Your password reset OTP is:</p>
            <h1 style="letter-spacing:8px;color:#f28c00;">
              ${otp}
            </h1>
            <p>This OTP expires in 5 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        `,
      });
    } catch (mailError) {
      await db.execute(
        `UPDATE password_reset_otps
         SET used_at = NOW()
         WHERE email = ? AND otp_hash = ?`,
        [normalizedEmail, otpHash]
      );

      throw mailError;
    }

    return res.json({
      success: true,
      message: "If the account exists, an OTP will be sent.",
    });

  } catch (error) {
    console.error("Send OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send OTP. Please try again.",
    });
  }
};


// STEP 2: Verify OTP and update password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }

    if (!/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [records] = await db.execute(
      `SELECT * FROM password_reset_otps
       WHERE email = ?
       AND used_at IS NULL
       ORDER BY id DESC
       LIMIT 1`,
      [normalizedEmail]
    );

    if (records.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP.",
      });
    }

    const record = records[0];

    if (record.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Request a new OTP.",
      });
    }

    if (new Date(record.expires_at).getTime() <= Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new OTP.",
      });
    }

    const submittedHash = hashOTP(String(otp));

    if (submittedHash !== record.otp_hash) {
      await db.execute(
        "UPDATE password_reset_otps SET attempts = attempts + 1 WHERE id = ?",
        [record.id]
      );

      return res.status(400).json({
        success: false,
        message: "Incorrect OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password only after OTP verification
    const [result] = await db.execute(
      "UPDATE users SET password = ? WHERE email = ? AND is_active = TRUE",
      [hashedPassword, normalizedEmail]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "Unable to update password",
      });
    }

    // OTP can never be reused
    await db.execute(
      "UPDATE password_reset_otps SET used_at = NOW() WHERE email = ? AND used_at IS NULL",
      [normalizedEmail]
    );

    return res.json({
      success: true,
      message: "Password updated successfully. Please login.",
    });

  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password. Please try again.",
    });
  }
};
