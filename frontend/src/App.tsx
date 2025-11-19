import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";

import RoomsPage from "./pages/RoomsPage";
import BookingPage from "./pages/BookingPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import AnalyticsPage from "./pages/AnalyticsPage";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Booking & Pricing</Typography>
          <div>
            <Button component={Link} to="/" color="inherit">Rooms</Button>
            <Button component={Link} to="/book" color="inherit">Book</Button>
            <Button component={Link} to="/admin/bookings" color="inherit">Admin</Button>
            <Button component={Link} to="/admin/analytics" color="inherit">Analytics</Button>
          </div>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4, mb: 6 }}>
        <Routes>
          <Route path="/" element={<RoomsPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}
