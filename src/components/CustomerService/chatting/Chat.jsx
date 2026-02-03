import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    IconButton,
    Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [connected] = useState(true); // always "connected" in mock
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const chatBottomRef = useRef(null);
    const fileInputRef = useRef(null);

    // Track previous message count
    const prevMessagesCountRef = useRef(0);

    // Scroll to bottom when messages increase or receive
    useEffect(() => {
        if (messages.length > prevMessagesCountRef.current) {
            if (chatBottomRef.current) {
                chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
        prevMessagesCountRef.current = messages.length;
    }, [messages]);

    // Fetch message history from API on mount
    const fetchMessages = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL;
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch(`${API_URL}/api/v1/customer/message`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const dt = await response.json();
                setMessages(dt.data);
            }
        } catch (err) {}
    };

    // Poll the message count every 3 seconds.
    useEffect(() => {
        const API_URL = process.env.REACT_APP_API_URL;
        const token = localStorage.getItem("token");
        let prevCount = null;
        let intervalId = null;

        const fetchMessageCount = async () => {
            try {
                if (!token) return;
                const response = await fetch(`${API_URL}/api/v1/customer/message/count`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const dt = await response.json();
                    if (typeof dt.data.count === "number") {
                        if (prevCount === null) {
                            prevCount = dt.data.count;
                        } else if (dt.data.count !== prevCount) {
                            prevCount = dt.data.count;
                            fetchMessages();
                        }
                    }
                }
            } catch (err) {}
        };

        intervalId = setInterval(fetchMessageCount, 3000);

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        fetchMessages();
    }, []);

    const sendMessage = () => {
        // Block UI if neither text nor valid file
        if (!messageInput.trim() && !imageFile) return;
        setLoading(true);
        const API_URL = process.env.REACT_APP_API_URL;
        const token = localStorage.getItem("token");

        // If sending an image:
        if (imageFile) {
            const formData = new FormData();
            formData.append("type", "IMAGE");
            formData.append("file", imageFile);

            fetch(`${API_URL}/api/v1/customer/message/image`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData,
            })
                .then(async (response) => {
                    if (response.ok) {
                        await fetchMessages();
                        setMessageInput("");
                        setImageFile(null);
                        setImagePreview(null);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                        }
                    }
                })
                .catch((err) => {})
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // Just text message as before
            fetch(`${API_URL}/api/v1/customer/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ content: messageInput }),
            })
                .then(async (response) => {
                    if (response.ok) {
                        await fetchMessages();
                        setMessageInput("");
                    }
                })
                .catch((err) => {})
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const handleBack = () => {
        window.history.back();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Box
            maxWidth="sm"
            sx={{
                mx: "auto",
                my: 4,
                height: "80vh",
                display: "flex",
                flexDirection: "column",
            }}
            component={Paper}
            elevation={2}
        >
            {/* Header */}
            <Box
                p={2}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "1px solid #e0e0e0",
                    position: "sticky",
                    top: 0,
                    background: "#fff",
                    zIndex: 10,
                }}
            >
                <IconButton onClick={handleBack} color="primary">
                    <ArrowBackIcon />
                </IconButton>
                <Typography
                    sx={{ fontWeight: 600, fontSize: 20, color: "primary.main", ml: 2 }}
                >
                    Chat with Admin
                </Typography>
                {loading && (
                    <Typography
                        sx={{ ml: 2, fontSize: 13, color: "primary.main" }}
                    >
                        Admin typing…
                    </Typography>
                )}
                {!loading && (
                    <Typography
                        sx={{
                            ml: "auto",
                            fontSize: 13,
                            color: connected ? "green" : "red",
                            fontWeight: 500,
                        }}
                    >
                        {connected ? "Online" : "Offline"}
                    </Typography>
                )}
            </Box>
            {/* Chat Messages */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 2,
                    background: "#f8f8f8",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {messages.length === 0 && (
                    <Typography
                        sx={{ textAlign: "center", color: "#bbb", mt: 4, fontSize: 15 }}
                    >
                        No messages yet. Start the conversation!
                    </Typography>
                )}
                {messages.map((msg, idx) => {
                    const isCustomer = msg.from !== "admin";
                    return (
                        <Box
                            key={idx + msg.content}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: isCustomer ? "flex-end" : "flex-start",
                                mb: 1.8,
                            }}
                        >
                            <Box
                                sx={{
                                    px: 2,
                                    py: 1,
                                    borderRadius: 3,
                                    background: isCustomer
                                        ? "#add8e6"
                                        : "#D3D3D3",
                                    color: isCustomer ? "#000" : "#333",
                                    maxWidth: "70%",
                                    boxShadow: "0 1px 4px rgba(70,70,70,0.05)",
                                    wordBreak: 'break-word',
                                }}
                            >
                                {msg.type === "IMAGE" ? (
                                    // Render image content
                                    <img
                                        src={msg.content}
                                        alt="chat-img"
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: 300,
                                            borderRadius: 8,
                                            display: 'block',
                                        }}
                                    />
                                ) : (
                                    // Render text content (default/text)
                                    <Typography
                                        sx={{
                                            fontSize: "1rem",
                                            whiteSpace: "pre-line",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {msg.content}
                                    </Typography>
                                )}
                            </Box>
                            <Typography
                                sx={{
                                    fontSize: 11,
                                    color: "#999",
                                    mt: 0.5,
                                    mr: isCustomer ? 0 : 2,
                                    ml: isCustomer ? 2 : 0,
                                }}
                            >
                                {msg.from !== "admin" ? "You" : "Admin"}{" "}
                                {msg.createdAt
                                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : ""}
                            </Typography>
                        </Box>
                    );
                })}
                <div ref={chatBottomRef} />
            </Box>

            {/* Input Box */}
            <Box
                p={2}
                sx={{
                    borderTop: "1px solidrgb(52, 0, 209)",
                    display: "flex",
                    alignItems: "center",
                    background: "#fff",
                }}
            >
                {/* Image preview, if uploading */}
                {imagePreview && (
                    <Box
                        sx={{
                            mr: 2,
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <img src={imagePreview} alt="preview" style={{
                            height: 36,
                            width: 48,
                            objectFit: 'cover',
                            borderRadius: 6,
                            border: '1px solid #aaa',
                        }} />
                        <Button size="small" color="error" onClick={handleRemoveImage} sx={{
                            ml: 1,
                            minWidth: 0,
                            px: 1,
                            fontSize: 11,
                            fontWeight: 700,
                            lineHeight: 1.2,
                            textTransform: 'none',
                        }}>
                            Remove
                        </Button>
                    </Box>
                )}

                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Type your message…"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage();
                    }}
                    disabled={!connected || loading || Boolean(imageFile)}
                    sx={{ mr: 1 }}
                />
                {/* Image upload button */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                    disabled={!connected || loading}
                    data-testid="chat-image-input"
                />
                <Tooltip title="Attach image">
                    <span>
                        <IconButton
                            color={imageFile ? "secondary" : "primary"}
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            disabled={!connected || loading}
                            component="span"
                            sx={{
                                ml: 0,
                                mr: 1,
                                ...(imageFile && { bgcolor: "#f8e1ff" }),
                            }}
                        >
                            <PhotoCamera />
                        </IconButton>
                    </span>
                </Tooltip>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ minWidth: 78 }}
                    onClick={sendMessage}
                    disabled={
                        !connected ||
                        loading ||
                        (!messageInput.trim() && !imageFile)
                    }
                >
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default Chat;