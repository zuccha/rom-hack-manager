import { Flex, Heading } from "@chakra-ui/react";

export type PanelProps = {
  children: React.ReactNode;
  title?: string;
};

function Panel({ children, title }: PanelProps) {
  return (
    <Flex direction="column" flex={1} gap={3} p={3}>
      {title && (
        <Flex justifyContent="space-between">
          <Heading size="md">{title}</Heading>
        </Flex>
      )}

      {children}
    </Flex>
  );
}

export default Panel;
