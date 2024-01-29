import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Chat from "./components/Chat";
import { useAuth } from "./context/AuthContext";
import "./App.css";

function App() {
  const { user } = useAuth();

  useEffect(() => {
  
    if (!user) return;

    const userId = user.user_id;

    const handleActivity = async () => {
      try {
        await axios.post("http://localhost:5006/update-last-active", {
          userId,
        });
        console.log("Last active time updated successfully.");
      } catch (error) {
        console.error("Error updating last active time:", error);
      }
    };

    const handleUserActivity = () => {
      handleActivity();
    };

    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keydown", handleUserActivity);

    return () => {
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keydown", handleUserActivity);
    };

  }, [user]);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />} />
          <Route path="/chat" element={user ? <Chat /> : <Login />} />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
