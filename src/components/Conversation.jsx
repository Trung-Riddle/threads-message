import userAtom from "../atoms/userAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messageAtom";
import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  WrapItem,
} from "@chakra-ui/react";
import { BsCheck2All } from "react-icons/bs";
import { SiMediafire } from "react-icons/si";

const Conversation = ({ conversation, isOnline }) => {
  const user = conversation.participants[0];
  const currentUser = useRecoilValue(userAtom);
  const lastMessage = conversation.lastMessage;
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const colorMode = useColorMode();
  const shadowBox = useColorModeValue(
    "1px 1px 4px 1px #eeeeef",
    "1px 1px 4px 1px #333"
  );
  const borderBox = useColorModeValue(".5px solid #dbe4e0", "0.5px solid #333");

  return (
    <Flex
      alignItems={"center"}
      gap={2}
      m={1}
      boxShadow={shadowBox}
      border={borderBox}
      p={1}
      _hover={{
        cursor: "pointer",
        bg: "teal",
        color: "white",
        transition: "background-color .3s linear",
      }}
      onClick={() =>
        setSelectedConversation({
          _id: conversation?._id,
          userId: user?._id,
          userProfileImg: user?.userProfileImg,
          username: user?.username,
          mock: user.mock,
        })
      }
      borderRadius={"md"}
      bg={
        selectedConversation?._id === conversation._id
          ? colorMode === "light"
            ? ""
            : "teal"
          : ""
      }
    >
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src={user?.userProfileImg || '/image.png'}
        >
          {isOnline ? <AvatarBadge boxSize="1em" bg="green.500" /> : ""}
        </Avatar>
      </WrapItem>
      <Stack
        direction={"column"}
        fontSize={"sm"}
        color={
          selectedConversation?._id === conversation._id
            ? colorMode === "light"
              ? "white"
              : "white"
            : ""
        }
      >
        <Text fontWeight={"700"}>{user?.username}</Text>
        <Flex fontSize={"xs"} alignItems={"center"} gap={1}>
          {currentUser._id === lastMessage.sender ? (
            <Box color={lastMessage.seen ? "blue.400" : ""}>
              <BsCheck2All size={16} />
            </Box>
          ) : (
            ""
          )}
          {lastMessage?.sender
            ? Array.from(lastMessage.message || "").length > 18
              ? lastMessage.message.substring(0, 18) + "..."
              : lastMessage.message || <SiMediafire size={16} />
            : <Text>Chưa có tin nhắn nào</Text>}
        </Flex>
      </Stack>
    </Flex>
  );
};

export default Conversation;
