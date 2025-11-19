import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import client from "../api/axiosClient";

export default function AddRoomDialog({ open, onClose }: { open: boolean; onClose: () => void; }) {
  const [name, setName] = useState("");
  const [baseHourlyRate, setBaseHourlyRate] = useState<number | "">("");
  const [capacity, setCapacity] = useState<number | "">("");

  async function submit() {
    if (!name || !baseHourlyRate || !capacity) { alert("Fill all fields"); return; }
    try {
      await client.createRoom({ name, baseHourlyRate: Number(baseHourlyRate), capacity: Number(capacity) });
      onClose();
    } catch (e:any) { alert(e.error || e.message || "Create failed"); }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Room</DialogTitle>
      <DialogContent sx={{ minWidth: 360 }}>
        <TextField margin="dense" label="Name" fullWidth value={name} onChange={e=>setName(e.target.value)} />
        <TextField margin="dense" label="Base Hourly Rate" fullWidth type="number" value={baseHourlyRate} onChange={e=>setBaseHourlyRate(Number(e.target.value))} />
        <TextField margin="dense" label="Capacity" fullWidth type="number" value={capacity} onChange={e=>setCapacity(Number(e.target.value))} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={submit} variant="contained">Create</Button>
      </DialogActions>
    </Dialog>
  );
}
