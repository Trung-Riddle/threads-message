import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { CgMoreO } from "react-icons/cg";
import AvatarModal from "./AvatarModal";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useFollowUnFollow from "../hooks/useFollowUnFollow";

const UserHeader = ({ user }) => {
  const currentUser = useRecoilValue(userAtom)
  const { handleFollowUnfollow, following, updating } = useFollowUnFollow(user);
  const toast = useToast();
  const copyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        description: "Copied link to clipboard",
        position: "top",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    });
  };
  const hoverBgColor = useColorModeValue("brand.light", "brand.dark");
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justify={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"}>{user?.name}</Text>
          <Flex alignItems={"center"} gap={2}>
            <Text fontSize={"sm"}>ur:{user?.username}</Text>
            <Text
              borderRadius={"full"}
              px={1}
              bg={useColorModeValue("brand.light", "brand.dark")}
              fontSize={"xs"}
            >
              My Profile
            </Text>
          </Flex>
        </Box>
        <Box>
          <AvatarModal
            avatarUrl={user.userProfileImg || '/image.png'}
            name={"Asian Girl"}
            size={{
              base: 'lg',
              md: 'xl'
            }}
          >
            <AvatarBadge boxSize="1em" bg="green.500" />
          </AvatarModal>
        </Box>
      </Flex>
      <Text>
        {user.bio || 'No bio link yet'}
      </Text>
      {currentUser?._id !== user._id && (
				<Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
					{following ? "Unfollow" : "Follow"}
				</Button>
			)}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text>{user.followers.length} followers</Text>
          <Box w={1} h={1} bg={"brand.dark"} borderRadius={"full"}></Box>
          <Text>Instagram</Text>
        </Flex>
        <Flex>
          <Box
            _hover={{ backgroundColor: hoverBgColor }}
            className="icon-container"
          >
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box
            _hover={{ backgroundColor: hoverBgColor }}
            className="icon-container"
          >
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList>
                  <MenuItem as={Link} to={'/update'} icon={<FiEdit3 />}>Update profile</MenuItem>
                  <MenuItem icon={<MdContentCopy />} onClick={copyUrl}>Copy Url</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w="full">
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
