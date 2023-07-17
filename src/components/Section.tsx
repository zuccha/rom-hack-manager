import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  Link,
  Text,
} from "@chakra-ui/react";

export type SectionProps = {
  children: React.ReactNode;
  isDefaultExpanded?: boolean;
  title: string;
};

function Section({ children, isDefaultExpanded, title }: SectionProps) {
  return (
    <Accordion
      allowMultiple
      borderWidth={0}
      defaultIndex={isDefaultExpanded ? [0] : []}
    >
      <AccordionItem border="none">
        <AccordionButton borderWidth={0} px={0}>
          <Text color="gray.700" fontSize="sm" whiteSpace="nowrap">
            {title}
          </Text>
          <Divider mx="2" />
          <AccordionIcon color="gray.700" />
        </AccordionButton>
        <AccordionPanel borderWidth={0} p={0}>
          {children}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export default Section;
