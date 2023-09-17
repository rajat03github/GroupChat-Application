import React, { useContext } from "react";
import ChatContext from "../../Context/ChatContext";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon, CloseIcon } from "@chakra-ui/icons";
import { getSender, getSenderFullInfo } from "../../config/ChatLogics";
import ProfileModel from "./ProfileModel";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModel
                  user={getSenderFullInfo(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                {/* <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                /> */}
              </>
            )}
          </Text>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Welcome !
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
