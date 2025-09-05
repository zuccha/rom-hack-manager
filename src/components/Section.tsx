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
    >
      <Accordion.Item border="none" value="item">
        <Accordion.ItemTrigger borderWidth={0} px={0}>
          <Heading
            color="gray.700"
            flex={1}
            fontSize="sm"
            size="xs"
            textTransform="uppercase"
            whiteSpace="nowrap"
          >
            {title}
          </Heading>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody borderWidth={0} p={0} pt={2}>
            {children}
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}

export default Section;
