import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";

import React, { useState } from "react";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);
  const ShowPasswordClick = () => setShow(!show);

  const submitHandler = () => {};
  const fillGuest = () => {
    console.log("Workin");
    setEmail("guest@example.com");
    setPassword("123456");
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          defaultValue={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}></Input>
      </FormControl>
      <FormControl id="password" isRequired>
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
        onClick={submitHandler}>
        Sign Up
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
