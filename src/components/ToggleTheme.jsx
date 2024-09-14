import React, { useEffect, useState } from "react";
import { Button, useColorMode, useColorModeValue, Box } from "@chakra-ui/react";

import { motion } from "framer-motion";

const MotionBox = motion(Box);
const ToggleTheme = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [initialX] = useState(colorMode === "light" ? "12px" : "-12px")
  const switchBg = useColorModeValue("gray.300", "gray.700");
  const switchColor = useColorModeValue("#333", "#f3f3f3");
  return (
    <Button
      onClick={toggleColorMode}
      bg={switchBg}
      color={switchColor}
      _hover={{ bg: switchBg }}
      _active={{ bg: switchBg }}
      p={1}
      borderRadius="full"
      position="relative"
      width="50px"
      height="24px"
    >
      <MotionBox
        bg={colorMode === "light" ? "white" : "gray.800"}
        borderRadius="full"
        width="20px"
        height="20px"
        position="absolute"
        top="2px"
        initial={{x: initialX}}
        animate={{ x: colorMode === "light" ? "12px" : "-12px" }}
        transition={{ type: "spring", stiffness: 300, damping: 40 }}
      />
    </Button>
  );
};
export default ToggleTheme;
