import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import "./home.scss";
import React, { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useSelector } from "react-redux"; // Import the useSelector hook
import { selectUser } from "../../reducer/authReducer";

const Home = () => {
  const currentUser = useSelector(selectUser);

  return (
    <div className="home">
      {/* You can now use currentUser throughout the component or pass it to child components 
      <Stories user={currentUser}/>*/}
      <Posts user={currentUser} />
    </div>
  );
};

export default Home;
