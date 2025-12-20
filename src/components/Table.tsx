import { Flex, Table as ChakraTable } from "@chakra-ui/react";
import IconButton, { IconButtonProps } from "./IconButton";

export type Column<T> = {
  header: string;
  isNumeric?: boolean;
  width?: number | string;
} & ({ key: keyof T } | { format: (data: T) => string });

type RowAction<T> = {
  icon: IconButtonProps["icon"];
  isDisabled?: boolean;
  label: string;
  onClick: (data: T) => void;
};

export type TableProps<T> = {
  actions?: RowAction<T>[];
  actionColumnWidth?: number | string;
  caption?: string;
  columns: Column<T>[];
  data: T[];
  getRowActions?: (row: T) => RowAction<T>[];
  highlightRowOnHover?: boolean;
  onClickRow?: (row: T) => void | Promise<void>;
};

function Table<T>({
  actions,
  actionColumnWidth = 110,
  caption,
  columns,
  data,
  getRowActions,
  onClickRow,
}: TableProps<T>) {
  return (
    <ChakraTable.ScrollArea>
      <ChakraTable.Root borderWidth={1} size="sm" tableLayout="fixed">
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
            {((!!actions && actions.length > 0) || !!getRowActions) && (
              <ChakraTable.ColumnHeader
                bgColor="bg.muted"
                borderWidth={0}
                maxW={actionColumnWidth}
                minW={actionColumnWidth}
                w={actionColumnWidth}
              />
            )}
          </ChakraTable.Row>
        </ChakraTable.Header>
        <ChakraTable.Body>
          {data.map((row, rowIndex) => {
            const rowActions = getRowActions ? getRowActions(row) : actions;

            return (
              <ChakraTable.Row
                _hover={{ bgColor: "bg.emphasized" }}
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
                {!!rowActions && rowActions.length > 0 && (
                  <ChakraTable.Cell
                    borderWidth={0}
                    maxW={actionColumnWidth}
                    minW={actionColumnWidth}
                    w={actionColumnWidth}
                  >
                    <Flex className="action" gap={1} justifyContent="flex-end">
                      {rowActions.map((action) => (
                        <IconButton
                          icon={action.icon}
                          isDisabled={action.isDisabled}
                          key={action.label}
                          label={action.label}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(row);
                          }}
                        />
                      ))}
                    </Flex>
                  </ChakraTable.Cell>
                )}
              </ChakraTable.Row>
            );
          })}
        </ChakraTable.Body>
      </ChakraTable.Root>
    </ChakraTable.ScrollArea>
  );
}

export default Table;
