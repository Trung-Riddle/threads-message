import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  Flex,
  Skeleton,
  SkeletonCircle,
  Text,
} from "@chakra-ui/react";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messageAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useShowToast from "../hooks/useShowToast";
import Message from "./Message";
import MessageInput from "./MessageInput";
import userAtom from "../atoms/userAtom";
import { getMessageRequest } from "../api/message";
import { useSocket } from "../context/SocketContext";
import messageSound from "../assets/sounds/message.mp3";

const MessageContainer = () => {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const { socket } = useSocket();
  const messageEndRef = useRef(null);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedConversation._id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }

      // make a sound if the window is not focused
      if (!document.hasFocus()) {
        const sound = new Audio(messageSound);
        sound.play();
      }
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                message: message.message,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
    return () => socket.off("newMessage");
  }, [socket, selectedConversation, setConversations]);
  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        if (selectedConversation.mock) return;
        const data = await getMessageRequest(selectedConversation.userId);
        if (data.error) {
          // showToast('New', 'New Conversation')
          return;
        }
        console.log(data);
        setMessages(data);
      } catch (error) {
        showToast("Error", "Error get messages", "error");
      } finally {
        setLoadingMessages(false);
      }
    };
    getMessages();
  }, [showToast, selectedConversation.userId, selectedConversation.mock]);

  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length &&
      messages[messages.length - 1].sender !== currentUser._id;
    if (lastMessageIsFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }

    socket.on("messagesSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [socket, currentUser._id, messages, selectedConversation]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <>
      <Flex w={"full"} alignItems={"center"} gap={2}>
        <Avatar
          src={selectedConversation.userProfileImg || "/image.png"}
          size={"sm"}
        />
        <Text>{selectedConversation.username}</Text>
      </Flex>
      <Divider />
      <Flex
        flexDir={"column"}
        gap={4}
        my={4}
        p={2}
        height={"400px"}
        scrollBehavior={"smooth"}
        overflowY={"auto"}
        className="chat-conversation"
      >
        {loadingMessages &&
          [...Array(12)].map((_, index) => (
            <Flex
              key={index}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={index % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {index % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
              </Flex>
              {index % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}
        {/* <Flex h={'full'} flexDir={"column"}> */}
        {!loadingMessages &&
          messages.map((message, index) => (
            <Flex
              direction={"column"}
              key={message._id}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              <Message
                message={message}
                ownMessage={currentUser._id === message.sender}
              />
            </Flex>
          ))}
        {/* </Flex> */}
      </Flex>
      <MessageInput setMessages={setMessages} />
    </>
  );
};

export default MessageContainer;
