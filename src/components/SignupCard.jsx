import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { signupRequest } from "../api/auth";
import { useForm } from "react-hook-form";
import InputPassword from "./InputPassword";

export default function SignupCard() {
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const handleRequest = async (data) => {
    try {
      const response = await signupRequest(data);
    if (response.error) {
      showToast("Error", response?.error, "error");
      return
    }
    showToast("Success", response?.message, "success");
    localStorage.setItem("user-threads", JSON.stringify(response?.user));
    setUser(response?.user);
    } catch (error) {
      showToast("Error", error, "error");
    }
  };
  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={6} mx={"auto"} maxW={"lg"} py={2} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "box.dark")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isInvalid={errors.name}>
                  <FormLabel>Your Name</FormLabel>
                  <Input
                    {...register("name", {
                      required: "name is required",
                      minLength: {
                        value: 6,
                        message: "name must be at least 6 characters",
                      },
                    })}
                    type="text"
                  />
                  <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName" isInvalid={errors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...register("username", {
                      required: "username is required",
                      minLength: {
                        value: 6,
                        message: "usernames must be at least 6 characters",
                      },
                    })}
                    type="text"
                  />
                  <FormErrorMessage>{errors?.username?.message}</FormErrorMessage>
                </FormControl>
              </Box>
            </HStack>
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
            <InputPassword
              id={"confirmPassword"}
              label={"Confirm Password"}
              register={register}
              validationSchema={{
                required: "Confirm password is required",
                validate: (value) => 
                  value === watch("password") || 'Confirm Password not matches',
              }}
              errors={errors}
            />
            
            <Stack spacing={10} pt={2}>
              <Button
                onClick={handleSubmit(handleRequest)}
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link onClick={() => setAuthScreen("login")} color={"blue.400"}>
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
