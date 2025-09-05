import { Center, Flex } from "@chakra-ui/react";
import { useMemo } from "react";

type Tab = {
  body: React.ReactNode;
  header: React.ReactNode;
};

const BORDER_COLOR_SELECTED = "border.emphasized";
const BORDER_COLOR_UNSELECTED = "border";

const hideScrollBarCss = {
  "&::-webkit-scrollbar": {
    display: "none",
  },
};

/** TabHeader */

type TabHeaderProps = {
  children: React.ReactNode;
  isBeforeSelected: boolean;
  isLast: boolean;
  isSelected: boolean;
  onClick: () => void;
};

function TabHeader({
  children,
  isBeforeSelected,
  isLast,
  isSelected,
  onClick,
}: TabHeaderProps) {
  return (
    <Center
      _hover={{ color: "fg" }}
      bgColor={isSelected ? "bg" : undefined}
      borderBottomColor={isSelected ? "transparent" : BORDER_COLOR_SELECTED}
      borderBottomWidth={1}
      borderRightColor={
        isBeforeSelected || isSelected
          ? BORDER_COLOR_SELECTED
          : BORDER_COLOR_UNSELECTED
      }
      borderRightWidth={isLast ? 0 : 1}
      color={isSelected ? "fg" : "fg.muted"}
      cursor="pointer"
      minH="42px"
      onClick={onClick}
      px={4}
      py={2}
    >
      {children}
    </Center>
  );
}

/** Tabs */

type TabsProps = {
  index: number;
  onChange: (index: number) => void;
  tabsLeft: Tab[];
  tabsRight: Tab[];
};

function Tabs({ index, onChange, tabsLeft, tabsRight }: TabsProps) {
  const tabs = useMemo(
    () => [...tabsLeft, ...tabsRight],
    [tabsLeft, tabsRight]
  );

  return (
    <Flex direction="column">
      <Flex bgColor="bg.muted" overflow="scroll" css={hideScrollBarCss}>
        {tabsLeft.map((tab, tabIndex) => (
          <TabHeader
            isLast={tabIndex === tabsLeft.length - 1 && tabsRight.length === 0}
            isBeforeSelected={
              tabIndex < tabsLeft.length - 1 && tabIndex === index - 1
            }
            isSelected={tabIndex === index}
            key={tabIndex}
            onClick={() => onChange(tabIndex)}
          >
            {tab.header}
          </TabHeader>
        ))}

        {tabsRight.length > 0 && (
          <Flex
            borderBottomColor={BORDER_COLOR_SELECTED}
            borderBottomWidth={1}
            borderRightColor={
              index === tabsLeft.length
                ? BORDER_COLOR_SELECTED
                : BORDER_COLOR_UNSELECTED
            }
            borderRightWidth={1}
            flex={1}
          />
        )}

        {tabsRight.map((tab, tabIndex) => (
          <TabHeader
            isLast={tabIndex === tabsRight.length - 1}
            isBeforeSelected={tabIndex + tabsLeft.length === index - 1}
            isSelected={tabIndex + tabsLeft.length === index}
            key={tabIndex + tabsLeft.length}
            onClick={() => onChange(tabIndex + tabsLeft.length)}
          >
            {tab.header}
          </TabHeader>
        ))}
      </Flex>

      <Flex>{tabs[index]?.body}</Flex>
    </Flex>
  );
}

export default Tabs;
