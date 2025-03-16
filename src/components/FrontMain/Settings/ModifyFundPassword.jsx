import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppContext } from "../../../context/AppContext";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ModifyFundPassword() {
    const navigate = useNavigate();
    const { theme } = useAppContext();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        // Validate passwords
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Please fill in all password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (!/^\d{6,}$/.test(newPassword)) {
            setError("Password must be at least 6 digits and contain only numbers");
            return;
        }

        // POST {{baseUrl}}/api/v1/customer/modify-fund-password
        // Authorization: Bearer {{authToken}}
        // Content-Type: application/json

        // {
        //     "oldFundPassword": "123456",
        //     "newFundPassword": "123456"
        // }


        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/customer/modify-fund-password`,
                {
                    oldFundPassword: oldPassword,
                    newFundPassword: newPassword
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
                console.log(response.data);
                setError(response.data.message || "Failed to modify fund password");
            }
        } catch (error) {
            console.log(error.response?.response?.data);

            setError(error?.response?.data?.error || "An error occurred");
            console.error("Error modifying fund password:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        // Handle forgot password functionality
        console.log("Forgot fund password clicked");
        // You might want to navigate to a recovery page or show a modal
    };

    return (
        <Box sx={{ padding: 2, background: theme === "dark" ? "#1e1e1e" : "#f5f5f5", minHeight: "100vh" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" sx={{ ml: 1, fontWeight: "bold" }}>
                    Modify Fund Password
                </Typography>
            </Box>

            <Box sx={{ mt: 4 }}>
                <TextField
                    fullWidth
                    placeholder="Please enter the old fund password"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
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