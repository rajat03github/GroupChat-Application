import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { server } from "../../App";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);

  const [show, setShow] = useState(false);
  const ShowPasswordClick = () => setShow(!show);

  const toast = useToast();
  const navigate = useNavigate();

  const postDetails = async (pics) => {
    try {
      setPicLoading(true);
      if (pics === undefined) {
        toast({
          title: "Please Select an Image",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }

      if (pics.type === "image/jpeg" || pics.type === "image/png") {
        //! this is from and for Cloudinary
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "groupchat");
        data.append("cloud_name", "rajatchat");

        const picData = await axios.post(
          "https://api.cloudinary.com/v1_1/rajatchat/image/upload",
          data
        );
        console.log("CLRS", picData);
        setPic(picData.data.url.toString());
        setPicLoading(false);
        toast({
          title: "Image uploaded successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
        return;
      }
    } catch (error) {
      console.log("CL ERROR", error);
      setPicLoading(false);
    }
  };
  const submitHandler = async () => {
    try {
      setPicLoading(true);
      if (!name || !email || !password || !confirmpassword) {
        toast({
          title: "Please Fill all the Fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
        return;
      }

      if (password !== confirmpassword) {
        toast({
          title: "Passwords Do Not Match !",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${server}/users/register`,
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      toast({
        title: "Welcome Aboard !",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      // ! Storing in Local Storage
      localStorage.setItem("token", JSON.stringify(data));
      setPicLoading(false);
      navigate("/chats");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Name Here!"
          onChange={(e) => setName(e.target.value)}></Input>
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}></Input>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Password !"
            onChange={(e) => setPassword(e.target.value)}></Input>
          <InputRightElement width={"4.5rem"}>
            <Button h={"1.75rem"} size={"sm"} onClick={ShowPasswordClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Password !"
            onChange={(e) => setConfirmpassword(e.target.value)}></Input>
          <InputRightElement width={"4.5rem"}>
            <Button h={"1.75rem"} size={"sm"} onClick={ShowPasswordClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}></Input>
      </FormControl>
      <Button
        colorScheme="purple"
        width={"100%"}
        style={{ marginTop: 15 }}
        isLoading={picLoading}
        onClick={submitHandler}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default Register;
