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
import axios from "axios";

import React, { useState } from "react";
import { server } from "../../App";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const ShowPasswordClick = () => setShow(!show);

  const toast = useToast();
  const navigate = useNavigate();

  const submitHandler = async () => {
    try {
      setLoading(true);
      if (!email || !password) {
        toast({
          title: "Please Fill all the Fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${server}/users/login`,
        {
          email,
          password,
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
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      console.log(error);
    }
  };

  const fillGuest = () => {
    console.log("Workin");
    setEmail("guest@example.com");
    setPassword("123456");
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl id="login-email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          defaultValue={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}></Input>
      </FormControl>
      <FormControl id="login-password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            defaultValue={password}
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

      <Button
        colorScheme="purple"
        width={"100%"}
        style={{ marginTop: 15 }}
        isLoading={loading}
        onClick={submitHandler}>
        Log In
      </Button>
      <Button
        variant={"solid"}
        colorScheme="red"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={fillGuest}>
        Get in as a Guest
      </Button>
    </VStack>
  );
};

export default Login;
