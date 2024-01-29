import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import UserSearch from "./UserSearch";

// const socket = io("http://127.0.0.1:5000/chat", { transports: ["websocket"] });

function Home() {
  const { user, login, logout } = useAuth();

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     socket.on("receive_message", (data) => {
//       console.log("Received message:", data);
//       displayMessage(data.sender_id, data.content);
//     });
//   }, []);

  const handleLogout = () => {
    logout(null);
  };
  const displayUserDetails = (userDetails) => {
    setUserData(userDetails);
  };

//   const sendMessage = () => {
//     const sender_id = "user1"; // Replace with actual user ID
//     const receiver_id = "user2"; // Replace with actual user ID
//     const content = messageInput;

//     const data = { sender_id, receiver_id, content };
//     socket.emit("send_message", data);

//     displayMessage(sender_id, content);

//     setMessageInput("");
//   };

//   const displayMessage = (sender, content) => {
//     setMessages([...messages, { sender, content }]);
//   };

  return (
    <div>
      <h1>Welcome {user && user.username}!</h1>
      {!user ? (
        <>
          <button onClick={() => (window.location.href = "/login")}>
            Login
          </button>
          <button onClick={() => (window.location.href = "/register")}>
            Register
          </button>
        </>
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>
          <UserSearch onUserDetails={displayUserDetails} />
        </>
      )}
    </div>
  );
}

export default Home;
