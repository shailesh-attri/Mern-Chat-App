import React, { useContext, useState,useEffect } from "react";
import "./UpdateProfile.scss";
import { FaCameraRetro } from "react-icons/fa";
import defaultImage from "../../assets/defaultImage.png";
import { changeAvatarRoute,deleteAvatarRoute } from "../../utils/APIRoutes";
import axios from "axios";
import { AuthContext } from "../../utils/AuthContext";
import { TailSpin } from "react-loader-spinner";
import { editUserRoute,UpdatePasswordRoute } from "../../utils/APIRoutes";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
const UpdateProfile = () => {
  const { authUser,sendAvatarData,loggedUser,sendUpdateProfileData } = useContext(AuthContext);
  const userId = authUser?.id;
  const token = authUser?.token
  //useStates
  const [selectedOption, setSelectedOption] = useState(0); // State to track selected option

  const selectOption = (index) => {
    setSelectedOption(index);
  };
  
  return (
    <div className="mainProfile">
      <div className="Header">
        <span
          className={selectedOption === 0 ? "option selected" : "option"}
          onClick={() => selectOption(0)}
        >
          Edit Profile
        </span>
        <span
          className={selectedOption === 1 ? "option selected" : "option"}
          onClick={() => selectOption(1)}
        >
          Change password
        </span>
      </div>

      {selectedOption === 0 ? (
        <UpdateProfileComponent
          defaultImage={defaultImage}
          changeAvatarRoute={changeAvatarRoute}
          userId={userId}
          sendAvatarData={sendAvatarData}
          loggedUser={loggedUser}
          token={token}
          sendUpdateProfileData={sendUpdateProfileData}
        />
      ) : (
        <UpdatePassword 
          token={token}
        />
      )}
    </div>
  );
};

