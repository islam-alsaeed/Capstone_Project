import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function DashboardCards() {
  const [totalEmployees, setTotalEmployees] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/employee/list")
      .then((res) => res.json())
      .then((data) => {
        setTotalEmployees(data.employees.length);
      })
      .catch((err) => console.error("Failed to load employees", err));
  }, []);

  const cards = [
    { title: "Total Employees", value: totalEmployees },
    // { title: "New Registrations", value: 5 }, // you can make this dynamic later
    { title: "Face Matches Today", value: 12 },
    { title: "Camera Captures", value: 18 },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              textAlign: "center",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6">{card.title}</Typography>
            <Typography variant="h4" sx={{ marginTop: 1 }}>
              {card.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
