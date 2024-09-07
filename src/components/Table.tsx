import {
  Flex,
  SystemStyleObject,
  Table as CTable,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
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
  highlightRowOnHover,
  onClickRow,
}: TableProps<T>) {
  const rowOddStyle = useMemo(() => {
    return {
      backgroundColor: "gray.100",
    };
  }, []);

  const rowHoverStyle = useMemo(() => {
    const style: SystemStyleObject = { "& .action": { visibility: "visible" } };
    if (highlightRowOnHover || onClickRow) style.backgroundColor = "blue.100";
    if (onClickRow) style.cursor = "pointer";
    return style;
  }, [onClickRow]);

  return (
    <TableContainer>
      <CTable
        bg="white"
        borderColor="gray.500"
        borderWidth={1}
        layout="fixed"
        size="sm"
      >
        {caption && <TableCaption>{caption}</TableCaption>}
        <Thead>
          <Tr borderBottomWidth={1} borderColor="gray.500">
            {columns.map((column) => (
              <Th
                borderWidth={0}
                isNumeric={column.isNumeric}
                key={column.header}
                width={column.width}
              >
                {column.header}
              </Th>
            ))}
            {!!actions && actions.length > 0 && <Th borderWidth={0} w={110} />}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, rowIndex) => (
            <Tr
              key={rowIndex}
              onClick={() => onClickRow?.(row)}
              _odd={rowOddStyle}
              _hover={rowHoverStyle}
            >
              {columns.map((column, columnIndex) => (
                <Td
                  borderWidth={0}
                  isNumeric={column.isNumeric}
                  key={`${rowIndex}-${columnIndex}`}
                  overflow="hidden"
                  whiteSpace="normal"
                  width={column.width}
                >
                  {"key" in column ? `${row[column.key]}` : column.format(row)}
                </Td>
              ))}
              {!!actions && actions.length > 0 && (
                <Td borderWidth={0}>
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
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </CTable>
    </TableContainer>
  );
}

export default Table;
