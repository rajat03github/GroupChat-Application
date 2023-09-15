import React, { useContext, useEffect, useState } from "react";
import ChatContext from "../../Context/ChatContext";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { server } from "../../App";

const MyChats = () => {
  const toast = useToast();

  const [loggedUser, setLoggedUser] = useState();

  const { user, chats, setChats, selectedChat, setSelectedChat } =
    useContext(ChatContext);

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${server}/chats`, config);
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("token")));
    fetchChats();

    // eslint-disable-next-line
  }, []);

  return <div>MyChats</div>;
};

export default MyChats;
