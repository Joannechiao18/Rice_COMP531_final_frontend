import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import PlaceIcon from "@mui/icons-material/Place";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CakeIcon from "@mui/icons-material/Cake";
import PhoneIcon from "@mui/icons-material/Phone";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditProfileModal from "../../components/modal/EditProfileModal";
import "./profile.scss";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../reducer/authReducer";
import { login } from "../../actions/authActions";
import styled from "styled-components";

const BaseButton = styled.button`
  width: auto;
  border: none;
  border-radius: 5px;
  padding: 5px 15px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
`;

const EditButton = styled(BaseButton)`
  color: white;
  background-color: #938eef; // Mimicking Bootstrap btn-danger color
  margin-right: 5px; // Add some margin to the right of the Cancel button

  &:hover {
    background-color: #7a75d6; // Darker shade for hover effect
  }
`;

const Profile = () => {
  const currentUser = useSelector(selectUser) || {};

  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    dob: "",
    phone: "",
    zipcode: "",
    password: "",
    avatar: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = currentUser.username;

        console.log("username", username);

        const fetchJsonData = async (url) => {
          const response = await fetch(url, {
            method: "GET",
            credentials: "include",
            //mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(
              `Error: ${response.status} - ${response.statusText}`
            );
          }

          return await response.json();
        };

        // Fetch user details (email, phone, etc.)
        const emailData = await fetchJsonData(
          //`https://yw187server-3d9494142af2.herokuapp.com/email/${username}`
          `http://localhost:3000/email/${username}`
        );

        const dobData = await fetchJsonData(
          //`https://yw187server-3d9494142af2.herokuapp.com/email/${username}`
          `http://localhost:3000/dob/${username}`
        );

        const phoneData = await fetchJsonData(
          //`https://yw187server-3d9494142af2.herokuapp.com/phone/${username}`
          `http://localhost:3000/phone/${username}`
        );
        const zipcodeData = await fetchJsonData(
          //`https://yw187server-3d9494142af2.herokuapp.com/zipcode/${username}`
          `http://localhost:3000/zipcode/${username}`
        );
        const avatarData = await fetchJsonData(
          `http://localhost:3000/avatar/${username}`
        );

        // Update state with the fetched data
        setProfileData({
          username: username,
          email: emailData.email,
          dob: dobData.dob,
          phone: phoneData.phone,
          zipcode: zipcodeData.zipcode,
          avatar: avatarData.avatar,
        });
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleUpdateProfile = (formData) => {
    dispatch(
      login({
        ...currentUser,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        zipcode: formData.zipcode,
      })
    );
    setIsModalOpen(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setProfilePicture(reader.result);
        handleUploadProfilePicture(file); // Call upload function here
      };

      reader.readAsDataURL(file);
    }
  };

  const handleUploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    if (file) {
      const response = await fetch(`http://localhost:3000/avatar`, {
        method: "PUT",
        credentials: "include",

        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update avatar.");
      }

      const updatedData = await response.json();

      dispatch(
        login({
          ...currentUser,
          avatar: updatedData.avatar,
        })
      );

      setProfileData((prevData) => ({
        ...prevData,
        avatar: updatedData.avatar,
      }));
    }
  };

  useEffect(() => {}, [profilePicture]);

  return (
    <div className="profile container mt-4">
      <Link to="/">
        <ArrowBackIosIcon className="back-button" />
      </Link>
      <div className="row mt-5">
        <div className="col-12 text-center mt-3">
          <div className="profile-pic-wrapper">
            <img
              src={profileData.avatar}
              //alt={currentUser ? profileData.username : "User"}
              className="img-fluid rounded-circle profile-pic"
            />

            <input
              type="file"
              id="profile-pic-input"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, handleUploadProfilePicture)}
              accept="image/*"
            />
            <label
              htmlFor="profile-pic-input"
              className="profile-picture-label"
            >
              <AddAPhotoIcon
                onClick={handleUploadProfilePicture}
                style={{ fontSize: 18, color: "#938eef" }}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-4 text-center"></div>
        <div className="col-4 text-center">
          <h3>
            <strong>{profileData.username}</strong>
          </h3>
          <p>
            <EmailOutlinedIcon /> {profileData.email}
          </p>
          <p>
            <CakeIcon />
            {profileData.dob}
          </p>
          <p>
            <PhoneIcon /> {profileData.phone}
          </p>
          <p>
            <PlaceIcon />
            {profileData.zipcode}
          </p>
          {/*<p>
            <VisibilityOffIcon />
            {profileData.password && "*".repeat(profileData.password.length)}
            </p>*/}
          <EditButton onClick={handleEditClick}>Edit</EditButton>
        </div>
        <div className="col-4 text-center"></div>
      </div>
      <EditProfileModal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        user={currentUser}
        onUpdate={handleUpdateProfile}
      />
    </div>
  );
};

export default Profile;
