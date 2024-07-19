// Table.js
import React from "react";
import { Typography, Chip } from "@material-tailwind/react";

const Table = ({ columns, data, renderActions }) => {
  return (
    <table className="w-full min-w-[640px] table-auto">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.field} className="border-b border-blue-gray-50 py-3 px-5 text-left">
              <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                {col.label}
              </Typography>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, key) => {
          const className = `py-3 px-5 ${key === data.length - 1 ? "" : "border-b border-blue-gray-50"}`;
          return (
            <tr key={item._id}>
              {columns.map((col) => (
                <td key={col.field} className={className}>
                  {col.render ? col.render(item[col.field], item) : (
                    <Typography variant="small" color="blue-gray" className="font-semibold">
                      {item[col.field]}
                    </Typography>
                  )}
                </td>
              ))}
              {renderActions && <td className={className}>{renderActions(item)}</td>}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
