import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  selectedConversationAtom,
  conversationsAtom,
} from "../atoms/messageAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import MessageContainer from "../components/MessageContainer";
import { MdOutlineSearch } from "react-icons/md";
import { GiConversation } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";
import { useForm } from "react-hook-form";
import Conversation from "../components/Conversation";
import { getConversationsRequest } from "../api/message";
import useDebounce from "../hooks/useDebounce";
import { searchUsersRequest } from "../api/user";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
  const { register, watch, reset } = useForm();
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [searchResults, setSearchResults] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const searchTerm = watch("search");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { socket, onlineUsers } = useSocket();
  const bg = useColorModeValue("brand.light", "gray.800");
  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedSearchTerm) {
        try {
          const results = await searchUsersRequest(debouncedSearchTerm);
          setSearchResults(results);
        } catch (error) {
          console.error("Lỗi khi tìm kiếm:", error);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchUsers();
  }, [debouncedSearchTerm]);

  useEffect(() => {
		socket?.on("messagesSeen", ({ conversationId }) => {
			setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === conversationId) {
						return {
							...conversation,
							lastMessage: {
								...conversation.lastMessage,
								seen: true,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
		});
	}, [socket, setConversations]);


  const handleSelectConversationSearch = (userSer) => {
    const conversationAlreadyExists = conversations.find(
      (conversation) => conversation.participants[0]._id === userSer._id
    );
    if (conversationAlreadyExists) {
      setSelectedConversation({
        _id: conversationAlreadyExists._id,
        userId: userSer._id,
        username: userSer.username,
        userProfileImg: userSer.userProfileImg,
      });
      return;
    }
    const mockConversation = {
      mock: true,
      lastMessage: {
        message: "",
        sender: "",
      },
      _id: Date.now(),
      participants: [
        {
          _id: userSer._id,
          username: userSer.username,
          userProfileImg: userSer.userProfileImg,
        },
      ],
    };
    setConversations((prevConvs) => [...prevConvs, mockConversation]);
  };
  useEffect(() => {
    const getConversations = async () => {
      try {
        const data = await getConversationsRequest();
        if (data.error) {
          showToast("Error", "Error get conversation", "error");
          return;
        }
        // console.log(data);
        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingConversations(false);
      }
    };
    getConversations();
  }, [showToast, setConversations]);
  return (
    <Box
      position={"relative"}
      left={"50%"}
      w={"100%"}
      transform={"translateX(-50%)"}
    >
      <Flex gap={4} justifyContent={"flex-start"}>
        <Flex maxH={"500px"} direction={"column"} w={"30%"}>
          <form>
            <Flex gap={1} alignItems={"center"} position={"relative"}>
              <InputGroup>
                <Input {...register("search")} placeholder="Search find user" />
                <InputRightElement>
                  {searchTerm ? (
                    <MdOutlineCancel onClick={() => reset({ search: "" })} />
                  ) : (
                    <MdOutlineSearch />
                  )}
                </InputRightElement>
              </InputGroup>
              {debouncedSearchTerm && (
                <Flex
                  w={"full"}
                  zIndex={88}
                  bg={bg}
                  boxShadow={"lg"}
                  border={".5px solid gray"}
                  position={"absolute"}
                  gap={2}
                  p={2}
                  rounded={"md"}
                  top={"calc(100% + 4px)"}
                  flexDir={"column"}
                >
                  {searchResults.length > 0 &&
                    searchResults?.map((userSer) => (
                      <Flex
                        onClick={() => handleSelectConversationSearch(userSer)}
                        _hover={{ backgroundColor: "teal", color: "white" }}
                        p={2}
                        cursor={"pointer"}
                        rounded={"lg"}
                        alignItems={"center"}
                        gap={2}
                        key={userSer._id}
                      >
                        <Avatar src={userSer.userProfileImg || "/image.png"} />
                        <Text>{userSer.username}</Text>
                      </Flex>
                    ))}
                  {searchResults.length === 0 && (
                    <Text textAlign={"center"} py={5}>
                      No user found
                    </Text>
                  )}
                </Flex>
              )}
            </Flex>
          </form>
          <Flex
            flexDir={"column"}
            maxH={"500px"}
            overflowY={"scroll"}
            className="chat-conversation"
            py={2}
          >
            {loadingConversations &&
              [1, 2, 3, 4, 5].map((_, index) => (
                <Flex
                  key={index}
                  alignItems={"center"}
                  p={1}
                  gap={2}
                  my={2}
                  rounded={"md"}
                >
                  <Box>
                    <SkeletonCircle size={10} />
                  </Box>
                  <Flex w={"full"} flexDirection={"column"} gap={3}>
                    <Skeleton h={"10px"} w={"80px"} />
                    <Skeleton h={"10px"} w={"90%"} />
                  </Flex>
                </Flex>
              ))}
            {!loadingConversations &&
              conversations.map((conversation) => (
                <Conversation
                  key={conversation._id}
                  isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                  conversation={conversation}
                />
              ))}
          </Flex>
        </Flex>
        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a conversation to start messaging</Text>
          </Flex>
        )}
        {selectedConversation._id && (
          <Flex
            px={1}
            flex={70}
            flexDirection={"column"}
            maxH={"500px"}
            overflow={"hidden"}
          >
            <MessageContainer />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default ChatPage;
