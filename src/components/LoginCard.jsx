import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { loginRequest } from "../api/auth";
import { useForm } from "react-hook-form";
import InputPassword from "./InputPassword";

export default function LoginCard() {
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const handleRequest = async (data) => {
    const response = await loginRequest(data);
    if (response.success) {
      showToast("Success", response?.message, "success");
    } else {
      showToast("Error", response?.error, "error");
      return;
    }
    localStorage.setItem("user-threads", JSON.stringify(response?.user));
    setUser(response?.user);
  };
  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={6} mx={"auto"} w={"lg"} py={2} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Login
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "box.dark")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email" isInvalid={errors.email}>
              <FormLabel>Email address</FormLabel>
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email",
                  },
                })}
                type="email"
              />
              <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
            </FormControl>
            <InputPassword
              id={"password"}
              label={"Password"}
              register={register}
              validationSchema={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              errors={errors}
            />
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                onClick={handleSubmit(handleRequest)}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Don't have an account?{" "}
                <Link
                  onClick={() => setAuthScreen("signup")}
                  color={"blue.400"}
                >
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
