import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, Image as ImageIcon } from 'lucide-react';

function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null); // The ID of the person we are chatting with
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`http://localhost:3001/api/messages/${user.id}`);
      const data = await res.json();
      setMessages(data);
    };
    fetchMessages();
  }, [user]);

  // Group messages by counterpart user ID
  const chatGroups = {};
  messages.forEach(msg => {
    const counterpartId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
    const counterpartName = msg.sender_id === user.id ? msg.receiver_name : msg.sender_name;
    const counterpartAvatar = msg.sender_id === user.id ? msg.receiver_avatar : msg.sender_avatar;
    
    if (!chatGroups[counterpartId]) {
      chatGroups[counterpartId] = {
        id: counterpartId,
        name: counterpartName,
        avatar: counterpartAvatar,
        msgs: []
      };
    }
    chatGroups[counterpartId].msgs.push(msg);
  });

  const sendMessage = async () => {
    if (!inputText.trim() || !currentChatId) return;
    const res = await fetch('http://localhost:3001/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: user.id, receiverId: currentChatId, content: inputText })
    });
    const { id, timestamp } = await res.json();
    const newMsg = {
      id,
      sender_id: user.id,
      receiver_id: currentChatId,
      content: inputText,
      timestamp,
      status: 'sent',
      sender_name: user.name,
      sender_avatar: user.avatar_url,
      receiver_name: chatGroups[currentChatId].name, // Mock implementation assumes user has previous chat
      receiver_avatar: chatGroups[currentChatId].avatar
    };
    setMessages([...messages, newMsg]);
    setInputText('');
  };

  // Chat Screen View
  if (currentChatId) {
    const group = chatGroups[currentChatId] || { msgs: [] };
    return (
      <div className="chat-window">
        {/* Header back button overlay */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <button className="btn-icon" onClick={() => setCurrentChatId(null)}>{'<'}</button>
          <img src={group.avatar} alt="avatar" className="avatar" style={{ width: '40px', height: '40px' }} />
          <h2 style={{ fontSize: '1.1rem' }}>{group.name}</h2>
        </div>
        
        <div className="chat-messages">
          {group.msgs.map(msg => {
            const isMe = msg.sender_id === user.id;
            return (
              <div key={msg.id} className={`chat-bubble ${isMe ? 'sent' : 'received'}`}>
                {msg.content}
                <div style={{ fontSize: '0.65rem', textAlign: 'right', marginTop: '4px', opacity: 0.7 }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="chat-input-area">
          <button className="btn-icon" style={{ background: 'transparent' }}><ImageIcon size={20} color="#a0a0a0" /></button>
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Message..." 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button className="chat-send" onClick={sendMessage}><Send size={20} /></button>
        </div>
      </div>
    );
  }

  // Chat List View
  return (
    <div className="flex-col">
      {Object.values(chatGroups).map(group => {
        const lastMsg = group.msgs[group.msgs.length - 1];
        return (
          <div key={group.id} className="chat-list-item" onClick={() => setCurrentChatId(group.id)}>
            <img src={group.avatar} alt="avatar" className="avatar" />
            <div className="chat-info">
              <div className="chat-name">{group.name}</div>
              <div className="chat-preview">
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                  {lastMsg.sender_id === user.id ? 'You: ' : ''}{lastMsg.content}
                </span>
                <span className="chat-time">
                  {new Date(lastMsg.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      {Object.keys(chatGroups).length === 0 && <p className="text-secondary">No messages yet.</p>}
    </div>
  );
}

export default Messages;
