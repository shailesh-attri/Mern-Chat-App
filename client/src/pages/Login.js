import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
const Login = () => {
  const [ErrMsg, setErrMsg] = useState(false);
  const [handleValidationMessage, setHandleValidationMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordTyped, setIsPasswordTyped] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
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
  const handleRegister = (e) => {
    e.preventDefault();
    console.log(loginData);
    setLoginData("");
    navigate("/login");
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevValue) => !prevValue);
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
          <form action="" className="form" onSubmit={handleRegister}>
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
                {isPasswordTyped && (showPassword ? <FaEyeSlash /> : <FaEye />)}
              </span>
            </div>

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
