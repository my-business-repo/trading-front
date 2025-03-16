import React, { useState } from "react";
import { Drawer, Box, Button, Grid, Typography } from "@mui/material";
import EnterIcon from "@mui/icons-material/KeyboardReturn"; // Enter icon
import BackspaceIcon from "@mui/icons-material/Backspace"; // Backspace icon
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const NumPadDrawer = ({ open, setOpen, setConfirmOpen }) => {
    const [input, setInput] = useState("");

    const toggleDrawer = (state) => () => {
        setOpen(state);
    };

    const handleNumberClick = (num) => {
        setInput((prev) => prev + num);
    };

    const handleBackspace = () => {
        setInput((prev) => prev.slice(0, -1));
    };

    const handleEnter = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const response = await axios.post(
                `${API_URL}/api/v1/customer/check-fund-password`,
                { fundPassword: input },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.isValid) {
                toast.success('Fund password verified successfully');
                setOpen(false);
                setConfirmOpen(true);
            } else {
                toast.info('Invalid fund password');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to verify fund password');
        }
        setInput("");
    };

    return (
        <div>
            <ToastContainer />
            {/* NumPad Drawer */}
            <Drawer anchor="bottom" open={open} onClose={toggleDrawer(false)}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box
                        sx={{
                            width: "97%",
                            bgcolor: "#eee",
                            p: 2,
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                        }}
                    >
                        {/* <Typography variant="h6" align="center" gutterBottom>
                            Fund Password
                        </Typography> */}

                        {/* Display entered numbers */}
                        <Typography
                            variant="h5"
                            align="center"
                            sx={{ bgcolor: "white", p: 1, mb: 2, borderRadius: 1 }}
                        >
                            {input || "Enter Fund Password"}
                        </Typography>

                        {/* NumPad Grid */}
                        <Grid container spacing={1} justifyContent="center">
                            {[8, 3, 6, 4, 5, 1, 7, 9, 2].map((num) => (
                                <Grid item xs={4} key={num}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            width: "100%",
                                            bgcolor: "purple",
                                            color: "white",
                                            fontSize: "1.5rem",
                                        }}
                                        onClick={() => handleNumberClick(num)}
                                    >
                                        {num}
                                    </Button>
                                </Grid>
                            ))}

                            {/* Enter Icon */}
                            <Grid item xs={4}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        width: "100%",
                                        bgcolor: "purple",
                                        color: "white",
                                        fontSize: "1.5rem",
                                    }}
                                    onClick={handleEnter}
                                >
                                    <EnterIcon sx={{ fontSize: "2.6rem" }} />
                                </Button>
                            </Grid>

                            {/* Zero Button */}
                            <Grid item xs={4}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        width: "100%",
                                        bgcolor: "purple",
                                        color: "white",
                                        fontSize: "1.5rem",
                                    }}
                                    onClick={() => handleNumberClick(0)}
                                >
                                    0
                                </Button>
                            </Grid>

                            {/* Backspace Icon */}
                            <Grid item xs={4}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        width: "100%",
                                        bgcolor: "purple",
                                        color: "white",
                                        fontSize: "1.5rem",
                                    }}
                                    onClick={handleBackspace}
                                >
                                    <BackspaceIcon sx={{ fontSize: "2.6rem" }} />
                                </Button>
                            </Grid>
                        </Grid>

                        {/* Close button */}
                        <Box display="flex" justifyContent="center" mt={2}>
                            <Button variant="contained" color="error" onClick={toggleDrawer(false)}>
                                Close
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Drawer>
        </div>
    );
};

export default NumPadDrawer;
