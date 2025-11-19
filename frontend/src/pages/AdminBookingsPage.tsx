import React, { useEffect, useState } from "react";
import client from "../api/axiosClient";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);

  async function load() {
    try { const b = await client.listBookings(); setBookings(b); } catch (e:any) { alert(e.error || e.message || "Failed"); }
  }

  useEffect(()=> { load(); }, []);

  async function cancel(id: string) {
    if (!confirm("Cancel booking?")) return;
    try { await client.cancelBooking(id); load(); } catch (e:any) { alert(e.error || e.message || "Failed"); }
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Bookings</Typography>
      <Paper sx={{ p:2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map(b => (
              <TableRow key={b._id}>
                <TableCell>{b.userName}</TableCell>
                <TableCell>{b.roomId}</TableCell>
                <TableCell>{new Date(b.startTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(b.endTime).toLocaleString()}</TableCell>
                <TableCell>{b.status}</TableCell>
                <TableCell>{b.status!=="CANCELLED" && <Button color="error" onClick={()=>cancel(b._id)}>Cancel</Button>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
