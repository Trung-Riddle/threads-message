import React from "react";
import { useRecoilState } from "recoil";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import CreatePost from "./CreatePost";
import modalAtom from "../atoms/modalAtom";
import useMyModal from "../hooks/useMyModal";

const modalComponents = {
  createPost: CreatePost,
  //
};
const Modal = () => {
  const { modal, closeModal, updateModalData, submitEd } = useMyModal();
  const { isOpen, type, data } = modal;
  const bg = useColorModeValue('box.light', 'box.dark')
  if (!isOpen) return null;
  const ModalComponent = modalComponents[type];
  return (
    <Flex
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0, 0, 0, 0.7)"
      zIndex={999}
      alignItems="center"
      justifyContent="center"
      onClick={closeModal}
    >
      <Flex
        bg={bg}
        onClick={(e) => e.stopPropagation()}
        rounded={'md'}
        justifyContent={'center'}
        w={{
          base: '95%',
          md: 'auto'
        }}
        p={2}
        overflow={'hidden'}
      >
        { ModalComponent && <ModalComponent data={data} submitEd={submitEd} updateData={updateModalData} />}
      </Flex>
    </Flex>
  );
};

export default Modal;
