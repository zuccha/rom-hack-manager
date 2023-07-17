import { Flex, Text } from "@chakra-ui/react";

type PlaceholderProps = {
  isError?: boolean;
  placeholder: string;
};

function Placeholder({ isError, placeholder }: PlaceholderProps) {
  return (
    <Flex
      color={isError ? "red.500" : "gray.500"}
      left={2}
      position="absolute"
      top={-2}
      zIndex={10}
    >
      <Text fontSize="xs" px={1} zIndex={1}>
        {placeholder}
      </Text>
      <Flex
        borderBottomWidth={2}
        borderColor="white"
        h="50%"
        pos="absolute"
        w="100%"
      />
    </Flex>
  );
}

export default Placeholder;
