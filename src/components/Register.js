import React, { useState } from "react";
import axios from "axios";
import { Navigate , useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5001/register", {
        username,
        password,
        email,
      });

      const { user_id, access_token } = response.data;
      login({ user_id, username, access_token });

      navigate('/login')
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
