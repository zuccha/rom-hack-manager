import { Flex, FlexProps } from "@chakra-ui/react";

export type ContainerProps = FlexProps;

function Container({ children, ...props }: ContainerProps) {
  return (
    <Flex bg="gray.50" direction="column" gap={3} minH="100vh" p={4} {...props}>
      {children}
    </Flex>
  );
}

export default Container;
