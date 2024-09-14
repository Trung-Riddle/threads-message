import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Actions from "./Actions";
import Typography from "./Typography";
const urlImg =
  "https://i.pinimg.com/736x/6a/78/e6/6a78e6a7ca7838feedebeedca98ba278.jpg";
const UserPost = () => {
  const bgColor = useColorModeValue("brand.dark", "brand.light");
  return (
    <Link to={"/username/post/id"}>
      <Flex gap={"3"} mb="4" py={5}>
        <Flex flexDirection={"column"} alignItems={"center"} gap={4}>
          <Avatar
            name="user"
            src="https://i.pinimg.com/564x/ec/fc/06/ecfc06f9a54940ea312f2c67cf1ed797.jpg"
          />
          <Box w={"0.5px"} h={"full"} bg={bgColor} />
          <AvatarGroup
            onClick={(e) => e.preventDefault()}
            w="full"
            size="xs"
            max={2}
          >
            <Avatar
              src={
                "https://i.pinimg.com/474x/9f/18/7f/9f187fb10fb792319751c8d6132eb792.jpg"
              }
              name="John doe"
            />
            <Avatar src={urlImg} name="John 2" />
            <Avatar
              src={
                "https://i.pinimg.com/474x/26/fb/eb/26fbebaa662005708902ecf90a4104d7.jpg"
              }
              name="John 2"
            />
            <Avatar
              src={
                "https://i.pinimg.com/474x/26/fb/eb/26fbebaa662005708902ecf90a4104d7.jpg"
              }
              name="John 2"
            />
            <Avatar
              src={
                "https://i.pinimg.com/474x/26/fb/eb/26fbebaa662005708902ecf90a4104d7.jpg"
              }
              name="John 2"
            />
            <Avatar
              src={
                "https://i.pinimg.com/474x/26/fb/eb/26fbebaa662005708902ecf90a4104d7.jpg"
              }
              name="John 2"
            />
          </AvatarGroup>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize="lg" fontWeight={"bold"}>
                Trung dep trai
              </Text>
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"sm"} color={"brand.light"}>
                1d
              </Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          <Typography fontSize={"md"}>This is title post 1</Typography>
          <Box borderRadius={6} overflow={"hidden"} border={"1px solid gray"}>
            <Image
              w={"full"}
              h={"full"}
              src="https://i.pinimg.com/474x/a9/cb/cf/a9cbcf5eb8f1779451feab39aab4b94a.jpg"
            />
          </Box>
          <Flex gap={3} my={1}>
            <Actions />
          </Flex>
          <Flex gap={2} alignItems={"center"}>
            <Typography fontSize="sm">12 replies</Typography>
            <Box w={0.5} h={0.5} borderRadius={"full"} bg={bgColor}></Box>
            <Typography fontSize="sm">123 likes</Typography>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default UserPost;
