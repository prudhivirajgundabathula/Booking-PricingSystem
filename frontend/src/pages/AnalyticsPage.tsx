import React, { useState } from "react";
import client from "../api/axiosClient";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";

export default function AnalyticsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [data, setData] = useState<any[]>([]);

  async function fetch() {
    try {
      const fromISO = new Date(from + "T00:00:00").toISOString();
      const toISO = new Date(to + "T23:59:59").toISOString();
      const res = await client.getAnalytics(fromISO, toISO);
      setData(res);
    } catch (e: any) { alert(e.error || e.message || "Analytics failed"); }
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Analytics</Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField type="date" value={from} onChange={e => setFrom(e.target.value)} />
        <TextField type="date" value={to} onChange={e => setTo(e.target.value)} />
        <Button variant="contained" onClick={fetch}>Fetch</Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room</TableCell>
              <TableCell>Total Hours</TableCell>
              <TableCell>Total Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: any) => (
              <TableRow key={row.roomId}>
                <TableCell>{row.roomName}</TableCell>
                <TableCell>{row.totalHours}</TableCell>
                <TableCell>₹{row.totalRevenue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
