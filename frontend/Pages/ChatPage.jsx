import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../src/App";

const ChatPage = () => {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    const { data } = await axios.get(`${server}/chats`);
    setChats(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>
      {chats.map((chat) => {
        return <div key={chat._id}>{chat.chatname} </div>;
      })}
    </div>
  );
};

export default ChatPage;
