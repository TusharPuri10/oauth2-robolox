import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Signin = () => {
  const navigate = useNavigate();
  const BASE_URL = 'http://localhost:3000/';
  async function signin() {
    console.log(BASE_URL)
    try {
      await axios
        .post(BASE_URL + "authentication/signin", {
          username: "testing",
          password: "123",
        })
        .then((response) => {
          console.log(response.data);
        });
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <button className="signin" onClick={signin}>
        {" "}
        Sign in with roblox
      </button>
    </>
  );
};
