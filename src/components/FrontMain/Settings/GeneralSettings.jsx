import { Box, Typography, List, ListItem, ListItemText, Divider, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useAppContext } from "../../../context/AppContext";
import { useState, useEffect } from "react";
import axios from "axios";

export default function GeneralSettings() {
  const navigate = useNavigate();
  const { theme } = useAppContext();
  const [userId, setUserId] = useState("");
  const [isFundPasswordSet, setIsFundPasswordSet] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/customer/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setUserId(response.data.data.loginId);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

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

        setIsFundPasswordSet(response.data.isSet);
      } catch (error) {
        console.error("Error checking fund password status:", error);
      }
    };

    fetchProfile();
    checkFundPasswordStatus();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const handleLanguageChange = () => {
    // Implement language change functionality
    console.log("Language change clicked");
  };

  const handleFundPasswordClick = () => {
    if (isFundPasswordSet) {
      navigate("/modify-fund-password");
    } else {
      navigate("/set-fund-password");
    }
  };

  return (
    <Box sx={{ padding: 2, background: theme === "dark" ? "#1e1e1e" : "#f5f5f5" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1, fontWeight: "bold" }}>
          Settings
        </Typography>
      </Box>

      <List sx={{ bgcolor: theme === "dark" ? "#2c2c2c" : "white", borderRadius: 1 }}>
        <ListItem>
          <ListItemText
            primary="ID"
            sx={{ color: theme === "dark" ? "#aaa" : "#666" }}
          />
          <Typography sx={{ color: theme === "dark" ? "white" : "#333" }}>
            {userId}
          </Typography>
        </ListItem>
        <Divider sx={{ background: theme === "dark" ? "#555" : "#eee" }} />

        <ListItem>
          <ListItemText
            primary="Login password"
            sx={{ color: theme === "dark" ? "#aaa" : "#666" }}
          />
          <IconButton edge="end" size="small" onClick={() => navigate("/change-password")}>
            <ArrowForwardIosIcon sx={{ fontSize: "0.9rem" }} />
          </IconButton>
        </ListItem>
        <Divider sx={{ background: theme === "dark" ? "#555" : "#eee" }} />

        <ListItem button onClick={handleFundPasswordClick}>
          <ListItemText
            primary="Funding Password"
            sx={{ color: theme === "dark" ? "#aaa" : "#666" }}
          />
          <IconButton edge="end" size="small">
            <ArrowForwardIosIcon sx={{ fontSize: "0.9rem" }} />
          </IconButton>
        </ListItem>
        <Divider sx={{ background: theme === "dark" ? "#555" : "#eee" }} />

        <ListItem button onClick={handleLanguageChange}>
          <ListItemText
            primary="Choose a language"
            sx={{ color: theme === "dark" ? "#aaa" : "#666" }}
          />
          <Typography sx={{ color: theme === "dark" ? "#aaa" : "#999", mr: 1 }}>
            Language change
          </Typography>
          <IconButton edge="end" size="small">
            <ArrowForwardIosIcon sx={{ fontSize: "0.9rem" }} />
          </IconButton>
        </ListItem>
        <Divider sx={{ background: theme === "dark" ? "#555" : "#eee" }} />

        <ListItem button onClick={() => navigate("/help")}>
          <ListItemText
            primary="Help Center"
            sx={{ color: theme === "dark" ? "#aaa" : "#666" }}
          />
          <IconButton edge="end" size="small">
            <ArrowForwardIosIcon sx={{ fontSize: "0.9rem" }} />
          </IconButton>
        </ListItem>
      </List>

      <Box sx={{ mt: 4 }}>
        <Box
          onClick={handleSignOut}
          sx={{
            bgcolor: "#3f51b5",
            color: "white",
            py: 2,
            borderRadius: 1,
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <Typography>Sign out</Typography>
        </Box>
      </Box>
    </Box>
  );
} 