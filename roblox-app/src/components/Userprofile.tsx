import axios from "axios";
import { useState, useEffect } from "react";

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
    const [authorizationUrl, setAuthorizationUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true); // Initialize loading state as true

    useEffect(() => {
        // Check if the user is signed in by sending a request to the backend
        getUser();
    }, []);

    async function getUser() {
        try {
            const response = await axios.get(BASE_URL + "user/info", {
                withCredentials: true, // Send cookies with the request
            });

            if (response.data.redirectToAuth) {
                // Extract state and nonce from the authorizationUrl
                const authorizationUrl = response.data.authorizationUrl;
                const urlParams = new URLSearchParams(authorizationUrl.split("?")[1]);
                const state = urlParams.get("state");
                const nonce = urlParams.get("nonce");

                // Set cookies manually
                document.cookie = `state=${state}; path=/`;
                document.cookie = `nonce=${nonce}; path=/`;
                // User is not signed in, set authorization URL and stop loading
                setAuthorizationUrl(response.data.authorizationUrl);
                setLoading(false);
            } else {
                // User already logged in, fetch user information and stop loading
                setUser(response.data.userinfo); // Set user state with userinfo
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
            setLoading(false); // Stop loading on error
        }
    }

    return (
        <>
            {loading ? ( // Show loading indicator if loading state is true
                <div>Loading...</div>
            ) : (
                !user && ( // Show sign-in button if user is not signed in
                    <button className="signin" onClick={() => window.location.href = authorizationUrl}>
                        Sign in with Roblox
                    </button>
                )
            )}
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
