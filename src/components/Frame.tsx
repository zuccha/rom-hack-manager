import { Flex, SimpleGrid, SimpleGridProps } from "@chakra-ui/react";
import Placeholder from "./Placeholder";

type FrameProps = {
  children: React.ReactNode;
  minChildWidth?: SimpleGridProps["minChildWidth"];
  placeholder: string;
};

function Frame({ children, minChildWidth, placeholder }: FrameProps) {
  return (
    <Flex borderWidth={1} flex={1} p={2} position="relative">
      <Placeholder placeholder={placeholder} />

      <SimpleGrid columnGap={1} flex={1} minChildWidth={minChildWidth}>
        {children}
      </SimpleGrid>
    </Flex>
  );
}

export default Frame;
