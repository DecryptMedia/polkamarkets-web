import { ReactNode } from 'react';

import isEmpty from 'lodash/isEmpty';
import xor from 'lodash/xor';

export type TableMiniColumn = {
  /**
   * Unique key of this column
   */
  key: string;
  /**
   * Title of this column
   */
  title: string;
  /**
   * Custom title render function
   */
  render?: (_value: any) => ReactNode;
};

export type TableMiniRowValue = {
  /**
   * Row slice value
   */
  value: { [key: string]: string | number };
  /**
   * Row slice value custom render
   */
  render?: (_value: any) => ReactNode;
};

export type TableMiniRow = {
  /**
   * Row slice
   */
  [key: string]: TableMiniRowValue;
};

type TableMiniProps = {
  /**
   * Columns of table
   */
  columns: TableMiniColumn[];
  /**
   * Row of table
   */
  row: TableMiniRow;
};

/**
 * Table mini
 */
function TableMini({ columns, row }: TableMiniProps) {
  const columnsKeys = [...columns.map(column => column.key)];
  const rowKeys = Object.keys(row);

  if (!isEmpty(xor(columnsKeys, rowKeys))) return null;

  return (
    <ol className="flex-column gap-4">
      {columns.map(column => {
        const rowSlice = row[column.key];
        return (
          <li key={`${column.key}`} className="flex-row align-center gap-3">
            {column.render ? (
              column.render(rowSlice.value)
            ) : (
              <span className="tiny-uppercase bold text-3">{column.title}</span>
            )}
            <div className="grow border-dashed-bottom border-1-75" />
            {rowSlice.render ? (
              rowSlice.render(rowSlice.value)
            ) : (
              <span className="caption semibold text-3">{rowSlice.value}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default TableMini;
