import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppContext } from "../../../context/AppContext";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SetFundPassword() {
    const navigate = useNavigate();
    const { theme } = useAppContext();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkingPasswordStatus, setCheckingPasswordStatus] = useState(true);

    useEffect(() => {
        // Check if fund password is already set
        const checkFundPasswordStatus = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/v1/customer/is-set-fund-password`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.data.isSet) {
                    // If fund password is already set, redirect to modify page
                    navigate("/modify-fund-password");
                }
                setCheckingPasswordStatus(false);
            } catch (error) {
                console.error("Error checking fund password status:", error);
                setCheckingPasswordStatus(false);
            }
        };

        checkFundPasswordStatus();
    }, [navigate]);

    const handleSubmit = async () => {
        // Validate passwords
        if (!newPassword || !confirmPassword) {
            setError("Please fill in both password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!/^\d{6,}$/.test(newPassword)) {
            setError("Password must be at least 6 digits and contain only numbers");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/customer/set-fund-password`,
                {
                    fundPassword: newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                // Navigate back to settings page on success
                navigate("/general-settings");
            } else {
                setError(response.data.message || "Failed to set fund password");
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
            console.error("Error setting fund password:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        // Handle forgot password functionality
        console.log("Forgot fund password clicked");
        // You might want to navigate to a recovery page or show a modal
    };

    if (checkingPasswordStatus) {
        return (
            <Box sx={{ padding: 2, background: theme === "dark" ? "#1e1e1e" : "#f5f5f5", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography>Checking fund password status...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 2, background: theme === "dark" ? "#1e1e1e" : "#f5f5f5", minHeight: "100vh" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" sx={{ ml: 1, fontWeight: "bold" }}>
                    Set Fund Password
                </Typography>
            </Box>

            <Box sx={{ mt: 4 }}>
                <TextField
                    fullWidth
                    placeholder="Please enter a new fund password(pure numbers,6 digits or more)"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 1,
                            bgcolor: theme === "dark" ? "#2c2c2c" : "white",
                        },
                        "& .MuiOutlinedInput-input": {
                            color: theme === "dark" ? "#ddd" : "inherit",
                        },
                    }}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />

                <TextField
                    fullWidth
                    placeholder="Please enter a new fund password(pure numbers,6 digits or more)"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 1,
                            bgcolor: theme === "dark" ? "#2c2c2c" : "white",
                        },
                        "& .MuiOutlinedInput-input": {
                            color: theme === "dark" ? "#ddd" : "inherit",
                        },
                    }}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />

                {error && (
                    <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                        {error}
                    </Typography>
                )}

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                        py: 1.5,
                        bgcolor: "#3f51b5",
                        color: "white",
                        textTransform: "none",
                        fontSize: "1rem",
                        "&:hover": {
                            bgcolor: "#303f9f",
                        },
                    }}
                >
                    Submit
                </Button>

                <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Typography
                        onClick={handleForgotPassword}
                        sx={{
                            color: "#3f51b5",
                            cursor: "pointer",
                            fontWeight: "medium",
                            "&:hover": {
                                textDecoration: "underline",
                            },
                        }}
                    >
                        Forgot the fund password
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
} 