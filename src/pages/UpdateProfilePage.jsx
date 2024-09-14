import { useRef } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useForm } from "react-hook-form";
import InputText from "../components/InputText";
import useShowToast from "../hooks/useShowToast";
import { updateProfileRequest } from "../api/user";
import usePreviewImage from "../hooks/usePreviewImage";

const UpdateProfilePage = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const ref = useRef();
  const toast = useShowToast();
  const { handleImageChange, imgUrl } = usePreviewImage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
    },
  });
  const onSubmit = async (data) => {
    const changedData = Object.keys(data).reduce((acc, key) => {
      if (data[key] !== user[key]) {
        acc[key] = data[key];
      }
      return acc;
    }, {});

    if (imgUrl && imgUrl !== user.userProfileImg) {
      changedData.userProfileImg = imgUrl;
    }
    // check if data edited
    if (
      Object.keys(changedData).length > 0 ||
      (imgUrl && imgUrl !== user.userProfileImg)
    ) {
      const id = user._id
      const response = await updateProfileRequest(changedData, id);
      if (response.success) {
        toast("Good", response?.user?.message, 'success');
        setUser(response.user);
        localStorage.setItem("user-threads", JSON.stringify(response?.user));
      } else {
        toast("Error", "An error occurred, please try again later", 'error');
      }
    } else {
      toast("No information has been entered yet", "");
    }
  };
  const navigate = useNavigate();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex
        // minH={"100vh"}
        align={"center"}
        justify={"center"}
        rounded={"xl"}
        my={6}
      >
        <Stack
          spacing={4}
          w={"full"}
          bg={useColorModeValue("white", "rgb(16, 16, 16)")}
          rounded={"xl"}
          boxShadow={"xs"}
          border={".5px solid rgba(243, 245, 247, 0.15)"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <FormLabel>Your Avatar</FormLabel>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  boxShadow={"2xl"}
                  size="xl"
                  src={imgUrl || user.userProfileImg}
                ></Avatar>
              </Center>
              <Center w="full">
                <Button
                  bg={useColorModeValue("rgb(16, 16, 16)", "white")}
                  color={useColorModeValue("#ffffff", "rgb(16, 16, 16)")}
                  _hover={{
                    bg: useColorModeValue("rgb(16, 17, 25)", "#f3f3f3"),
                  }}
                  w="full"
                  onClick={() => ref.current.click()}
                >
                  Change Avatar
                </Button>
                <Input
                  accept="image/*"
                  hidden
                  type="file"
                  ref={ref}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <InputText
            id="name"
            label="Your name"
            placeholder={"Enter your name"}
            register={register}
            errors={errors}
            validationSchema={{
              required: "Name is required",
            }}
          />
          <InputText
            id="username"
            label="username"
            placeholder={"Enter your username"}
            register={register}
            errors={errors}
            validationSchema={{
              required: "Username is required",
            }}
          />
          <InputText
            id="email"
            label="Email address"
            placeholder="your-email@example.com"
            register={register}
            type="email"
            errors={errors}
            validationSchema={{
              required: "Password is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Invalid email",
              },
            }}
          />
          <InputText
            id="bio"
            label="Bio link"
            placeholder="Enter your bio"
            register={register}
          />

          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              w="full"
              _hover={{
                borderColor: "gray.500",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              bg={useColorModeValue("rgb(16, 16, 16)", "white")}
              color={useColorModeValue("#ffffff", "rgb(16, 16, 16)")}
              _hover={{
                bg: useColorModeValue("rgb(16, 17, 25)", "#f3f3f3"),
              }}
              w="full"
            >
              Update
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
};

export default UpdateProfilePage;
