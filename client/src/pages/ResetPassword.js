import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Oval } from "react-loader-spinner";
import axios from "axios";
import { ResetPasswordRoute } from "../utils/APIRoutes";
import { EmailContext } from "../utils/EmailContext";
import "./Register.scss"
const ResetPassword = () => {
  const {ContextEmail} = useContext(EmailContext)
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(false);
  const [isReset, setReset] = useState(false);
  const [ErrMsg, setErrMsg] = useState(false);
  const [SuccessResponse, setSuccessResponse] = useState(false);
  const [handleValidationMessage, setHandleValidationMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordTyped, setIsPasswordTyped] = useState(false);
  const [NewPasswordRequest, setNewPasswordRequest] = useState({
    NewPassword:"",
    confirmPassword:"",
    email:ContextEmail
  });
  const handleChange =(e)=>{
    setNewPasswordRequest({
        ...NewPasswordRequest,    
        [e.target.name]: e.target.value,
    });
    setIsPasswordTyped(true)
  }

  const handleNewPassword = async(e)=>{
    const validation = handleValidations()
    e.preventDefault()
    if(!validation){
        try {
            const result = await axios.patch(ResetPasswordRoute, NewPasswordRequest)
            if(result.status === 200) {
                setSuccessResponse(false);
                setLoading(true);
                setErrMsg(false);
                setTimeout(() => {
                  setSuccessResponse(true);
                  setHandleValidationMessage(result.data.message);
                  setLoading(false);
                  setTimeout(() => {
                    setHandleValidationMessage("Redirecting Please wait...");
                    setTimeout(() => {
                      navigate('/reset-password')
                    }, 1000);
                  }, 1000);
                }, 2000);
              }
            } catch (error) {
              setErrMsg(false);
              setLoading(true);
              setSuccessResponse(false);
              setReset(false)
              setTimeout(() => {
                setErrMsg(true);
                setReset(false)
                setHandleValidationMessage("Password update failed Please try again");
                setLoading(false);
              }, 2000);
            }
        

    }
  }
  const handleValidations = (e) => {
    const {NewPassword, confirmPassword} = NewPasswordRequest
    if (NewPassword !== confirmPassword) {
        setErrMsg(true);
        setHandleValidationMessage("Passwords do not match");
        return true;
      }
      else{
        setErrMsg(false);
        return false;
      }
  }
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
          
            <form action="" className="form" onSubmit={handleNewPassword}>
            <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  name="NewPassword"
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
                  "Set Password"
                )}
              </button>
            </form>
         
            
          

          {ErrMsg && <p className="ErrMsg">{handleValidationMessage}</p>}
          {SuccessResponse && (
            <p className="SuccessMsg">{handleValidationMessage}</p>
          )}
          
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
