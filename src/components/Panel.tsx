import { Flex, Heading } from "@chakra-ui/react";

export type PanelProps = {
  children: React.ReactNode;
  title?: string;
};

function Panel({ children, title }: PanelProps) {
  return (
    <Flex direction="column" gap={3} p={2}>
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
