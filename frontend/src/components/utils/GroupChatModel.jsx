import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  useDisclosure,
  FormControl,
  Input,
  Spinner,
  Box,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import ChatContext from "../../Context/ChatContext";
import axios from "axios";
import { server } from "../../App";
import UserSideDrawer from "./UserAvatars/UserList_SideDrawer";
import UserBadgeGroup from "./UserAvatars/UserBadgeGroup";

const GroupChatModel = ({ children }) => {
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = useContext(ChatContext);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${server}/users/getusers?search=${search}`,
        config
      );
      console.log(data);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };
  const handleGroupResults = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    //*spread and then add the users
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToDelte) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel?._id !== userToDelte._id)
    );
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "All fields are required",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${server}/chats/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        title: "Group Created",
        status: "success",
        duration: 3000,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Group Created",
        description: error.response.data,
        status: "error",
        duration: 3000,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="search for people"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedUsers.map((u) => {
                return (
                  <UserBadgeGroup
                    key={u._id}
                    user={u}
                    handleFunction={() => {
                      handleDelete(u);
                    }}
                  />
                );
              })}
            </Box>

            {loading ? (
              <Spinner />
            ) : (
              searchResults?.slice(0, 4).map((u) => {
                return (
                  <UserSideDrawer
                    key={u._id}
                    user={u}
                    handleFunction={() => {
                      handleGroupResults(u);
                    }}
                  />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
