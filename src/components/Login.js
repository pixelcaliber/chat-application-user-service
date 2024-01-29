// Login.js
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/login", {
        username,
        password,
      });
      const { user_id, access_token } = response.data;
      login({ user_id, username, access_token });
      navigate('/')
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    navigate('/register')
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Login;
