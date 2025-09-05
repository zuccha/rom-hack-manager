import { Accordion, Heading } from "@chakra-ui/react";

export type SectionProps = {
  children: React.ReactNode;
  isDefaultExpanded?: boolean;
  title: string;
};

function Section({ children, isDefaultExpanded, title }: SectionProps) {
  return (
    <Accordion.Root
      borderWidth={0}
      defaultValue={isDefaultExpanded ? ["item"] : []}
      multiple
      outline="none"
    >
      <Accordion.Item border="none" value="item">
        <Accordion.ItemTrigger
          _hover={{ bgColor: "bg.muted" }}
          borderWidth={0}
          cursor="pointer"
          rounded={0}
          px={0}
          colorPalette="blue"
        >
          <Heading
            flex={1}
            fontSize="sm"
            size="xs"
            textTransform="uppercase"
            whiteSpace="nowrap"
          >
            {title}
          </Heading>
          <Accordion.ItemIndicator color="fg" />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent overflow="visible">
          <Accordion.ItemBody borderWidth={0} p={0} pt={2}>
            {children}
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}

export default Section;
