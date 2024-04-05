import { Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
];

const DataTable = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);

  useEffect(() => {
    setFilteredRows(data);
  }, [data]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterRows(query);
  };

  const filterRows = (query) => {
    const filteredData = data.filter(
      (item) =>
        item.first_name.toLowerCase().includes(query.toLowerCase()) ||
        item.last_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRows(filteredData);
  };

  const rows = filteredRows.map((item, idx) => ({
    id: idx + 1,
    lastName: item.last_name,
    firstName: item.first_name,
    fullName: `${item.first_name || ""} ${item.last_name || ""}`,
  }));

  return (
    <div>
      <TextField
        label="Search Employee"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginBottom: "1rem" }}
      />
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          checkboxSelection
        />
        <div className="mt-5">
          <Button size="small" variant="contained">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
