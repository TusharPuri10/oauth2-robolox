import axios from "axios";
import { useState } from "react";

// Define an interface for the user object
interface User {
    aud: string;
    created_at: number;
    exp: number;
    iat: number;
    iss: string;
    jti: string;
    name: string;
    nbf: number;
    nickname: string;
    nonce: string;
    picture: string;
    preferred_username: string;
    profile: string;
    sub: string;
  }

export const Userprofile = () => {
  const BASE_URL = "http://localhost:3000/";
  const [user, setUser] = useState<User | null>(null); // Initialize user state as null

  async function getuser() {
    try {
      await axios.get(BASE_URL + "user/info", {
        withCredentials: true, // Send cookies with the request
      }).then((response) => {
        if (response.data.redirectToAuth) {
          // Extract state and nonce from the authorizationUrl
          const authorizationUrl = response.data.authorizationUrl;
          const urlParams = new URLSearchParams(authorizationUrl.split("?")[1]);
          const state = urlParams.get("state");
          const nonce = urlParams.get("nonce");

          // Set cookies manually
          document.cookie = `state=${state}; path=/`;
          document.cookie = `nonce=${nonce}; path=/`;

          // Redirect to the authorization URL
          window.location.href = authorizationUrl;
        } else {
          // User already logged in, fetch user information
          setUser(response.data.userinfo); // Set user state with userinfo
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <button className="signin" onClick={getuser}>
        Sign in with Roblox
      </button>
      <div>
        {user && (
          <div>
            <p>Username: {user.preferred_username}</p>
            <p>Name: {user.name}</p>
            <p>Profile: <a href={user.profile}>{user.profile}</a></p>
            <img src={user.picture} alt="Profile Picture" />
            {/* Render other user properties as needed */}
          </div>
        )}
      </div>
    </>
  );
};
