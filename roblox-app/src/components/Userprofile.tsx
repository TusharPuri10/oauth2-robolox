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

    useEffect(() => {
        // Check if the user is signed in by sending a request to the backend
        getUser();
    }, []);

    async function getUser() {
        try {
            await axios.get(BASE_URL + "user/info", {
                withCredentials: true, // Send cookies with the request
            }).then((res) => {
                // Set the user state to the response data
                setUser(res.data.userinfo);
            });

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <div>
                <button onClick={()=>window.location.href = BASE_URL + "user/info"}>sign in</button>
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
