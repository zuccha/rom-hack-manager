import {
  Alert as ChakraAlert,
  type AlertRootProps as ChakraAlertRootProps,
  Flex,
} from "@chakra-ui/react";

export type AlertProps = {
  description?: string;
  status: ChakraAlertRootProps["status"];
  title?: string;
};

function Alert({ description, status, title }: AlertProps) {
  return (
    <ChakraAlert.Root
      status={status}
      alignItems="flex-start"
      fontSize="sm"
      p={2}
    >
      <ChakraAlert.Indicator />
      <Flex direction="column">
        {title && <ChakraAlert.Title>{title}</ChakraAlert.Title>}
        {description && (
          <ChakraAlert.Description>{description}</ChakraAlert.Description>
        )}
      </Flex>
    </ChakraAlert.Root>
  );
}

export default Alert;
