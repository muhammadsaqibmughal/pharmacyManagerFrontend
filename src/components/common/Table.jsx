const Table = ({
  columns,
  data,
  theme,
  noDataText = "No data found.",
  pagination,
}) => {
  console.log(data)
  return (
    <>
      <div
        className={`table-Main relative ${
          theme === "dark"
            ? "border-white/10 bg-white/10"
            : "border-black/10 bg-white/60"
        }`}
      >

        <table
          className={`w-full table-auto ${
            theme === "dark" ? "text-light-50" : "text-primary-50"
          }`}
        >
          <thead className="uppercase text-left text-sm bg-bg-50 text-white/80">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b ${row.rowClass} ${
                    theme === "dark" ? "border-white/20" : "border-black/20"
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={` px-4 py-2`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-gray-400"
                >
                  {noDataText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div
          className={`px-8 py-2   border-t  backdrop-blur-sm ${
            theme === "dark"
              ? "border-slate-700/50 bg-slate-800/40"
              : "border-gray-200/80 bg-gradient-to-r from-gray-50/80 to-slate-50/80"
          }`}
        >
          {pagination}
        </div>
      )}
    </>
  );
};

export default Table;
