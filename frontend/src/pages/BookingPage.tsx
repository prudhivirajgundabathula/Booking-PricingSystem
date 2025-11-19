import React, { useEffect, useState } from "react";
import client from "../api/axiosClient";
import { Room } from "../types";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';


export default function BookingPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(()=> { (async ()=>{ const r = await client.listRooms(); setRooms(r); if (r[0]) setRoomId(r[0]._id); })(); }, []);

  async function submit() {
    setMessage(null);
    if (!roomId || !userName || !start || !end) { setMessage("All fields required"); return; }
    try {
      const payload = { roomId, userName, startTime: start.toISOString(), endTime: end.toISOString() };
      const res = await client.createBooking(payload);
      setMessage(`Confirmed: ₹${res.totalPrice}`);
      setUserName(""); setStart(null); setEnd(null);
    } catch (e:any) { setMessage(e.error || e.message || "Booking failed"); }
  }

  return (
    <Box maxWidth={640}>
      <Typography variant="h5" gutterBottom>Create booking</Typography>

      <TextField select label="Room" value={roomId} onChange={e=>setRoomId(e.target.value)} fullWidth margin="normal">
        {rooms.map(r => <MenuItem key={r._id} value={r._id}>{r.name} — ₹{r.baseHourlyRate}/hr</MenuItem>)}
      </TextField>

      <TextField label="Your name" value={userName} onChange={e=>setUserName(e.target.value)} fullWidth margin="normal" />

      <LocalizationProvider dateAdapter={AdapterDateFns}>
  <DateTimePicker
    label="Start time"
    value={start}
    onChange={(d) => setStart(d)}
    slotProps={{
      textField: {
        fullWidth: true,
        margin: "normal"
      }
    }}
  />

  <DateTimePicker
    label="End time"
    value={end}
    onChange={(d) => setEnd(d)}
    slotProps={{
      textField: {
        fullWidth: true,
        margin: "normal"
      }
    }}
  />
</LocalizationProvider>


      {message && <Typography color="error" sx={{ mt:2 }}>{message}</Typography>}

      <Box mt={2}><Button variant="contained" onClick={submit}>Book</Button></Box>
    </Box>
  );
}
