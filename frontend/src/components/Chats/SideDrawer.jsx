import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { BellIcon, ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import ChatContext from "../../Context/ChatContext";
import ProfileModel from "../utils/ProfileModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../App";
import ChatLoading from "../utils/ChatLoading";
import UserSideDrawer from "../utils/UserAvatars/UserList_SideDrawer";

const SideDrawer = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useContext(ChatContext);

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSearch = async () => {
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

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Failed To load the Search",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = () => {};
  return (
    <>
      {/* //! THE HEADER  */}

      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}>
        <Tooltip hasArrow placement="bottom-end" label="Search Users">
          <Button variant={"ghost"} onClick={onOpen}>
            <Search2Icon />
            <Text display={{ base: "none", md: "flex" }} px={"4"}>
              Search Users Here !
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Work sans"}>
          Echo-Sphere
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} color={"blackAlpha.700"} />
            </MenuButton>
            {/* <MenuList>

          </MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>LogOut</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* //! THE SIDE DRAWER */}

      <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search </DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search"
                mr={2}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleSearch();
                }}
              />
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => {
                return (
                  <UserSideDrawer
                    key={user._id}
                    user={user}
                    accessChat={() => accessChat(user._id)}
                  />
                );
              })
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
