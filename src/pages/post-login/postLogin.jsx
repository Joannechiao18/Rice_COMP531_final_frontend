import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../actions/authActions";

const PostLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [renderCount, setRenderCount] = useState(0);
  const [effectCount, setEffectCount] = useState(0); // State for counting useEffect executions

  // Increment the counter each time the component renders
  useEffect(() => {
    setRenderCount((prevCount) => prevCount + 1);
  });

  //console.log("PostLogin render count:", renderCount);

  /*useEffect(() => {
    console.log("in PostLogin useEffect");
    // Function to check the current user session
    const checkUserSession = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/checkThirdPartyLogin",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("response", response);

        if (response.ok) {
          const data = await response.json();
          console.log("returned data", data);

          if (data.user) {
            // User is logged in, you can now update your frontend state
            console.log("Logged in user:", data.user);
            // Update your state here
            navigate("/");
          } else {
            console.log("No active user session found");
            // Handle the case where there is no active user session
          }
        } else {
          console.error("Failed to fetch user session");
          // Handle the case where fetching the user session failed
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    checkUserSession();
  }, []);*/
  const PostLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
      setEffectCount((prevCount) => prevCount + 1);
      console.log("PostLogin useEffect count:", effectCount);

      console.log("in PostLogin useEffect");
      const checkUserSession = async () => {
        // Make an API call to check if the user is authenticated
        const response = await fetch(
          "http://localhost:3000/checkThirdPartyLogin",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (data.isAuthenticated) {
          console.log("Logged in user:", data.user);
          // User is authenticated, dispatch login action and redirect
          dispatch(login(data.user));
          navigate("/"); // Redirect to dashboard or home page
        } else {
          // User is not authenticated, redirect to login page
          navigate("/login");
        }
      };

      checkUserSession();
    }, [navigate, dispatch]);

    return <div>Loading...</div>;
  };

  return <div>Loading...</div>;
};

export default PostLogin;
