/**
 * Tabla solo para lectores de pantalla (datos detrás de gráficos Recharts).
 */
export default function ChartSrTable({ caption, columns, rows, tableId }) {
  if (!rows?.length) return null

  return (
    <table className="visually-hidden" id={tableId}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} scope="col">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.key ?? index}>
            {columns.map((col) => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
