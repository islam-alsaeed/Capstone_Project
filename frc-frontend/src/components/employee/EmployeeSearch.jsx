import {
  InputAdornment,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import "./EmployeeSearch.css";

function EmployeeSearch({ value = "", onChange }) {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={onChange}
      placeholder="Search employee..."
      className="employee-search"
      inputprops={{
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