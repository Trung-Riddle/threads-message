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
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import Typography from "./Typography";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { getUserRequest } from "../api/user";
import AudioPlay from "./AudioPlay";
import usePostActions from "../hooks/usePostActions";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

export function getTimeAgo(createdAt) {
  const seconds = Math.floor((new Date() - new Date(createdAt)) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  
  return Math.floor(seconds) + "s ago";
}

const Post = ({ post, postedBy, isUserPage }) => {
  const { handleLike, handleUnlike, handleReply } = usePostActions();
  const currentUser = useRecoilValue(userAtom);
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const currentLike = post.likes.includes(currentUser._id);
  const bgColor = useColorModeValue("brand.dark", "brand.light");

  // const onLikeClick = () => {
  //   if (isLiked) {
  //     handleUnlike(post._id, currentUser._id, isUserPage);
  //   } else {
  //     handleLike(post._id, currentUser._id, isUserPage);
  //   }
  // };
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await getUserRequest(postedBy);
        if (response?.error) {
          showToast("Error", response?.error, "error");
          return;
        }
        setUser(response.user);
      } catch (error) {
        showToast("Error", "Error user", "error");
      }
    };
    getUser();
  }, [postedBy, showToast]);

  if (!user) return null;
  return (
    <Flex gap={"3"} mb="4" py={5}>
      <Flex flexDirection={"column"} alignItems={"center"} gap={4}>
        <Avatar name={user?.name} src={user?.userProfileImg} />
        <Box w={"0.5px"} h={"full"} bg={bgColor} />
        <AvatarGroup
          onClick={(e) => e.preventDefault()}
          w="full"
          size="xs"
          max={2}
        >
          {post.replies.length > 0 ? (
            post.replies
              .slice(0, 3)
              .map((reply, index) => (
                <Avatar
                  key={index}
                  name={reply.username}
                  src={reply.userProfileImg}
                />
              ))
          ) : (
            <Avatar name="No Replies" src="" />
          )}
        </AvatarGroup>
      </Flex>
      <Flex flex={1} flexDirection={"column"} gap={2}>
        <Flex justifyContent={"space-between"} alignItems={'center'} w={"full"}>
          <Flex w={"full"} alignItems={"center"}>
            <Text
              fontSize="lg"
              fontWeight={"bold"}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/profile/${user.username}`);
              }}
            >
              {user?.username}
            </Text>
          </Flex>
          <Flex gap={4} alignItems={'center'}>
            <Text bg={'teal.900'} px={2} rounded={'lg'} fontSize={"sm"} whiteSpace={'nowrap'} color={"brand.light"}>
            {getTimeAgo(post?.createdAt)}
            </Text>
            <BsThreeDots />
          </Flex>
        </Flex>
        <Typography fontSize={"md"}>{post?.text}</Typography>
        {post?.img && (
          <Link to={`/${user.username}/post/${post._id}?up=${isUserPage.toString()}`}>
            <Box borderRadius={6} overflow={"hidden"} border={"1px solid gray"}>
              <Image w={"full"} h={"full"} src={post.img} />
            </Box>
          </Link>
        )}
        {post?.audio && <AudioPlay audio={post.audio} />}
        <Flex gap={3} my={1}>
          <Actions post={post} isUserPage={isUserPage} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Post;
