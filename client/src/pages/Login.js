import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Oval } from "react-loader-spinner";
import axios from "axios";
import {
  loginRoute,
  EmailVerifyRoute,
  verify_otpRoute,
} from "../utils/APIRoutes";
import { EmailContext } from "../utils/EmailContext";
const Login = () => {
  const { sendEmail, ContextEmail } = useContext(EmailContext);
  console.log("ContextEmail in Login", ContextEmail);
  const [isLoading, setLoading] = useState(false);
  const [isReset, setReset] = useState(false);
  const [ErrMsg, setErrMsg] = useState(false);
  const [SuccessResponse, setSuccessResponse] = useState(false);
  const [handleValidationMessage, setHandleValidationMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordTyped, setIsPasswordTyped] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isVerified, setVerified] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [otp, setOtpRequest] = useState({
    otp: "",
    emailReset: ContextEmail,
  });

  const [emailData, setEmailData] = useState({ emailReset: "" });
  const handleEmail = (e) => {
    setEmailData({ [e.target.name]: e.target.value });
    console.log(emailData);
    setOtpRequest({
      ...otp,
      [e.target.name]: e.target.value,
    });
  };
  const handleEmailVerify = async (e) => {
    e.preventDefault();
    sendEmail(emailData.emailReset);
    setLoading(true);
    try {
      const response = await axios.post(EmailVerifyRoute, emailData);
      if (response.status === 200) {
        setSuccessResponse(false);

        setErrMsg(false);
        setTimeout(() => {
          setSuccessResponse(true);
          setHandleValidationMessage(response.data.message);
          setLoading(false);
          setTimeout(() => {
            setHandleValidationMessage("Redirecting Please wait...");
            setTimeout(() => {
              setVerified(false);
              setSuccessResponse(false);
              setEmailData({ emailReset: "" });
            }, 1000);
          }, 1000);
        }, 3000);
      }
    } catch (error) {
      setErrMsg(false);
      setLoading(true);
      setSuccessResponse(false);
      setReset(false);
      setTimeout(() => {
        setErrMsg(true);
        setReset(false);
        setHandleValidationMessage("Invalid email. Please try again");
        setLoading(false);
      }, 2000);
    }
  };
  const handleOTPVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(verify_otpRoute, otp);
      if (response.status === 200) {
        setSuccessResponse(false);

        setErrMsg(false);
        setTimeout(() => {
          setSuccessResponse(true);
          setHandleValidationMessage(response.data.message);
          setLoading(false);
          setTimeout(() => {
            setHandleValidationMessage("Redirecting Please wait...");
            setTimeout(() => {
              navigate("/reset-password");
            }, 1000);
          }, 1000);
        }, 3000);
      }
    } catch (error) {
      setErrMsg(false);
      setLoading(true);
      setSuccessResponse(false);
      setReset(false);
      setTimeout(() => {
        setErrMsg(true);
        setReset(false);
        setHandleValidationMessage("Invalid OTP. Please try again");
        setLoading(false);
      }, 2000);
    }
  };

  const navigate = useNavigate();
  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "password" && e.target.value.length > 0) {
      setIsPasswordTyped(true);
    } else {
      setIsPasswordTyped(false);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(loginRoute, loginData);
      if (res.status === 200) {
        setSuccessResponse(false);

        setErrMsg(false);
        setTimeout(() => {
          setSuccessResponse(true);
          setHandleValidationMessage(res.data.message);
          setLoading(false);
          setTimeout(() => {
            setHandleValidationMessage("Redirecting Please wait...");
            setTimeout(() => {
              navigate("/chats");
            }, 1000);
          }, 1000);
        }, 2000);
      }
    } catch (error) {
      // Other server errors
      setErrMsg(false);

      setSuccessResponse(false);
      setReset(false);
      setTimeout(() => {
        setErrMsg(true);
        setReset(true);
        setHandleValidationMessage("Invalid credentials. Please try again");
        setLoading(false);
      }, 2000);
    }
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevValue) => !prevValue);
  };
  const handleResetPassword = () => {
    setReset(false);
    setErrMsg(false);
    setIsLoggedIn(false);
    setVerified(true);
  };

  return (
    <div className="mainContainer">
      <div className="header">
        <p className="RouteLink">
          New here? <Link to="/register">Register</Link>
        </p>
      </div>

      <div className="registerContainer">
        <div className="container">
          <h1 className="LogoText">Nexus</h1>
          {isLoggedIn ? (
            <form action="" className="form" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                name="email"
                required
                onChange={handleChange}
              />
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Password"
                  name="password"
                  required
                  onChange={handleChange}
                />
                <span
                  className="passwordShow"
                  onClick={handleTogglePasswordVisibility}
                >
                  {isPasswordTyped &&
                    (showPassword ? <FaEyeSlash /> : <FaEye />)}
                </span>
              </div>

              <button type="submit">
                {isLoading ? (
                  <div className="loader">
                    <Oval
                      visible={true}
                      height="35"
                      width="30"
                      color="#fff"
                      ariaLabel="triangle-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          ) : (
            <>
              {isVerified ? (
                <form action="" className="form" onSubmit={handleEmailVerify}>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    name="emailReset"
                    value={emailData.emailReset}
                    required
                    onChange={handleEmail}
                  />

                  <button type="submit">
                    {isLoading ? (
                      <div className="loader">
                        <Oval
                          visible={true}
                          height="35"
                          width="30"
                          color="#fff"
                          ariaLabel="triangle-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        />
                      </div>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </form>
              ) : (
                <form action="" className="form" onSubmit={handleOTPVerify}>
                  <input
                    type="text"
                    placeholder="Enter your OTP"
                    name="otp"
                    value={otp.otp}
                    required
                    onChange={handleEmail}
                  />

                  <button type="submit">
                    {isLoading ? (
                      <div className="loader">
                        <Oval
                          visible={true}
                          height="35"
                          width="30"
                          color="#fff"
                          ariaLabel="triangle-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        />
                      </div>
                    ) : (
                      "Verify"
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {ErrMsg && <p className="ErrMsg">{handleValidationMessage}</p>}
          {SuccessResponse && (
            <p className="SuccessMsg">{handleValidationMessage}</p>
          )}
          {isReset && (
            <div className="reset-password" onClick={handleResetPassword}>
              <span>Reset password</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
