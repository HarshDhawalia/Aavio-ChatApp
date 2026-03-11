import React, { useEffect, useState } from 'react';
import API from '../api/axios';

function Sidebar({ onSelectUser, onSelectRoom, selectedId }) {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const currentUserId = sessionStorage.getItem('userId');
  const currentName = sessionStorage.getItem('name');

  useEffect(() => {
    API.get('/api/users').then(res => setUsers(res.data));
    API.get(`/api/chat/rooms/user/${currentUserId}`).then(res => setRooms(res.data));
  }, [currentUserId]);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <h3 style={styles.appName}>💬 Aavio Chat</h3>
        <p style={styles.userName}>👤 {currentName}</p>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      <div style={styles.tabs}>
        <button style={activeTab === 'users' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('users')}>Users</button>
        <button style={activeTab === 'rooms' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('rooms')}>Rooms</button>
      </div>

      <div style={styles.list}>
        {activeTab === 'users' ? (
          users.filter(u => u.id !== currentUserId).map(user => (
            <div key={user.id}
              style={{ ...styles.item, background: selectedId === user.id ? '#0f3460' : 'transparent' }}
              onClick={() => onSelectUser(user)}>
              <span style={styles.avatar}>👤</span>
              <div>
                <p style={styles.itemName}>{user.name}</p>
                <p style={{ ...styles.status, color: user.status === 'ONLINE' ? '#4caf50' : '#aaa' }}>
                  {user.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          rooms.map(room => (
            <div key={room.id}
              style={{ ...styles.item, background: selectedId === room.id ? '#0f3460' : 'transparent' }}
              onClick={() => onSelectRoom(room)}>
              <span style={styles.avatar}>🏠</span>
              <div>
                <p style={styles.itemName}>{room.name}</p>
                <p style={styles.status}>Group Room</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  sidebar: { width: '280px', background: '#16213e', height: '100vh', display: 'flex', flexDirection: 'column', borderRight: '1px solid #0f3460' },
  header: { padding: '20px', borderBottom: '1px solid #0f3460' },
  appName: { color: '#e94560', margin: '0 0 4px 0' },
  userName: { color: '#fff', margin: '0 0 8px 0', fontSize: '14px' },
  logoutBtn: { background: 'transparent', border: '1px solid #e94560', color: '#e94560', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  tabs: { display: 'flex', borderBottom: '1px solid #0f3460' },
  tab: { flex: 1, padding: '12px', background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '14px' },
  activeTab: { flex: 1, padding: '12px', background: 'transparent', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: '14px', borderBottom: '2px solid #e94560' },
  list: { flex: 1, overflowY: 'auto', padding: '8px' },
  item: { display: 'flex', alignItems: 'center', padding: '12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px' },
  avatar: { fontSize: '24px', marginRight: '12px' },
  itemName: { color: '#fff', margin: 0, fontSize: '14px', fontWeight: 'bold' },
  status: { margin: 0, fontSize: '12px', color: '#aaa' }
};

export default Sidebar;