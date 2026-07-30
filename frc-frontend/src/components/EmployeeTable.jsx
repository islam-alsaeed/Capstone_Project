import {
    Avatar,
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { Pagination, Stack } from "@mui/material";

import { Edit, Delete } from "@mui/icons-material";

import employees from "../data/employees";

function EmployeeTable() {
    return (
        <TableContainer component={Paper}>
            <Stack
                spacing={2}
                mt={3}
                alignItems="flex-end"
            >
                <Pagination count={5} color="primary" />
            </Stack>
            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>ID</TableCell>

                        <TableCell>Photo</TableCell>

                        <TableCell>Name</TableCell>

                        <TableCell>Department</TableCell>

                        <TableCell>Designation</TableCell>

                        <TableCell>Email</TableCell>

                        <TableCell>Phone</TableCell>

                        <TableCell>Status</TableCell>

                        <TableCell align="center">Actions</TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {employees.map((employee) => (

                        <TableRow key={employee.id}>

                            <TableCell>{employee.id}</TableCell>

                            <TableCell>
                                <Avatar src={employee.photo} />
                            </TableCell>

                            <TableCell>{employee.name}</TableCell>

                            <TableCell>{employee.department}</TableCell>

                            <TableCell>{employee.designation}</TableCell>

                            <TableCell>{employee.email}</TableCell>

                            <TableCell>{employee.phone}</TableCell>

                            <TableCell>

                                <Chip
                                    label={employee.status}
                                    color={employee.status === "Active" ? "success" : "error"}
                                    variant="filled"
                                />

                            </TableCell>

                            <TableCell align="center">

                                <IconButton color="primary">
                                    <Edit />
                                </IconButton>

                                <IconButton color="error">
                                    <Delete />
                                </IconButton>

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>
        </TableContainer>
    );
}

export default EmployeeTable;