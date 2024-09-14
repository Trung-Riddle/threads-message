import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Heading,
  Textarea,
  Box,
  Flex,
  Text,
  Avatar,
  useColorModeValue,
  Divider,
  Input,
  Image,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { HiOutlinePhotograph } from "react-icons/hi";
import { IoMicCircleOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import AudioRecorder from "./AudioRecorder";
import usePreviewImage from "../hooks/usePreviewImage";
import { createPostRequest } from "../api/post";
import useShowToast from "../hooks/useShowToast";
import { useLoading } from "../hooks/useApp";
import useUserPosts from "../hooks/useUserPosts";

const CreatePost = ({ data, updateData, submitEd }) => {
  const currentUser = useRecoilValue(userAtom);
  const [content, setContent] = useState(data?.content || "");
  const [audio, setAudio] = useState(null);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImage();
  const [openAudio, setOpenAudio] = useState(null);
  const [openMedia, setOpenMedia] = useState("");
  const colorModeMedia = useColorModeValue("teal", "blue");
  const colorMode = useColorModeValue("box.dark", "box.light");
  const textareaRef = useRef(null);
  const imgRef = useRef();
  const { isLoading, hideLoading, showLoading } = useLoading();
  const toast = useShowToast();
  const { addNewPost } = useUserPosts(currentUser?.username);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [content]);
  const handleChange = (e) => {
    e.stopPropagation();
    const newContent = e.target.value;
    setContent(newContent);
    updateData({ text: newContent });
    // console.log(data.content)
  };
  const handleOpenAudio = () => {
    setOpenMedia("audio");
    setImgUrl(null);
    if (!openAudio || openAudio === "disabled") {
      setOpenAudio("enabled");
    } else {
      setOpenAudio("disabled");
    }
  };
  const handleImgChange = () => {
    setOpenMedia("img");
    setOpenAudio("disabled");
    imgRef.current.click();
  };
  const handleCancel = () => {
    setImgUrl(null);
    setOpenAudio("disabled");
    setOpenMedia("");
  };
  const handleAudioRecorded = (base64Audio) => {
    if (base64Audio) {
      setAudio(base64Audio);
      updateData({ audio: base64Audio });
    } else {
      setAudio(null);
      updateData({ audio: null });
    }
  };
  const handleCreatePost = async () => {
    let postData = {};

    const trimmedText = data.text;
    if (trimmedText !== "") {
      postData.text = data.text;
    }
    if (audio) {
      postData.audio = audio;
    }

    if (imgUrl) {
      postData.img = imgUrl;
    }

    if (trimmedText !== "" || audio || imgUrl) {
      showLoading()
      const response = await createPostRequest({
        ...postData,
        postedBy: currentUser._id,
      });
      if (response.error) {
        hideLoading()
        toast("Error", "Error , try again", "error");
        return;
      }
      hideLoading()
      addNewPost(response.newPost)
      toast("Posted", response?.message, "success");
      setContent("");
      setAudio(null);
      setImgUrl(null);
      setOpenAudio(null);
      setOpenMedia("");
      submitEd();
    }
  };
  return (
    <Flex
      w={{ base: "100%", md: "500px" }}
      flexDirection={"column"}
      m={2}
      gap={4}
    >
      <Heading size="md">New a thread...</Heading>
      <Divider />
      <Flex
        gap={2}
        scrollBehavior={"smooth"}
        flexDirection={"column"}
        overflowY={"scroll"}
        className="post-image"
        rounded={"lg"}
        maxH={"400px"}
      >
        <Flex gap={3}>
          <Avatar name="user" src={currentUser.userProfileImg} />
          <Flex flexDirection={"column"}>
            <Text fontWeight={"bold"} textTransform={"capitalize"}>
              {currentUser.name}
            </Text>
            <Text color={"gray.500"} fontSize={13}>
              {currentUser.username}
            </Text>
          </Flex>
        </Flex>
        <Textarea
          my={3}
          border="none"
          focusBorderColor="none"
          ref={textareaRef}
          _focus={{ boxShadow: "none" }}
          _hover={{ border: "none" }}
          resize="none"
          minH={"100px"}
          overflow="scroll"
          textAlign={"justify"}
          borderRadius={"12px"}
          spellCheck={false}
          _selection={{
            backgroundColor: "teal",
            color: "white",
          }}
          onChange={handleChange}
          value={content}
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          placeholder="Start a thread..."
        />
        <AudioRecorder
          openAudio={openAudio}
          onAudioRecorded={handleAudioRecorded}
        />
        {imgUrl && (
          <Image
            src={imgUrl}
            width={"100%"}
            height={"auto"}
            objectFit={"cover"}
            alt="post"
          />
        )}
      </Flex>
      <Box>
        <Flex gap={4} alignItems={"center"}>
          {!!openMedia && (
            <Text onClick={handleCancel} color={colorMode} cursor={"pointer"}>
              <MdOutlineCancel size={20} />
            </Text>
          )}

          <Text
            onClick={handleImgChange}
            color={openMedia === "img" ? colorModeMedia : colorMode}
            fontSize={"xl"}
            cursor={"pointer"}
          >
            <HiOutlinePhotograph size={20} />
          </Text>
          <Input
            accept="image/*"
            hidden
            type="file"
            ref={imgRef}
            onChange={handleImageChange}
          />
          <Text
            color={openMedia === "audio" ? colorModeMedia : colorMode}
            onClick={handleOpenAudio}
            fontSize={"xl"}
            cursor={"pointer"}
          >
            <IoMicCircleOutline size={20} />
          </Text>
        </Flex>
      </Box>
      <Divider />
      <Flex justifyContent="flex-end">
        <Button
          variant={"outline"}
          disabled={isLoading}
          onClick={handleCreatePost}
        >
          Đăng bài
        </Button>
      </Flex>
    </Flex>
  );
};

export default CreatePost;
