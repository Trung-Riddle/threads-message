import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react";
import { useState } from "react";
import { PiEyeBold, PiEyeClosed } from "react-icons/pi";

function InputPassword({ id, label, register, errors, validationSchema }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl isInvalid={errors[id]}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <InputGroup>
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          {...register(id, validationSchema)}
        />
        <InputRightElement h={"full"}>
          <Button
            variant={"ghost"}
            size={"xl"}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <PiEyeBold /> : <PiEyeClosed />}
          </Button>
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{errors[id]?.message}</FormErrorMessage>
    </FormControl>
  );
}

export default InputPassword;
