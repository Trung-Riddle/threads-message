import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { selectedConversationAtom } from "../atoms/messageAtom";
import {
  Avatar,
  Box,
  Flex,
  Image,
  Skeleton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsCheck2All } from "react-icons/bs";
import AudioPlay from "./AudioPlay";

const Message = ({ message, ownMessage }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);
  const messageBgLeft = useColorModeValue("#e4e6eb", "#efeee5");
  const messageColorLeft = useColorModeValue("#4c4c4c", "#4c4c4c");
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"} my={2}>
          {message.message && (
            <Flex direction="column" maxW={"320px"}>
              <Box bg={"teal.600"} px={3} py={2} borderRadius={"lg"}>
                <Text
                  color={"white"}
                  wordBreak="break-word"
                  whiteSpace="pre-wrap"
                  textAlign="left"
                >
                  {message.message}
                </Text>
                <Flex
                  color={message.seen ? "teal.300" : "gray.200"}
                  fontWeight={"bold"}
                  justifyContent={"flex-end"}
                >
                  <BsCheck2All size={16} />
                </Flex>
              </Box>
            </Flex>
          )}
          {message.img && !imgLoaded && (
            <Flex w={"220px"}>
              <Image
                src={message.img}
                hidden
                onLoad={() => setImgLoaded(true)}
                alt="Message image"
                borderRadius={4}
              />
              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}

          {message.img && imgLoaded && (
            <Flex w={"220px"}>
              <Image src={message.img} alt="Message image" borderRadius={4} />
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={"teal"}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}

          {message.audio && (
            <Flex w={"220px"}>
                <AudioPlay audio={message.audio} />
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={"teal"}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}

          <Avatar src={user.userProfileImg || "/image.png"} w="7" h={7} />
        </Flex>
      ) : (
        <Flex gap={2} my={2}>
          <Avatar
            src={selectedConversation.userProfileImg || "/image.png"}
            w="7"
            h={7}
          />
          {message.message && (
            <Flex direction="column" maxW={"320px"}>
              <Box bg={messageBgLeft} px={3} py={2} borderRadius={"lg"}>
                <Text
                  color={messageColorLeft}
                  wordBreak="break-word"
                  whiteSpace="pre-wrap"
                  textAlign="left"
                >
                  {message.message}
                </Text>
                <Flex
                  color={message.seen ? "teal.300" : "gray.200"}
                  fontWeight={"bold"}
                  w={"full"}
                  justifyContent={"flex-end"}
                >
                  <BsCheck2All size={16} />
                </Flex>
              </Box>
            </Flex>
          )}
          {message.img && !imgLoaded && (
            <Flex w={"220px"}>
              <Image
                src={message.img}
                hidden
                onLoad={() => setImgLoaded(true)}
                alt="Message image"
                borderRadius={4}
              />
              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}

          {message.img && imgLoaded && (
            <Flex w={"220px"}>
              <Image src={message.img} alt="Message image" borderRadius={4} />
            </Flex>
          )}
          {message.audio && (
            <Flex w={"220px"}>
                <AudioPlay audio={message.audio} />
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
};

export default Message;
