import {
  Box,
  Button,
  Flex,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { SiThreads } from "react-icons/si";
import ToggleTheme from "./ToggleTheme";
import { Link } from "react-router-dom";
import MenuHeader from "./MenuHeader";
import { FaUserLarge } from "react-icons/fa6";
import { CiDark, CiLight } from "react-icons/ci";
import { MdOutlineCreate } from "react-icons/md";
import { LuUserCheck2 } from "react-icons/lu";
import { AiOutlineMessage } from "react-icons/ai";
import LogoutBtn from "./LogoutBtn";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import useMyModal from "../hooks/useMyModal";

const Header = () => {
  const { colorMode } = useColorMode();
  const { openModal } = useMyModal();
  const switchBg = useColorModeValue("gray.300", "gray.600");
  const user = useRecoilValue(userAtom);
  return (
    <Flex
      alignItems={"center"}
      justifyContent="center"
      mt={"6"}
      mb={{
        base: "8",
        md: "12",
      }}
      borderWidth={0.5}
      borderRadius={10}
      py={4}
    >
      <Flex w={"50%"} justifyContent={"center"} alignItems={"center"}>
        <Link to="">
          <Flex borderWidth={0.5} px={4} py={2} rounded={'lg'} alignItems={'center'} gap={2} textColor={colorMode != "dark" ? "black" : "white"}>
            <SiThreads />
            <Text>Thread Chat</Text>
          </Flex>
        </Link>
      </Flex>
      <Flex justifyContent={"end"} gap={3} w={"50%"} px={5}>
        {user && (
          <Button onClick={() => openModal("createPost")}>
            <MdOutlineCreate />
          </Button>
        )}
        {user && (
          <Link to={"/chat"}>
            <Button>
              <AiOutlineMessage />
            </Button>
          </Link>
        )}

        <Box>
          <MenuHeader>
            {user && (
              <Link to={`/profile/${user?.username}`}>
                <Flex
                  _hover={{ bg: switchBg, transition: "0.5s linear" }}
                  gap={3}
                  borderRadius={6}
                  alignItems={"center"}
                  p={2}
                >
                  <Text w={"10%"}>
                    <FaUserLarge />
                  </Text>
                  <Text>My profile</Text>
                </Flex>
              </Link>
            )}
            {!user && (
              <Link to={"/auth"}>
                <Flex
                  _hover={{ bg: switchBg, transition: "0.5s linear" }}
                  gap={3}
                  borderRadius={6}
                  alignItems={"center"}
                  p={2}
                >
                  <Text w={"10%"}>
                    <LuUserCheck2 size={22} />
                  </Text>
                  <Text>Login user</Text>
                </Flex>
              </Link>
            )}
            <Flex
              _hover={{ bg: switchBg, transition: "0.5s linear" }}
              gap={3}
              borderRadius={6}
              alignItems={"center"}
              p={2}
              cursor={"pointer"}
            >
              <Text w={"10%"}>
                {colorMode === "dark" ? (
                  <CiDark size={22} />
                ) : (
                  <CiLight size={22} />
                )}
              </Text>
              <Text>Change theme</Text>
              <ToggleTheme />
            </Flex>
            {user && <LogoutBtn />}
          </MenuHeader>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Header;
