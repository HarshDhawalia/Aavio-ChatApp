import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import API from '../api/axios';
import Sidebar from './Sidebar';

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);
  const selectedUserRef = useRef(null);
  const currentUserId = sessionStorage.getItem('userId');
  const currentName = sessionStorage.getItem('name');
  const currentEmail = sessionStorage.getItem('email');

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        client.subscribe(`/topic/user.${currentEmail}`, (msg) => {
          const received = JSON.parse(msg.body);
          // Only add if it's an incoming message (not sent by me)
          if (received.senderId !== currentUserId) {
            if (selectedUserRef.current) {
              setMessages(prev => [...prev, received]);
            }
          }
        });
      }
    });
    client.activate();
    stompClient.current = client;
    return () => client.deactivate();
  }, [currentEmail, currentUserId]);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setSelectedRoom(null);
    const res = await API.get(`/api/chat/messages/${currentUserId}/${user.id}`);
    setMessages(res.data);
  };

  const handleSelectRoom = async (room) => {
    setSelectedRoom(room);
    setSelectedUser(null);
    if (stompClient.current?.connected) {
      stompClient.current.subscribe(`/topic/room.${room.id}`, (msg) => {
        setMessages(prev => [...prev, JSON.parse(msg.body)]);
      });
    }
    const res = await API.get(`/api/chat/rooms/${room.id}/messages`);
    setMessages(res.data);
  };

  const sendMessage = () => {
    if (!input.trim() || !stompClient.current?.connected) return;

    const message = {
      senderId: currentUserId,
      content: input,
      type: 'CHAT'
    };

    if (selectedUser) {
      message.receiverId = selectedUser.email;
      stompClient.current.publish({
        destination: '/app/chat.privateMessage',
        body: JSON.stringify(message)
      });
      // Immediately show message in sender's chat
      setMessages(prev => [...prev, {
        ...message,
        timestamp: new Date().toISOString()
      }]);
    } else if (selectedRoom) {
      message.roomId = selectedRoom.id;
      stompClient.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(message)
      });
    }
    setInput('');
  };

  return (
    <div style={styles.container}>
      <Sidebar
        onSelectUser={handleSelectUser}
        onSelectRoom={handleSelectRoom}
        selectedId={selectedUser?.id || selectedRoom?.id}
      />
      <div style={styles.chatArea}>
        {!selectedUser && !selectedRoom ? (
          <div style={styles.placeholder}>
            <h2 style={{ color: '#e94560' }}>👋 Welcome, {currentName}!</h2>
            <p style={{ color: '#aaa' }}>Select a user or room to start chatting</p>
          </div>
        ) : (
          <>
            <div style={styles.chatHeader}>
              <h3 style={styles.chatTitle}>
                {selectedUser ? `💬 ${selectedUser.name}` : `🏠 ${selectedRoom.name}`}
              </h3>
            </div>
            <div style={styles.messages}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  ...styles.messageBubble,
                  alignSelf: msg.senderId === currentUserId ? 'flex-end' : 'flex-start',
                  background: msg.senderId === currentUserId ? '#e94560' : '#0f3460'
                }}>
                  <p style={styles.messageText}>{msg.content}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div style={styles.inputArea}>
              <input
                style={styles.input}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
              />
              <button style={styles.sendBtn} onClick={sendMessage}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', background: '#1a1a2e' },
  chatArea: { flex: 1, display: 'flex', flexDirection: 'column' },
  placeholder: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  chatHeader: { padding: '16px 20px', background: '#16213e', borderBottom: '1px solid #0f3460' },
  chatTitle: { color: '#fff', margin: 0 },
  messages: { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' },
  messageBubble: { maxWidth: '60%', padding: '10px 16px', borderRadius: '16px' },
  messageText: { color: '#fff', margin: 0, fontSize: '14px' },
  inputArea: { display: 'flex', padding: '16px', background: '#16213e', borderTop: '1px solid #0f3460', gap: '12px' },
  input: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #0f3460', background: '#0f3460', color: '#fff', fontSize: '14px' },
  sendBtn: { padding: '12px 24px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }
};

export default ChatRoom;