import React, { useContext, useState } from "react";
import ChatContext from "../Context/ChatContext";
import { Box } from "@chakra-ui/react";

import MyChats from "../components/Chats/MyChats";
import ChatBox from "../components/Chats/ChatBox";
import SideDrawer from "../components/Chats/SideDrawer";

const ChatPage = () => {
  const { user } = useContext(ChatContext);
  const [fetchAgain, setFetchAgain] = useState(false);

  //! if user present then only load this and inside BOX

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}

      <Box
        display={"flex"}
        justifyContent={"space-between"}
        w={"100%"}
        h={"91.5vh"}
        p={"10px"}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}

        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
