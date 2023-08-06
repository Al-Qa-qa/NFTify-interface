// UI Components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MuiLink from "@/src/Link";
// --------
type TableRow = {
  key: string;
  value: string;
  to?: string;
};

type ManualTableType = {
  tableBody: TableRow[];
};

const ManualTable = ({ tableBody }: ManualTableType) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label="properties table">
        <TableBody>
          {tableBody.map((tableRow, i) => (
            <TableRow
              key={"manual-table-row-" + i}
              sx={{
                "&:last-child td, &:last-child th": {
                  border: 0,
                },
              }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ color: "text.secondary" }}
              >
                {tableRow.key}
              </TableCell>
              <TableCell align="left">
                {tableRow.to ? (
                  <MuiLink href={tableRow.to} target="_blank">
                    {tableRow.value}
                  </MuiLink>
                ) : (
                  tableRow.value
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ManualTable;
