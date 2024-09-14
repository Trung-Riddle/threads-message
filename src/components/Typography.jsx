import { Text, useColorModeValue } from "@chakra-ui/react";

const Typography = ({ children, fontSize, hover, fontWeight, cursor }) => {
  const colorSet = useColorModeValue("brand.dark", "brand.light");
  return (
    <Text
      fontSize={fontSize}
      cursor={cursor}
      _hover={hover}
      color={colorSet}
      fontWeight={fontWeight}
    >
      {children}
    </Text>
  );
};

export default Typography
