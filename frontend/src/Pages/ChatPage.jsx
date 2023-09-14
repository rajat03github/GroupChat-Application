import React, { useContext } from "react";
import ChatContext from "../Context/ChatContext";
import { Box } from "@chakra-ui/react";

import MyChats from "../components/utils/MyChats";
import ChatBox from "../components/utils/ChatBox";
import SideDrawer from "../components/utils/SideDrawer";

const ChatPage = () => {
  const { user } = useContext(ChatContext);

  //! if user present then only load this and inside BOX

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}

      <Box
        display={"flex"}
        justifyContent={"space-between"}
        w={"100%"}
        h={"91.5vh"}
        p={"10px"}>
        {user && <MyChats />}

        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatPage;
