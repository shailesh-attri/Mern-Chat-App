import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { registerRoute } from "../utils/APIRoutes.js";
import axios from "axios";
import { Oval } from "react-loader-spinner";
const Register = () => {
  const [isRegistered, setRegistered] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [ErrMsg, setErrMsg] = useState(false);
  const [SuccessMsg, setSuccessMsg] = useState(false);
  const [handleValidationMessage, setHandleValidationMessage] = useState("");
  const [handleBackendMessage, setHandleBackendMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordTyped, setIsPasswordTyped] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "password" && e.target.value.length > 0) {
      setIsPasswordTyped(true);
    } else {
      setIsPasswordTyped(false);
    }
  };
  const handleRegister = async (e) => {
    console.log("FormData", formData);
    e.preventDefault();
    const validateError = handleValidations();

    if (!validateError) {
      try {
        const response = await axios.post(registerRoute, formData);
        if (response.status === 200) {
          setErrMsg(false);
          setHandleValidationMessage(response.message);
          setLoading(true);
          setTimeout(() => {
            setHandleBackendMessage(response.data.message);
            setSuccessMsg(true);
            setRegistered(false);
            setLoading(false);
          }, 2000);
        }
        if (response.status === 201) {
          // Validation error, e.g., username already exists
          setErrMsg(false);
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setHandleValidationMessage(response.data.message);
            setErrMsg(true);
          }, 2000);
        }
        if (response.status === 202) {
          //email already exists error
          setErrMsg(false);
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setHandleValidationMessage(response.data.message);
            setErrMsg(true);
          }, 2000);
        }
      } catch (error) {
        console.error(error.response);

        // Other server errors
        setHandleValidationMessage("User registration failed");
        setErrMsg(true);

        setRegistered(false);
        setSuccessMsg(false);
        setLoading(false);
      }
    }
  };

  const handleValidations = (e) => {
    const usernameRegex = /^(?![A-Z0-9])[A-Za-z0-9_]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { password, confirmPassword, username, email } = formData;
    if (password !== confirmPassword) {
      setErrMsg(true);
      setHandleValidationMessage("Passwords do not match");
      return true;
    } else if (username.length < 5 || !usernameRegex.test(username)) {
      setErrMsg(true);
      setHandleValidationMessage("username must be in a valid format");
      return true;
    } else if (!emailRegex.test(email)) {
      setErrMsg(true);
      setHandleValidationMessage("Please enter a valid email address.");
      return true;
    } else {
      setErrMsg(false);
      return false;
    }
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevValue) => !prevValue);
  };
  const handleLogin = () => {
    navigate("/");
  };
  return (
    <div className="mainContainer">
      <div className="header">
        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
      {isRegistered && (
        <div className="registerContainer">
          <div className="container">
            <h1 className="LogoText">Nexus</h1>
            <form
              enctype="multipart/form-data"
              className="form"
              onSubmit={handleRegister}
            >
              <input
                type="text"
                placeholder="Full name"
                name="fullName"
                required
                onChange={handleChange}
              />
              <input
                type="text"
                placeholder="Username"
                name="username"
                required
                onChange={handleChange}
              />
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
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Confirm password"
                  name="confirmPassword"
                  required
                  onChange={handleChange}
                />
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
                  "Register"
                )}
              </button>
            </form>
            {/* Display error message */}
            {ErrMsg && <p className="ErrMsg">{handleValidationMessage}</p>}
          </div>
        </div>
      )}
      {SuccessMsg && (
        <div className="SuccessMsg">
          <div className="Message">
            <img
              width="48"
              height="48"
              src="https://img.icons8.com/color/48/checked-2--v1.png"
              alt="checked-2--v1"
            />

            <p id="message">{handleBackendMessage}</p>
          </div>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}

      {isLoading && (
        <div className="loading">
          <Oval
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
          <p>Please wait ...</p>
        </div>
      )}
    </div>
  );
};

export default Register;
