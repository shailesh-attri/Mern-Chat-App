import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { registerRoute,registrationVerifyRoute } from "../utils/APIRoutes.js";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { AuthContext } from "../utils/AuthContext.js";
const Register = () => {
  const {setAuthUser} = useContext(AuthContext)
  const [isRegistered, setRegistered] = useState(true);
  const [SuccessResponse, setSuccessResponse] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
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
  const [otp, setOtpRequest] = useState({
    otp: "",
  });
  const handleOTP = (e) => {
    

    setOtpRequest({
      ...otp,
      [e.target.name]: e.target.value,
    });
  };

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
    setLoading(true);
    e.preventDefault();
    const validateError = handleValidations();

    if (!validateError) {
      try {
        const response = await axios.post(registerRoute, formData);
        if (response.status === 200) {
          sessionStorage.setItem("NewUserOTP_Token", JSON.stringify(response.data));
          setSuccessResponse(false);

        setErrMsg(false);
        
         
          setHandleValidationMessage(response.data.message);
          setSuccessResponse(true);
          setLoading(false);
          setTimeout(() => {
            setHandleValidationMessage("Redirecting Please wait...");
            setTimeout(() => {
              setSuccessResponse(false);
              setRegistered(false)
              setIsVerified(true)
            }, 1000);
          }, 1000);
        
        }
       
      } catch (error) {
        console.error(error.response);

        // Other server errors
        setHandleValidationMessage("User registration failed");
        setErrMsg(true);

        
        setSuccessMsg(false);
        setLoading(false);
      }
    }
  };
  const requestData = {
    ...formData,
    ...otp
  }
  const handle_OTP_Verify = async(e)=>{
    e.preventDefault();
    const user = JSON.parse(sessionStorage.getItem("NewUserOTP_Token"))
    setLoading(true);
    
    try {
      const response = await axios.post(registrationVerifyRoute, requestData ,{
        headers: {
          Authorization:  `Bearer ${user.token}`,
          "Content-Type": "application/json"
        },
      })
      if(response.status === 200) {
        localStorage.setItem("userData",
        JSON.stringify(response.data)
      );
        setSuccessResponse(false);
        setAuthUser(response.data)
        setErrMsg(false);
        
        
          setSuccessMsg(true)
          setHandleValidationMessage(response.data.message);
          setLoading(false);
          setIsVerified(false)
          setTimeout(() => {
            setSuccessResponse(true);
            setHandleValidationMessage("Redirecting Please wait...");
            setTimeout(() => {
              setSuccessResponse(false);
              setRegistered(false)
              
              setSuccessMsg(true)
              navigate(`/chats/user/${response.data.id}`)
            }, 1000);
          }, 2000);
       
      }
    } catch (error) {
      setHandleBackendMessage("Registration failed")
    }
  }

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
      {isRegistered && 
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
            {SuccessResponse && (
            <p className="SuccessMsg">{handleValidationMessage}</p>
          )}
            {/* Display error message */}
            {ErrMsg && <p className="ErrMsg">{handleValidationMessage}</p>}
          </div>
        </div>
      }
      {isVerified && 
      <div className="OtpContainer">
        <h1 className="LogoText">Nexus</h1>
      <form  className="otpForm" onSubmit={handle_OTP_Verify}>
                  <input
                    type="text"
                    placeholder="Enter your OTP"
                    name="otp"
                    value={otp.otp}
                    required
                    onChange={handleOTP}
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
      
      </div>
      }
      {SuccessResponse && (
            <p className="SuccessMsg">{handleValidationMessage}</p>
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

            <p id="message">{handleValidationMessage}</p>
          </div>
          
        </div>
      )}

      
    </div>
  );
};

export default Register;
