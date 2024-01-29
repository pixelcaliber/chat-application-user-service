import React, { useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Chat from "./Chat";
import { useNavigate } from "react-router-dom";
import { MESSAGE_SERVICE_PORT } from "../utils/constants";
function UserSearch() {
  const { user, receiver, setReceiverId } = useAuth();
  const [username, setUserName] = useState("");
  const [userData, setUserData] = useState(null);
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate(); // Access navigate function from react-router-dom


  const handleSearch = async () => {
    setReceiverId(null);
    localStorage.removeItem('receiverName');
    try {
      console.log(user.access_token);
      console.log(username);
      const response = await axios.get(
        `http://localhost:5001/users/username/${username}`,
        {
          // headers: {
          //   Authorization: `Bearer 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcwNjA5MzczMywianRpIjoiNDg0OGM5MDQtMjg1MC00MGE2LWE1NmUtZDE2YjY4M2UxZmE0IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJ1c2VybmFtZSI6ImFhYWFhYSIsImVtYWlsIjoiYXMifSwibmJmIjoxNzA2MDkzNzMzLCJjc3JmIjoiOTc5NGZhNmUtNzQxZS00NzEzLTkzYTAtNzBhNTIzMjQyMmNiIiwiZXhwIjoxNzA2MDk0NjMzfQ.2dzYDFjyt1QvyE5IIog-QJshFnUr2KUZxiSs4RLlyGs'`,
          // },
        }
      );
      localStorage.setItem('receiverId', response.data.user_id);
      localStorage.setItem('receiverName', response.data.username);
      setReceiverId(response.data);
      setUserData(response.data);
      // console.log(receiver)

    } catch (error) {
      console.error("Error searching for user:", error);
    }
  };
  const handleStartPrivateChat = () => {
    const MESSAGE_SERVICE_URL = "http://127.0.0.1:" + MESSAGE_SERVICE_PORT + "/chat"
    const socket = io(MESSAGE_SERVICE_URL, {
      transports: ["websocket"],
    });

    socket.emit("start_private_chat", {
      sender_id: user.user_id,
      receiver_id: userData.user_id,
    });

    socket.on("private_chat_room_created", (data) => {
      console.log("room created:" + data)
      setRoomName(data);
      localStorage.setItem('room_chat', data);
      navigate('/chat')
      
    });
    
  };
  return (
    <div>
      <h2>User Search</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Enter username"
      />
      <button onClick={handleSearch}>Search</button>

      {userData && (
        <div>
          <h3>User Details</h3>
          <p>Username: {userData.username}</p>
          <p>User ID: {userData.user_id}</p>
          {userData.username !== user.username && (
            <button onClick={handleStartPrivateChat}>Start Conversation</button>
          )}
        </div>
      )}
      {/* {
        roomName && <Chat chatId={roomName} />
      } */}
    </div>
  );
}

export default UserSearch;
