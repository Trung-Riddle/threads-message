import {
  Avatar,
  Box,
  Divider,
  Flex,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import Typography from "../components/Typography";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import { getPostRequest } from "../api/post";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { getTimeAgo } from "../components/Post";

const PostPage = () => {
  const bgColor = useColorModeValue("brand.dark", "brand.light");
  const { user } = useGetUserProfile();
  const { pid } = useParams();
  const [post, setPost] = useState([]);
  const [searchParams] = useSearchParams();
  const up = searchParams.get("up");
  const isUserPage = up === "true";
  const showToast = useShowToast();
  useEffect(() => {
    const getPostById = async () => {
      try {
        const response = await getPostRequest(pid);
        if (response.error) {
          showToast("error", response.error, "error");
          return;
        }

        setPost(response);
      } catch (error) {
        showToast("Error", error?.message, "error");
      }
    };
    getPostById();
  }, [pid, showToast, setPost]);
  return (
    <>
      <Flex my={2}>
        <Flex w="full" alignItems={"center"} gap={3}>
          <Avatar src={user?.userProfileImg} name={user?.username} />
          <Flex>
            <Text fontSize={18} fontWeight={"bold"}>
              {user?.username}
            </Text>
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            bg={"teal.900"}
            px={2}
            rounded={"lg"}
            fontSize={"sm"}
            whiteSpace={"nowrap"}
            color={"brand.light"}
          >
            {getTimeAgo(post?.createdAt)}
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>
      <Typography fontSize={"md"}>{post?.text || ""}</Typography>
      {post?.img && (
        <Box mt={2} borderRadius={6} overflow={"hidden"} border={"1px solid gray"}>
          <Image w={"full"} h={"full"} src={post?.img} />
        </Box>
      )}
      <Flex gap={3} my={1}>
        <Actions post={post} setPost={setPost} isUserPage={isUserPage} />
      </Flex>
      <Divider my={4} />

      {post?.replies?.map((reply, index) => (
        <Comment key={index} reply={reply} user={user} />
      ))}
    </>
  );
};

export default PostPage;
