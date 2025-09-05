import {
  Flex,
  SystemStyleObject,
  Table as ChakraTable,
} from "@chakra-ui/react";
import { useMemo } from "react";
import IconButton, { IconButtonProps } from "./IconButton";

export type Column<T> = {
  header: string;
  isNumeric?: boolean;
  width?: number | string;
} & ({ key: keyof T } | { format: (data: T) => string });

export type TableProps<T> = {
  actions?: {
    icon: IconButtonProps["icon"];
    isDisabled?: boolean;
    label: string;
    onClick: (data: T) => void;
  }[];
  caption?: string;
  columns: Column<T>[];
  data: T[];
  highlightRowOnHover?: boolean;
  onClickRow?: (row: T) => void | Promise<void>;
};

function Table<T>({
  actions,
  caption,
  columns,
  data,
  onClickRow,
}: TableProps<T>) {
  return (
    <ChakraTable.ScrollArea>
      <ChakraTable.Root
        borderWidth={1}
        interactive
        tableLayout="fixed"
        size="sm"
      >
        {caption && <ChakraTable.Caption>{caption}</ChakraTable.Caption>}
        <ChakraTable.Header>
          <ChakraTable.Row borderBottomWidth={1}>
            {columns.map((column) => (
              <ChakraTable.ColumnHeader
                bgColor="bg.muted"
                borderWidth={0}
                key={column.header}
                width={column.width}
              >
                {column.header}
              </ChakraTable.ColumnHeader>
            ))}
            {!!actions && actions.length > 0 && (
              <ChakraTable.ColumnHeader
                bgColor="bg.muted"
                borderWidth={0}
                w={110}
              />
            )}
          </ChakraTable.Row>
        </ChakraTable.Header>
        <ChakraTable.Body>
          {data.map((row, rowIndex) => (
            <ChakraTable.Row
              bgColor="transparent"
              cursor={onClickRow ? "pointer" : "default"}
              key={rowIndex}
              onClick={() => onClickRow?.(row)}
            >
              {columns.map((column, columnIndex) => (
                <ChakraTable.Cell
                  borderWidth={0}
                  key={`${rowIndex}-${columnIndex}`}
                  overflow="hidden"
                  whiteSpace="normal"
                  width={column.width}
                >
                  {"key" in column ? `${row[column.key]}` : column.format(row)}
                </ChakraTable.Cell>
              ))}
              {!!actions && actions.length > 0 && (
                <ChakraTable.Cell borderWidth={0}>
                  <Flex className="action" gap={1} justifyContent="flex-end">
                    {actions.map((action) => (
                      <IconButton
                        icon={action.icon}
                        isDisabled={action.isDisabled}
                        key={action.label}
                        label={action.label}
                        onClick={() => action.onClick(row)}
                      />
                    ))}
                  </Flex>
                </ChakraTable.Cell>
              )}
            </ChakraTable.Row>
          ))}
        </ChakraTable.Body>
      </ChakraTable.Root>
    </ChakraTable.ScrollArea>
  );
}

export default Table;
