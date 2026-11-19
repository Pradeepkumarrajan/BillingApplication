
import { useState } from "react";
import "./App.css";
import {
  loginUser,
  registerUser,
  sendPasswordOTP,
  resetPassword
} from "./services/authService";

function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Registration states
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const [showForgot, setShowForgot] = useState(false);
const [otpSent, setOtpSent] = useState(false);
const [otp, setOtp] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmNewPassword, setConfirmNewPassword] = useState("");
const [forgotLoading, setForgotLoading] = useState(false);
const [forgotError, setForgotError] = useState("");
const [forgotSuccess, setForgotSuccess] = useState("");



  // LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(email, password, remember);

      alert(`Welcome ${data.user.full_name}!`);

      console.log("Logged in user:", data.user);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // REGISTER FUNCTION
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");

    if (fullName.trim().length < 2) {
      setRegisterError("Please enter your full name");
      return;
    }

    if (password.length < 8) {
      setRegisterError("Password must contain at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }

    try {
      setRegisterLoading(true);

      const data = await registerUser(
        fullName.trim(),
        email.trim(),
        password
      );

      alert(data.message || "Account created successfully!");

      // Return to login page
      setShowRegister(false);
      setEmail(email.trim());
      setPassword("");
      setConfirmPassword("");
      setFullName("");

    } catch (err) {
      setRegisterError(err.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  


  const handleSendOTP = async (e) => {
  e.preventDefault();
  setForgotError("");
  setForgotSuccess("");

  try {
    setForgotLoading(true);

    const data = await sendPasswordOTP(email.trim());

    setOtpSent(true);
    setForgotSuccess(data.message);

  } catch (err) {
    setForgotError(err.message);
  } finally {
    setForgotLoading(false);
  }
};

const handleResetPassword = async (e) => {
  e.preventDefault();
  setForgotError("");
  setForgotSuccess("");

  if (!/^\d{6}$/.test(otp)) {
    setForgotError("Please enter a valid 6-digit OTP");
    return;
  }

  if (newPassword.length < 8) {
    setForgotError("Password must contain at least 8 characters");
    return;
  }

  if (newPassword !== confirmNewPassword) {
    setForgotError("Passwords do not match");
    return;
  }

  try {
    setForgotLoading(true);

    const data = await resetPassword(
      email.trim(),
      otp,
      newPassword
    );

    alert(data.message);

    setShowForgot(false);
    setOtpSent(false);
    setOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPassword("");
    setForgotSuccess("");

  } catch (err) {
    setForgotError(err.message);
  } finally {
    setForgotLoading(false);
  }
};

  // SWITCH TO REGISTER
  const openRegister = () => {
    setShowRegister(true);
    setError("");
    setRegisterError("");
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  // SWITCH TO LOGIN
  const openLogin = () => {
    setShowRegister(false);
    setError("");
    setRegisterError("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="login-page">

      {/* Background Effects */}
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      {/* LEFT SECTION */}
      <section className="hero-section">

        <div className="brand">
          <div className="brand-icon">S</div>
          <span>
            SYSCO<span className="brand-orange">TECH</span>
          </span>
        </div>

        <div className="hero-content">

          <div className="hero-tag">
            <span className="live-dot"></span>
            SMARTER BUSINESS. BETTER FUTURE.
          </div>

          <h1>
            Welcome to the
            <br />
            <span>Future of</span>
            <br />
            Digital Business.
          </h1>

          <p className="hero-description">
            One secure place to manage your business,
            connect your team and transform the way
            you work.
          </p>

          <div className="hero-visual">

            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>
            <div className="orbit orbit-three"></div>

            <div className="visual-core">
              <div className="core-letter">S</div>
            </div>

            <div className="floating-card card-top">
              <span className="mini-icon">✦</span>
              <div>
                <small>Innovation</small>
                <strong>Beyond Limits</strong>
              </div>
            </div>

            <div className="floating-card card-bottom">
              <span className="mini-icon">↗</span>
              <div>
                <small>Performance</small>
                <strong>Built for Growth</strong>
              </div>
            </div>

            <div className="visual-dot dot-one"></div>
            <div className="visual-dot dot-two"></div>

          </div>
        </div>

        <div className="hero-footer">
          <span>© 2026 SyscoTech</span>
          <span>POWERED BY INNOVATION</span>
        </div>

      </section>

      {/* RIGHT SECTION */}
      <section className="login-section">

        <div className="mobile-brand">
          <div className="brand-icon">S</div>
          <span>
            SYSCO<span className="brand-orange">TECH</span>
          </span>
        </div>

        <div className="login-wrapper">

          {/* REGISTER PAGE */}
          {showRegister ? (

            <>
              <div className="welcome-label">
                <span className="welcome-line"></span>
                NEW ACCOUNT
              </div>

              <h2>
                Create Account<span>.</span>
              </h2>

              <p className="login-subtitle">
                Create your SyscoTech account to get started.
              </p>

              <form onSubmit={handleRegister}>

                {/* FULL NAME */}
                <div className="form-group">
                  <label>Full Name</label>

                  <div className="input-wrapper">
                    <span className="input-icon">♙</span>

                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      minLength={2}
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="form-group">
                  <label>Email Address</label>

                  <div className="input-wrapper">
                    <span className="input-icon">✉</span>

                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="form-group">
                  <label>Password</label>

                  <div className="input-wrapper">
                    <span className="input-icon">♙</span>

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="form-group">
                  <label>Confirm Password</label>

                  <div className="input-wrapper">
                    <span className="input-icon">♙</span>

                    <input
                      type="password"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* REGISTER ERROR */}
                {registerError && (
                  <div className="error-message">
                    {registerError}
                  </div>
                )}

                {/* CREATE ACCOUNT BUTTON */}
                <button
                  type="submit"
                  className="login-button"
                  disabled={registerLoading}
                >
                  <span>
                    {registerLoading
                      ? "Creating Account..."
                      : "Create Account"}
                  </span>

                  <span className="button-arrow">
                    {registerLoading ? "..." : "→"}
                  </span>
                </button>

                {/* BACK TO LOGIN */}
                <div className="signup-section">
                  <span>Already have an account?</span>

                  <button
                    type="button"
                    className="signup-button"
                    onClick={openLogin}
                  >
                    Sign In
                  </button>
                </div>

              </form>
            </>

            ) : showForgot ? (

  /* FORGOT PASSWORD PAGE */
  <>

    <div className="welcome-label">
      <span className="welcome-line"></span>
      ACCOUNT RECOVERY
    </div>

    <h2>
      Forgot Password<span>?</span>
    </h2>

    <p className="login-subtitle">
      {otpSent
        ? "Enter the OTP sent to your registered email."
        : "Enter your registered email to receive an OTP."}
    </p>

    {!otpSent ? (

      <form onSubmit={handleSendOTP}>

        <div className="form-group">
          <label>Email Address</label>

          <div className="input-wrapper">
            <span className="input-icon">✉</span>

            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="login-button"
          disabled={forgotLoading}
        >
          {forgotLoading ? "Sending OTP..." : "Send OTP"}
        </button>

      </form>

    ) : (

      <form onSubmit={handleResetPassword}>

        <div className="form-group">
          <label>6-Digit OTP</label>

          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Enter OTP"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>New Password</label>

          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>

          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="login-button"
          disabled={forgotLoading}
        >
          {forgotLoading ? "Updating..." : "Reset Password"}
        </button>

      </form>

      

    )}

    {forgotError && (
      <p className="error-message">{forgotError}</p>
    )}

    {forgotSuccess && (
      <p className="success-message">{forgotSuccess}</p>
    )}

    <div className="signup-section">
      <button
        type="button"
        className="signup-button"
        onClick={() => {
          setShowForgot(false);
          setOtpSent(false);
          setOtp("");
          setForgotError("");
          setForgotSuccess("");
        }}
      >
        Back to Sign In
      </button>
    </div>

  </>

          ) : (

            

            

            /* LOGIN PAGE */
            <>

              <div className="welcome-label">
                <span className="welcome-line"></span>
                SECURE ACCESS
              </div>

              <h2>
                Sign in<span>.</span>
              </h2>

              <p className="login-subtitle">
                Welcome back! Please enter your details.
              </p>

              <form onSubmit={handleLogin}>

                {/* EMAIL */}
                <div className="form-group">
                  <label>Email Address</label>

                  <div className="input-wrapper">
                    <span className="input-icon">✉</span>

                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="form-group">

                  <div className="password-label">
  <label>Password</label>

  <button
    type="button"
    className="forgot-password-link"
    onClick={() => {
      setShowForgot(true);
      setOtpSent(false);
      setForgotError("");
      setForgotSuccess("");
      setOtp("");
      setNewPassword("");
      setConfirmNewPassword("");
    }}
  >
    Forgot password?
  </button>
</div>

                  <div className="input-wrapper">
                    <span className="input-icon">♙</span>

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* LOGIN ERROR */}
                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                {/* OPTIONS */}
                <div className="form-options">

                  <label className="remember-label">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) =>
                        setRemember(e.target.checked)
                      }
                    />

                    <span>Remember me</span>
                  </label>

                  <span className="secure-text">
                    🔒 Secure Login
                  </span>

                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  <span>
                    {loading
                      ? "Signing in..."
                      : "Sign in to your account"}
                  </span>

                  <span className="button-arrow">
                    {loading ? "..." : "→"}
                  </span>
                </button>

                {/* CREATE ACCOUNT */}
                <div className="signup-section">
                  <span>Don't have an account?</span>

                  <button
                    type="button"
                    className="signup-button"
                    onClick={openRegister}
                  >
                    Create Account
                  </button>
                </div>

              </form>

              <div className="divider">
                <span></span>
                <p>YOUR BUSINESS, OUR TECHNOLOGY</p>
                <span></span>
              </div>

              <div className="security-info">
                <div className="security-icon">✓</div>

                <div>
                  <strong>Protected & Encrypted</strong>

                  <p>
                    Your information is secured with
                    enterprise-grade protection.
                  </p>
                </div>
              </div>

            </>

          )}

        </div>

        <div className="login-footer">
          <span>© 2026 SyscoTech. All rights reserved.</span>
          <span>Privacy · Terms</span>
        </div>

      </section>
    </div>
  );
}

export default App;
