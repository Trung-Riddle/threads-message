import {
  Box,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { TbPhoto } from "react-icons/tb";
import { IoMicCircleOutline, IoSendSharp } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import useShowToast from "../hooks/useShowToast";
import { sendMessageRequest } from "../api/message";
import usePreviewImage from "../hooks/usePreviewImage";
import AudioRecorder from "./AudioRecorder";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messageAtom";

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { setImgUrl, imgUrl, handleImageChange } = usePreviewImage();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const [openAudio, setOpenAudio] = useState(null);
  const [audio, setAudio] = useState(null);
  const [openMedia, setOpenMedia] = useState("");
  const showToast = useShowToast();
  const [isFocused, setIsFocused] = useState(false);
  const imgRef = useRef();

  const handleImgChange = () => {
    setOpenMedia("img");
    setOpenAudio("disabled");
    imgRef.current.click();
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
  const handleAudioRecorded = (base64Audio) => {
    if (base64Audio) {
      setAudio(base64Audio);
    } else {
      setAudio(null);
    }
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !audio && !imgUrl) return;
    if (isSending) return;
    const data = { recipientId: selectedConversation.userId };
    if (messageText) data.message = messageText;
    if (imgUrl) data.img = imgUrl;
    if (audio) data.audio = audio;
    setIsSending(true);
    try {
      const response = await sendMessageRequest(data);
      console.log(response);

      setMessages((messages) => [...messages, response]);
      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                message: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
      setAudio(null);
      setMessageText("");
      setImgUrl(null);
      setOpenAudio("disabled");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsSending(false);
    }
  };
  return (
    <Box my={2} w={"full"}>
      <form style={{ width: "100%" }} onSubmit={handleSendMessage}>
        <Flex
          borderWidth="1px"
          rounded={"full"}
          alignItems={"center"}
          borderColor={isFocused ? "#3182ce" : "gray.500"}
          transition="all 0.2s"
          boxShadow={isFocused ? "0 0 2px 1px #3182ce" : "none"}
          overflow={"hidden"}
        >
          <Box ml={1} color={"gray.300"} cursor={"pointer"} px={2}>
            <TbPhoto
              onClick={handleImgChange}
              color={
                openAudio === "enabled" ? "" : openMedia != "img" ? "" : "teal"
              }
              size={24}
            />
            <Input
              ref={imgRef}
              hidden
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Box>
          <Box color={"gray.300"} cursor={"pointer"}>
            <IoMicCircleOutline
              color={
                openAudio != "enabled"
                  ? ""
                  : openMedia === "audio"
                  ? "teal"
                  : ""
              }
              onClick={handleOpenAudio}
              size={25}
            />
          </Box>
          <Flex flex={1} p={1} flexDir={"column"} gap={2}>
            {imgUrl && (
              <Box position={"relative"} w={"60px"}>
                <Box
                  cursor={"pointer"}
                  onClick={() => {
                    setImgUrl(null);
                    setOpenMedia("");
                  }}
                  position={"absolute"}
                  right={"-30px"}
                  top={0}
                >
                  <MdOutlineCancel size={20} />
                </Box>
                <Image
                  w={"60px"}
                  ml={"16px"}
                  my={4}
                  rounded={"lg"}
                  boxShadow={"lg"}
                  objectFit={"contain"}
                  outline={"1px dotted gray"}
                  outlineOffset={12}
                  border={"1px solid gray"}
                  src={imgUrl}
                  name="image cmt"
                />
              </Box>
            )}
            <AudioRecorder
              onAudioRecorded={handleAudioRecorded}
              openAudio={openAudio}
            />
            <Input
              border="none"
              flex="1"
              py={2}
              h={"20px"}
              placeholder="Write your message..."
              onChange={(e) => setMessageText(e.target.value)}
              value={messageText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              _focus={{
                boxShadow: "none",
              }}
            />
          </Flex>
          {!isSending && (
            <Box onClick={handleSendMessage} px={2} mx={1} cursor={"pointer"}>
              <IoSendSharp size={20} />
            </Box>
          )}
          {isSending && (
            <Box px={2} mx={1} cursor={"pointer"}>
              <Spinner size={20} />
            </Box>
          )}
        </Flex>
      </form>
    </Box>
  );
};

export default MessageInput;
