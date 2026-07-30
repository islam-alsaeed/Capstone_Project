import EmployeeHeader from "../components/employee/EmployeeHeader";
import EmployeeSearch from "../components/employee/EmployeeSearch";
import EmployeeTable from "../components/employee/EmployeeTable";

function Employees() {
  return (
    <>
      <EmployeeHeader />

      <EmployeeSearch />

      <EmployeeTable />
    </>
  );
}

export default Employees;