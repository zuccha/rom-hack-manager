import {
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

export type Column<T> = {
  header: string;
  isNumeric?: boolean;
} & ({ key: keyof T } | { format: (data: T) => string });

export type TableProps<T> = {
  caption?: string;
  columns: Column<T>[];
  data: T[];
  onClickRow?: (row: T) => void | Promise<void>;
};

function Table<T>({ caption, columns, data, onClickRow }: TableProps<T>) {
  const rowOddStyle = useMemo(() => {
    return {
      backgroundColor: "gray.100",
    };
  }, []);

  const rowHoverStyle = useMemo(() => {
    return onClickRow
      ? {
          backgroundColor: "blue.200",
          cursor: "pointer",
        }
      : undefined;
  }, [onClickRow]);

  return (
    <TableContainer>
      <CTable bg="white" borderWidth={1} layout="fixed" size="sm">
        {caption && <TableCaption>{caption}</TableCaption>}
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th isNumeric={column.isNumeric} key={column.header}>
                {column.header}
              </Th>
            ))}
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
                  isNumeric={column.isNumeric}
                  key={`${rowIndex}-${columnIndex}`}
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {"key" in column ? `${row[column.key]}` : column.format(row)}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </CTable>
    </TableContainer>
  );
}

export default Table;
