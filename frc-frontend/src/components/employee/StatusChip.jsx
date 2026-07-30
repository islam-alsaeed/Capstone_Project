import Chip from "@mui/material/Chip";

function StatusChip({ status }) {
  const active = status === "Active";

  return (
    <Chip
      label={status}
      sx={{
        backgroundColor: active ? "#E8F5E9" : "#FDECEC",
        color: active ? "#2E7D32" : "#C62828",
        fontWeight: 600,
        borderRadius: "20px",
      }}
    />
  );
}

export default StatusChip;