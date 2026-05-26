import React from 'react';

export const DataGrid = ({ rows, columns, pageSize, disableSelectionOnClick, autoHeight }) => {
  const displayRows = pageSize ? rows.slice(0, pageSize) : rows;

  return (
    <div className={`w-full ${autoHeight ? '' : 'h-[500px] overflow-y-auto'}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            {columns.map((col) => (
              <th
                key={col.field}
                className="p-3 text-left text-sm font-medium text-gray-700 border-b"
                style={{ minWidth: col.minWidth, width: col.flex ? `${col.flex * 100}%` : 'auto' }}
              >
                {col.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayRows.map((rowItem) => (
            <tr key={rowItem.id} className="border-b hover:bg-gray-50">
              {columns.map((col) => {
                const cellValue = rowItem[col.field];
                let content = cellValue;

                if (col.renderCell) {
                  const params = {
                    id: rowItem.id,
                    row: rowItem,
                    getValue: (id, field) => {
                      const found = rows.find(r => r.id === id);
                      return found ? found[field] : undefined;
                    }
                  };
                  content = col.renderCell(params);
                }

                let cellClass = 'p-3 text-sm text-gray-800';
                if (col.cellClassName) {
                  const params = {
                    id: rowItem.id,
                    getValue: (id, field) => {
                      const found = rows.find(r => r.id === id);
                      return found ? found[field] : undefined;
                    }
                  };
                  const extraClass = typeof col.cellClassName === 'function'
                    ? col.cellClassName(params)
                    : col.cellClassName;
                  if (extraClass) cellClass += ' ' + extraClass;
                }

                return (
                  <td key={col.field} className={cellClass}>
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="p-4 text-center text-gray-500 text-sm">No rows</div>
      )}
    </div>
  );
};
