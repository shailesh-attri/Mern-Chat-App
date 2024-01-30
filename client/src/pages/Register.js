import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
const Register = () => {
  const [ErrMsg, setErrMsg] = useState(false);
  const [handleValidationMessage, setHandleValidationMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordTyped, setIsPasswordTyped] = useState(false);
  const [formData, setFormData] = useState({
    fullName:"",
    username: "",
    email: "",
    phoneNo:"",
    password: "",
    confirmPassword: "",
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
  const handleRegister = (e) => {
    e.preventDefault();
    console.log(formData);
    setFormData("");
    handleValidations();
  };
  const handleValidations = (e) => {
    const { password, confirmPassword, username, email } = formData;
    if (password !== confirmPassword) {
      setErrMsg(true);
      setHandleValidationMessage("Passwords do not match");
    }else if(username.length < 3){
      setErrMsg(true);
      setHandleValidationMessage("username must be at least 5 characters");
    } 
     else {
      setErrMsg(false);
    }
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevValue) => !prevValue);
  };
  return (
    <div className="mainContainer">
      <div className="header">
        <p>

          Already have an account? <Link to="/login">Login</Link>
        </p>
       
      </div>
      <div className="registerContainer">
        <div className="container">
          <h1 className="LogoText">Nexus</h1>
          <form action="" className="form" onSubmit={handleRegister}>
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
            <input
              type="text"
              placeholder="Phone Number"
              name="phoneNo"
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
            <button type="submit">Register</button>
          </form>
          {/* Display error message */}
          {ErrMsg && <p className="ErrMsg">{handleValidationMessage}</p>}
          
        </div>
      </div>
    </div>
  );
};

export default Register;
