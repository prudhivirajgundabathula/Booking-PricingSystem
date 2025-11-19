import React, { useEffect, useState } from "react";
import client from "../api/axiosClient";
import { Room } from "../types";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddRoomDialog from "../shared/AddRoomDialog";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [open, setOpen] = useState(false);

  async function load() {
    try { setRooms(await client.listRooms()); } catch (e:any) { alert(e.error || e.message || "Failed"); }
  }

  useEffect(()=> { load(); }, []);

  async function seed() {
    try { await client.seedRooms(); load(); } catch (e:any) { alert(e.error || e.message); }
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Rooms</Typography>
        <Box>
          <Button variant="outlined" onClick={()=>setOpen(true)} sx={{ mr:1 }}>Add Room</Button>
          <Button variant="contained" onClick={seed}>Seed</Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {rooms.map(r => (
          <Grid item xs={12} md={4} key={r._id}>
            <Paper sx={{ p:2 }}>
              <Typography variant="h6">{r.name}</Typography>
              <Typography variant="body2">Rate: ₹{r.baseHourlyRate}/hr</Typography>
              <Typography variant="body2">Capacity: {r.capacity}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <AddRoomDialog open={open} onClose={() => { setOpen(false); load(); }} />
    </>
  );
}
