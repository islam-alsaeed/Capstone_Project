<tr>

<td>{employee.id}</td>

<td>

<img src={employee.photo} />

</td>

<td>{employee.name}</td>

<td>{employee.department}</td>

<td>{employee.designation}</td>

<td>{employee.email}</td>

<td>{employee.phone}</td>

<td>

<span className={employee.status}>

{employee.status}

</span>

</td>

<td>

<button>Edit</button>

<button>Delete</button>

</td>

</tr>