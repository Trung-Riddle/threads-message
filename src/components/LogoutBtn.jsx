import React from "react";
import useShowToast from "../hooks/useShowToast";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { logoutRequest } from "../api/auth";
import { FiLogOut } from "react-icons/fi";
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";

const LogoutBtn = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const handleLogout = async () => {
    const response = await logoutRequest();
    if (response.success) {
      localStorage.removeItem("user-threads");
			setUser(null);
      showToast('', response?.message)
    } else {
      showToast('Error', response?.error, 'error')
      return
    }
  };
  return (
    <button onClick={handleLogout}>
      <Flex
        _hover={{
          bg: useColorModeValue("gray.300", "gray.600"),
          transition: "0.5s linear",
        }}
        gap={3}
        borderRadius={6}
        alignItems={"center"}
        p={2}
        cursor={"pointer"}
      >
        <Text w={"10%"}><FiLogOut size={20} /></Text>
        <Text>Logout</Text>
      </Flex>
    </button>
  );
};

export default LogoutBtn;