export default UpdateProfile;
const UpdateProfileComponent = ({
  changeAvatarRoute,
  userId,
  sendAvatarData,
  loggedUser,
  defaultImage,
  token,
  sendUpdateProfileData
}) => {
  const [isLoading, setLoading] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
  const [isDeleted, setDeleted] = useState(false);
  const [successMessage, setSuccessMessage] = useState(true);
  const [showImage, setShowImage] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [formData, setFormData] = useState({})
  useEffect(() => {
    setFormData({
      fullName: loggedUser?.fullName,
      email: loggedUser?.email,
      username: loggedUser?.username,
      bio: loggedUser?.bio,
    });
  }, [loggedUser])
  useEffect(() => {
    if (loggedUser && loggedUser.avatarUrl) {
      setShowImage(loggedUser?.avatarUrl);
    } else {
      setShowImage(defaultImage);
    }
  },[loggedUser,defaultImage])
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    setImage(file);
    const fileName = file?.name;
    const fileExtension = fileName.split('.').pop(); // Get the file extension
    const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.'); // Get the file name without extension
    
    // Get the first three characters of the file name (or less if the file name is shorter)
    const shortenedFileName = fileNameWithoutExtension.substring(0, Math.min(fileNameWithoutExtension.length, 5));
    
    // Combine the first three characters, an ellipsis, and the file extension
    const displayedFileName = `${shortenedFileName}${fileNameWithoutExtension.length > 3 ? '...' : ''}.${fileExtension}`;
    
    setFileName(displayedFileName);
    reader.onloadend = () => {
      // Set the image state with the uploaded image
      setShowImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleUploadImage = async () => {
    setUpdating(true)
    setLoading(true)
    if(!image){
      alert("Please select an image")
    }
    try {
      const res = await axios.patch(
        `${changeAvatarRoute}/${userId}`,
        { dpImage: image },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        setUpdating(false)
        setLoading(false)
        setSuccessMessage(res.data);
        sendAvatarData(res.data)
      }
    } catch (error) {
      console.log("Upload failed", error.message);
    }
  };
  const handleDeleteImage = async () => {
    setDeleted(true)
    try {
      const result = await axios.delete(deleteAvatarRoute, {
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      if(result.status === 200) {
        setDeleted(false)
        setSuccessMessage(result.data);
        sendAvatarData(result.data)
      }
    } catch (error) {
      console.log("Delete failed", error.message);
    }
  }
const handleFormInput = (e)=>{
  setFormData({
    ...formData,
    [e.target.name] : e.target.value
  })
}
  const handleUpdateProfile = async(e)=>{
    setLoading(true)
    e.preventDefault();
    try {
      const res = await axios.put(editUserRoute, formData, {
        headers:{
          Authorization:`Bearer ${token}`,
        }
      })
      if(res.status === 200){
        
        setLoading(false)
        setSuccessMessage(res.data);
        sendUpdateProfileData(res.data)
      }
    } catch (error) {
      console.log("Error in updating profile", error);
    }
  }
  
  const successUpdating = !isLoading && successMessage
  useEffect(() => {
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  },[successMessage,!isLoading,])
  useEffect(()=>{
    const imageURL = loggedUser && loggedUser?.avatarUrl || defaultImage
    setImageUrl(imageURL)
  },[loggedUser,defaultImage,successMessage])
  return (
    <div className="mainInputs">
      <div className="profileImage">
        <div className="dpImage">
        {isLoading ? 
        <div className="Loader">

        <TailSpin 
              height="30"
              width="40"/>
        </div>
              :
          <img src={imageUrl} />
              }
        </div>
        <label htmlFor="fileInput">
          <span className="upload">
            <span className="uploadImg">
            {fileName ?  <span className="fileName">{fileName}</span>
            :
            <span><FaCameraRetro/> Upload</span> 
            }
              
            </span>
            <span className="updateImg" onClick={handleUploadImage}>
              <button>
              {isUpdating ? 
              <TailSpin 
              height="30"
              width="40"/>
              : "Set Picture"}</button>
            </span>
            <span className="updateImg" onClick={handleDeleteImage}>
              <button>
              {isDeleted ? 
              <TailSpin 
              height="30"
              width="40"/>
              : "Delete Picture"}</button>
            </span>
          </span>
          <input
            id="fileInput"
            type="file"
            name="image"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />
        </label>
        
        
      </div>
      <div className="editBox">
        <form onSubmit={handleUpdateProfile}>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            required=""
            placeholder="Full Name"
            onChange={handleFormInput}
          />
          <input
            type="text"
            name="username"
            value={formData.username}
            required=""
            placeholder="username"
            onChange={handleFormInput}
          />
          <input 
            value={formData.email}
            type="email" 
            name="email" 
            placeholder="Email" 
            onChange={handleFormInput}
            readOnly="true"
            style={{backgroundColor: '#070707'}}
            onClick={()=>alert("Email can't be changed")}
            />
          <input
            value={formData.bio}
            type="text" 
            name="bio" 
            onChange={handleFormInput}
            placeholder="Bio" />
          <button type="submit">
            <span> Update</span>
          </button>
          {successUpdating && <p className="successTrue">{successMessage.message}</p>}
        </form>
      </div>
    </div>
  );
};
const UpdatePassword = ({token}) => {
  const [isLoading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [password, setPassword] = useState({
  currentPassword:'',
  newPassword:'',
  confirmPassword:'',
})
const handleInputPasswordChange = (e)=>{
  setPassword({
    ...password,
    [e.target.name]: e.target.value
  })
}


  // Requests hitting
  const handleUpdatePassword =async (e)=>{
    setLoading(true)
    e.preventDefault()
    try {
      if(password.newPassword !== password.confirmPassword){
        toast.error("Passwords do not match")
        setLoading(false)
        setSuccess('');
        setFailed('')
      }else{

        const result = await axios.post(UpdatePasswordRoute, password, {
          headers:{
            Authorization:`Bearer ${token}`,
          }
        })
        if(result.status === 200) {
          setLoading(false)
          setSuccess(result.data.message);
          console.log(result.data.message);
          setPassword({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
          setFailed('')
        }
        
      }
    } catch (error) {
     
      if (error.response) {
        // Handle different error status codes
        if (error.response.status === 404) {
          setLoading(false)
          setFailed(error.response.data.message)
          setSuccess('');
        }
      }
    }
  }
  const successMsg = !isLoading && success
  const failedMsg = failed
  return (
    <div className="updatePassWord">
      <div className="editBox">
        <form onSubmit={handleUpdatePassword}>
          <input
            type="text"
            value={password.currentPassword}
            name="currentPassword"
            required
            placeholder="Current Password"
            autoComplete="off"
            onChange={handleInputPasswordChange}
          />
          <input
            type="text"
            name="newPassword"
            required
            value={password.newPassword}
            placeholder="New Password"
            autoComplete="off"
            onChange={handleInputPasswordChange}
          />
          <input
            type="text"
            name="confirmPassword"
            required
            value={password.confirmPassword}
            placeholder="Confirm Password"
            autoComplete="off"
            onChange={handleInputPasswordChange}
          />

          <button type="submit" className="sbtBtn">
            <span>{isLoading ? 
              <TailSpin 
              height="30"
              width="40"/>
              : "Update"}</span>
          </button>
        {successMsg && <p className="SuccessMsg">{success}</p>}
        {failedMsg && <p className="failed">{failed}</p>}
        </form>
        
        <ToastContainer></ToastContainer>
      </div>
    </div>
  );
};
