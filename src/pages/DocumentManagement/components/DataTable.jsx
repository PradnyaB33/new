import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useGetUser from "../../../hooks/Token/useUser";

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

const DataTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const { authToken } = useGetUser();

  const { data: data1 } = useQuery(`getAllOrg`, async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/organization/getall`,
      {
        headers: { Authorization: authToken },
      }
    );

    return response.data.orgData;
  });

  const { data: employeeData, refetch: refetchEmployees } = useQuery(
    `getEmp`,
    async () => {
      if (selectedOrganizationId) {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/get/${selectedOrganizationId}`,
          {
            headers: { Authorization: authToken },
          }
        );
        return response.data.employees;
      }
      return [];
    }
  );

  console.log(employeeData);

  useEffect(() => {
    setFilteredRows(employeeData);
  }, [employeeData]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterRows(query);
  };

  const handleOrganizationChange = (event) => {
    const orgId = event.target.value;
    setSelectedOrganizationId(orgId);
    console.log(selectedOrganizationId);
    refetchEmployees();
  };

  const filterRows = (query) => {
    const filteredData = employeeData.filter(
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

  const NoRowsOverlay = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <div>No employees in this organization</div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex" style={{ marginBottom: "1rem" }}>
        {data1 ? (
          <FormControl size="small" style={{ width: 200 }}>
            <InputLabel id="holiday-type-label">Select Organization</InputLabel>
            <Select
              label="select organization"
              className="mb-[8px]"
              name="type"
              onChange={handleOrganizationChange}
            >
              {data1.map((org) => (
                <MenuItem key={org._id} value={org._id}>
                  {org.orgName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : null}
        <TextField
          label="Search Employee"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
      ></div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          checkboxSelection
          components={{
            NoRowsOverlay: NoRowsOverlay,
          }}
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
