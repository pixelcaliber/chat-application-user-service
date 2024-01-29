import React, { useEffect, useState } from "react";
import axios from "axios";
import { ListGroup, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import MessageList from "./MessageList";
import { useAuth } from "../context/AuthContext";
import { MESSAGE_SERVICE_PORT } from "../utils/constants";

function Chat() {
  const chatId = localStorage.getItem("room_chat");
  console.log(chatId);
  const [messages, setMessages] = useState([]);
  const [pagingState, setPagingState] = useState(null);
  const [startingTimestamp, setStartingTimestamp] = useState(null);
  const { user, logout } = useAuth();
  const [receiverActive, setReceiverActive] = useState(false);
  const receiverId = localStorage.getItem("receiverId");
  const receiverName = localStorage.getItem("receiverName");

  useEffect(() => {
    // Make a query to the database to find out the receiver's activity state
    const fetchReceiverActivity = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5006/user/user_activity?username=${receiverName}`
        );
        console.log(response.data);
        setReceiverActive(response.data.active); // Assuming the response contains an 'active' field indicating receiver's activity state
      } catch (error) {
        console.error("Error fetching receiver activity:", error);
      }
    };
    const updateReadReceipts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5006/user/update_read_receipts"
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching read receipts:", error);
      }
    };

    fetchReceiverActivity();
  }, []); // Fetch receiver activity whenever receiver changes

  const fetchMessages = async () => {
    try {
      const FETCH_MESSAGE_URL =
        "http://127.0.0.1:" + MESSAGE_SERVICE_PORT + "/users/chat/" + chatId;

      const response = await axios.post(
        FETCH_MESSAGE_URL,

        {
          paging_state_id: pagingState || null,
          starting_timestamp_str: startingTimestamp || null,
          fetch_size: 5,
        }
      );

      const data = response.data;
      console.log(data);

      setPagingState(
        data.next_paging_state_id !== undefined
          ? data.next_paging_state_id
          : null
      );

      if (data && data.user_messages && data.user_messages.length > 0) {
        setStartingTimestamp(
          data.user_messages[data.user_messages.length - 1].timestamp
        );
        setMessages((prevMessages) => [...prevMessages, ...data.user_messages]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const loadMoreMessages = () => {
    fetchMessages();
  };
  const handleLogout = () => {
    logout(null);
  };
  return (
    <div className="container">
      <h1 className="text-center mb-4">
        {" "}
        <div
          className="dot-indicator"
          style={{
            backgroundColor: receiverActive ? "green" : "gray",
            margin: "8px",
          }}
        />{" "}
        {receiverName}
      </h1>

      {messages.length > 0 && <MessageList messages={messages} />}

      {pagingState && (
        <div className="text-center mt-4">
          <Button variant="primary" onClick={loadMoreMessages}>
            Load More
          </Button>
        </div>
      )}

      {messages.length == 0 && <div> No chat history found! </div>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Chat;
