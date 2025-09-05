import { Flex, Text } from "@chakra-ui/react";

type PlaceholderProps = {
  isError?: boolean;
  placeholder: string;
};

function Placeholder({ isError, placeholder }: PlaceholderProps) {
  return (
    <Flex
      color={isError ? "fg.error" : "fg.muted"}
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
        borderColor="bg"
        h="50%"
        pos="absolute"
        w="100%"
      />
    </Flex>
  );
}

export default Placeholder;
