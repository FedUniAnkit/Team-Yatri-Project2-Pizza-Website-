import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import messageService from '../../services/messageService';
import './ChatBox.css';

const ChatBox = ({ orderId, customerId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const socket = useSocket();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Join the order-specific room
    if (socket && orderId) {
      socket.emit('join_order_room', orderId);

      const handleNewMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      socket.on('new_message', handleNewMessage);

      return () => {
        socket.off('new_message', handleNewMessage);
      };
    }
  }, [socket, orderId]);

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const response = await messageService.getMessages(orderId);
        if (response.success) {
          setMessages(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };

    if (orderId) {
      fetchMessages();
    }
  }, [orderId]);

  useEffect(() => {
    // Scroll to the bottom of the chat
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Determine receiver ID
    const receiverId = user.role === 'customer' 
      ? (messages.find(m => m.Sender.role !== 'customer')?.Sender.id || null) // Find a staff/admin to reply to
      : customerId;

    if (!receiverId && user.role === 'customer') {
        // This is a fallback. In a real app, you'd likely have a dedicated support user or a better way to assign conversations.
        console.error('Cannot determine message receiver. No staff has messaged yet.');
        // You might want to inform the user here.
        return;
    }

    const messageData = {
      content: newMessage,
      receiverId,
    };

    try {
      await messageService.sendMessage(orderId, messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  return (
    <div className="chat-box-container">
      <h3>Order Conversation</h3>
      <div className="messages-list">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.senderId === user.id ? 'sent' : 'received'}`}>
            <p className="message-sender">{msg.Sender.name} ({msg.Sender.role})</p>
            <p className="message-content">{msg.content}</p>
            <span className="message-timestamp">{new Date(msg.createdAt).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
