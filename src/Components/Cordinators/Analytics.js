import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";
import BaseUrl from "../../BaseUrl/BaseUrl";

import { FileDownload, AssessmentOutlined } from "@mui/icons-material";

const Analytics = () => {
  const [eventStats, setEventStats] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { club } = useSelector((state) => state.auth);

  // Fetch event stats on component mount
  useEffect(() => {
    const fetchEventStats = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/event/${club._id}/stats`);

        const data = await response.data;

        if (data.success) {
          setEventStats(data.stats);
          setLoading(false);
        } else {
          throw new Error("Failed to fetch event stats");
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEventStats();
  }, []);

  // Fetch all events for report generation
  const fetchAllEvents = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/event/AllEvents`);

      const data = await response.data;
      setAllEvents(data.data.events || []);
      console.log("all events", data);
      setOpenDialog(true);
    } catch (err) {
      setError("Failed to fetch events");
    }
  };

  // Download report for a specific event
  const downloadReport = async (eventId) => {
    try {
      const response = await axios.get(
        `${BaseUrl}/event/clubs/67224fda73c5d1dce37bbe6f/events/${eventId}/report`,
        {
          responseType: "blob", // Ensures the response is treated as a binary file (blob)
        }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "event_report.pdf"; // Specify the file name
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url); // Clean up the URL object
    } catch (err) {
      setError("Failed to download report");
      console.error(err);
    }
  };

  // Prepare data for charts
  const chartData = eventStats.map((event) => ({
    name: event.eventTitle,
    registrations: event.totalRegistrations,
    attendees: event.totalAttendees,
    certificates: event.certificatesIssued,
  }));

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading analytics...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: "100%", maxWidth: 400, margin: "auto", mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "auto" }}>
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={<AssessmentOutlined />}
          title={
            <Typography
              variant="h6"
              sx={{ fontSize: "25px", fontWeight: "bold" }}
            >
              Event Analytics Dashboard
            </Typography>
          }
        />
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="registrations"
                fill="#8884d8"
                name="Registrations"
              />
              <Bar dataKey="attendees" fill="#82ca9d" name="Attendees" />
              <Bar dataKey="certificates" fill="#ffc658" name="Certificates" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title={
            <Typography
              variant="h6"
              sx={{ fontSize: "25px", fontWeight: "bold" }}
            >
              Event Details
            </Typography>
          }
        />

        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: "18px" }}>Event Title</TableCell>
                  <TableCell sx={{ fontSize: "18px" }} align="right">
                    Registrations
                  </TableCell>
                  <TableCell sx={{ fontSize: "18px" }} align="right">
                    Attendees
                  </TableCell>
                  <TableCell sx={{ fontSize: "18px" }} align="right">
                    Certificates
                  </TableCell>
                  <TableCell sx={{ fontSize: "18px" }} align="right">
                    Activity Points
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eventStats.map((event, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {event.eventTitle}
                    </TableCell>
                    <TableCell align="right">
                      {event.totalRegistrations}
                    </TableCell>
                    <TableCell align="right">{event.totalAttendees}</TableCell>
                    <TableCell align="right">
                      {event.certificatesIssued}
                    </TableCell>
                    <TableCell align="right">{event.activityPoints}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={fetchAllEvents}
          startIcon={<FileDownload />}
        >
          Event Reports
        </Button>
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          className="text-center font-bold"
          sx={{ fontSize: "25px" }}
        >
          Event Reports
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: "20px" }}>Event Name</TableCell>
                  <TableCell sx={{ fontSize: "20px" }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allEvents.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => downloadReport(event._id)}
                        startIcon={<FileDownload />}
                      >
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Analytics;
