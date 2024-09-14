import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
} from "@chakra-ui/react";

function InputText({
  id,
  label,
  register,
  errors={},
  validationSchema={},
  type="text",
  placeholder="",
}) {
  return (
    <FormControl isInvalid={errors[id]}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <InputGroup>
        <Input
          placeholder={placeholder}
          _placeholder={{ color: "gray.500" }}
          id={id}
          type={type}
          {...register(id, validationSchema)}
        />
      </InputGroup>
      <FormErrorMessage>{errors[id]?.message}</FormErrorMessage>
    </FormControl>
  );
}

export default InputText;
