import {
  InputAdornment,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import "./EmployeeSearch.css";

function EmployeeSearch({ value, onChange }) {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={onChange}
      placeholder="Search employees..."
      className="employee-search"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}

export default EmployeeSearch;