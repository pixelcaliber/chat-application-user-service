import React, { useEffect, useState }from 'react';
import { ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

import BlueTick from './blue-tick.svg';
import GreyTick from './grey-tick.svg';

const MessageList = ({ messages }) => {
    const { user, logout } = useAuth();
    const receiverName = localStorage.getItem("receiverName");
    const receiverId = localStorage.getItem("receiverId");
    const [lastActiveTimestamp, setLastActiveTimestamp] = useState(null);

    useEffect(() => {
        const fetchLastActiveTimestamp = async () => {
            try {
                const response = await axios.get('http://localhost:5006/user/last_active', {
                    params: {
                        user_id: receiverId
                    }
                });
                setLastActiveTimestamp(response.data.last_active_timestamp);
            } catch (error) {
                console.error('Error fetching last active timestamp:', error);
            }
        };

        fetchLastActiveTimestamp();
    }, [receiverId]);

    const isMessageRead = (message) => {
        return lastActiveTimestamp && new Date(message.timestamp) <= new Date(lastActiveTimestamp);
    };
    const getMessageDeliveryStatus = (message) => {
        if (!lastActiveTimestamp) {
            return "Delivered";
        }
        return isMessageRead(message) ? <p> <img src={BlueTick} alt="Read" className="tick-icon" /> Read</p>: <p> <img src={GreyTick} alt="Delivered" className="tick-icon" /> Delivered </p>;
    };

    return (
    <div className="container">
      <ListGroup>
        {messages && messages.map((message) => (
          <ListGroup.Item
            key={message.message_id}
            className={message.sender_id === user.user_id ? "message-item right" : "message-item left"}
          >
            <div className="message-content">
              <p className="message-sender">
              {message.sender_id === user.user_id ? user.username : receiverName}
              </p>
              <p className="message-text">{message.content}</p>
              <p className="message-time">{message.timestamp}</p>
              <p className="message-delivery-status">{message.sender_id === user.user_id && getMessageDeliveryStatus(message)}</p>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default MessageList;
