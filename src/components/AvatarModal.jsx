import React from 'react';
import {
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Image,
} from '@chakra-ui/react';

const AvatarModal = ({avatarUrl = '/image.png', children, size, name, className}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Avatar
                src={avatarUrl}
                name={name}
                className={className}
                size={size}
                cursor="pointer"
                onClick={onOpen}>{children}</Avatar>
            <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Image Preview</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Image src={avatarUrl} alt="Full Image" />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
export default AvatarModal
