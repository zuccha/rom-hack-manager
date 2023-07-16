import {
  AlertDescription,
  AlertIcon,
  AlertProps as CAlertProps,
  AlertTitle,
  Alert as CAlert,
  Flex,
} from "@chakra-ui/react";

export type AlertProps = {
  description?: string;
  status: CAlertProps["status"];
  title?: string;
};

function Alert({ description, status, title }: AlertProps) {
  return (
    <CAlert status={status} alignItems="flex-start" fontSize="sm" p={2}>
      <AlertIcon />
      <Flex direction="column">
        {title && <AlertTitle>{title}</AlertTitle>}
        {description && <AlertDescription>{description}</AlertDescription>}
      </Flex>
    </CAlert>
  );
}

export default Alert;
