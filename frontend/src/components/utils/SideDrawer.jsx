import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { BellIcon, ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import ChatContext from "../../Context/ChatContext";
import ProfileModel from "./ProfileModel";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { user } = useContext(ChatContext);

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      bg={"white"}
      w={"100%"}
      p={"5px 10px 5px 10px"}
      borderWidth={"5px"}>
      <Tooltip hasArrow placement="bottom-end" label="Search Users">
        <Button variant={"ghost"}>
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
            <MenuItem>LogOut</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>
  );
};

export default SideDrawer;
