import { Tooltip as ChakraTooltip, Portal } from "@chakra-ui/react";
import * as React from "react";

export type TooltipProps = {
  showArrow?: boolean;
  portalled?: boolean;
  children: React.ReactNode;
  content: React.ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  disabled?: boolean;
  openDelay?: number;
};

export default function Tooltip({
  showArrow,
  children,
  disabled,
  portalled = true,
  content,
  contentProps,
  ...rest
}: TooltipProps) {
  if (disabled) return <>{children}</>;

  return (
    <ChakraTooltip.Root {...rest}>
      <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
      <Portal disabled={!portalled}>
        <ChakraTooltip.Positioner>
          <ChakraTooltip.Content {...contentProps}>
            {showArrow && (
              <ChakraTooltip.Arrow>
                <ChakraTooltip.ArrowTip />
              </ChakraTooltip.Arrow>
            )}
            {content}
          </ChakraTooltip.Content>
        </ChakraTooltip.Positioner>
      </Portal>
    </ChakraTooltip.Root>
  );
}
