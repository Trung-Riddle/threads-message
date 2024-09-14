import { Box, Button, Flex, useColorModeValue } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { MdMenu } from "react-icons/md";

const MotionBox = motion(Box);
const MenuHeader = ({ children }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const bg = useColorModeValue("box.light", "box.dark");
  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <Box position={"relative"} ref={menuRef}>
      <Button onClick={handleOpen}>
        <MdMenu />
      </Button>
      <AnimatePresence>
        {open && (
          <MotionBox
            right={"0%"}
            top={"calc(100% + 5px)"}
            position={"absolute"}
            zIndex={99}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            <Flex
                bg={bg}
                direction={'column'}
              w={"260px"}
              boxShadow={'lg'}
              borderRadius={8}
              p={2}
              onClick={handleOpen}
            >
              {children}
            </Flex>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default MenuHeader;
