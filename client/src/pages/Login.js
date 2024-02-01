import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Oval } from "react-loader-spinner";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";
const Login = () => {
  const [isLoading, setLoading] = useState(false);
  const [ErrMsg, setErrMsg] = useState(false);
  const [SuccessResponse, setSuccessResponse] = useState(false);
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
  const handleLogin = async(e) => {
    e.preventDefault();
    try {
      const res = await axios.post(loginRoute,loginData )
      if(res.status === 200){
        setSuccessResponse(false);
          setLoading(true);
          setErrMsg(false)
          setTimeout(() => {
            setSuccessResponse(true)
            setHandleValidationMessage(res.data.message);
            setLoading(false);
            setTimeout(() => {
              setHandleValidationMessage("Redirecting Please wait...");
              setTimeout(() => {
                navigate('/chats')
              },1000)
            },1000)
          }, 2000);
      }
      
    } catch (error) {
      // Other server errors
      setErrMsg(false)
      setLoading(true);
      setSuccessResponse(false)
      setTimeout(() => {
        setErrMsg(true)
        setHandleValidationMessage("Invalid credentials. Please try again");
        setLoading(false);
      }, 2000);
      
    }
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
                {isPasswordTyped && (showPassword ? <FaEyeSlash /> : <FaEye />)}
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
          {ErrMsg && <p className="ErrMsg">{handleValidationMessage}</p>}
          {SuccessResponse && <p className="SuccessMsg">{handleValidationMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
