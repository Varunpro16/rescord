import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000', { withCredentials: true});

const Chat = ({ user }) => {
    console.log(user);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  useEffect(()=> {
    const fetchMsgs = async()=>{
        const res=await axios.get('http://localhost:5000/getMsgs')
        console.log(res.data.msgs);
        if(res.data.status==="success")
            setMessages(res.data.msgs)
        else
            setMessages([])
    }
    fetchMsgs()
  },[])

  useEffect(() => {
    socket.on('chat message', (data) => {
      setMessages([...messages, data]);
    });

    return () => {
      // Clean up when the component unmounts
      socket.off('chat message');
    };
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() === '') return; // Prevent sending empty messages
    const data = { msg: message, user:user };
    socket.emit('chat message', data);
    setMessage('');
  };

  return (
    <div>
      <div>
        {messages.length>0 &&  messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}: </strong>
            {msg.msg}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
