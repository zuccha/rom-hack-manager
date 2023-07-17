import { Flex } from "@chakra-ui/react";
import Placeholder from "./Placeholder";

type FrameProps = {
  children: React.ReactNode;
  placeholder: string;
};

function Frame({ children, placeholder }: FrameProps) {
  return (
    <Flex
      bgColor="white"
      borderColor="gray.500"
      borderWidth={1}
      p={2}
      position="relative"
    >
      <Placeholder placeholder={placeholder} />
      {children}
    </Flex>
  );
}

export default Frame;
