import {
  Avatar,
  Box,
  Divider,
  Flex,
  Text,
  textDecoration,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Comment = ({ reply, user }) => {
  // Hàm thay đổi màu khi hover
  const handleMouseEnter = (e) => {
    e.target.style.color = "teal";
  };

  // Hàm thay đổi màu khi rời khỏi hover
  const handleMouseLeave = (e) => {
    e.target.style.color = "inherit";
  };
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply?.userProfileImg || "/image.png"} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box fontSize="md" fontWeight="bold">
              <Link
                style={{ transition: "color .3s ease" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                to={`/profile/${reply?.username}`}
              >
                {reply?.username}
              </Link>{" "}
              {user?.username === reply?.username && (
                <Box
                  rounded={"lg"}
                  display={"inline-block"}
                  color={"gray.200"}
                  fontSize={"11px"}
                  m={1}
                  px={"6px"}
                  py={"2px"}
                  bg={"teal.800"}
                >
                  Author
                </Box>
              )}
            </Box>
          </Flex>
          <Text fontSize={"sm"}>{reply?.text}</Text>
        </Flex>
      </Flex>
      <Divider my={3} />
    </>
  );
};

export default Comment;
