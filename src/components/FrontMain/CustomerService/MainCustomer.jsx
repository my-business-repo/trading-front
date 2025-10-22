import { Container, useTheme } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const getPrimaryColor = (theme) => theme?.palette?.primary?.main || "#1976d2";

const services = (primaryColor, navigate) => [
    {
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width="34"
                height="34"
                viewBox="0 0 34 34"
                style={{ display: "block", margin: "0 auto" }}
            >
                <circle cx="17" cy="17" r="17" fill={primaryColor} />
                <g>
                    <path
                        d="M24.5 22c0 .276-.224.5-.5.5h-2c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h1.5V17c0-3.033-2.467-5.5-5.5-5.5s-5.5 2.467-5.5 5.5v4.5H13c.276 0 .5.224.5.5s-.224.5-.5.5h-2a.5.5 0 0 1-.5-.5V17c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5v5z"
                        fill="#fff"
                    />
                    <path
                        d="M20.5 21a.5.5 0 0 1 .5.5c0 1.657-1.343 3-3 3s-3-1.343-3-3a.5.5 0 0 1 1 0c0 1.105.895 2 2 2s2-.895 2-2a.5.5 0 0 1 .5-.5z"
                        fill="#fff"
                    />
                </g>
            </svg>
        ),
        title: "Online Customer Service",
        desc: "Mon-Sun open: 7:00-20:00",
        // Instead of a tel: link, provide a handler that navigates to /online/help/chatting
        onAction: () => navigate("/online/help/chatting"),
        actionLabel: "Message now",
    },
    {
        icon: (
            // Telegram SVG icon (replaces viber)
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="34"
                viewBox="0 0 34 34"
                style={{ display: "block", margin: "0 auto" }}
            >
                <circle cx="17" cy="17" r="17" fill={primaryColor} />
                <g>
                    <path
                        d="M24.777 11.322c.251-.903-.225-1.257-1.034-.99L9.586 15.792c-.889.271-.899.812-.157 1.016l3.364.93 7.826-4.952c.368-.242.704-.107.428.153l-6.338 5.744-.24 3.374c.348 0 .501-.159.695-.35l1.669-1.625 3.469 2.552c.637.353 1.099.17 1.257-.591l2.073-10.721z"
                        fill="#229ED9"
                    />
                </g>
            </svg>
        ),
        title: "Live service",
        desc: "Mon-Sun open: 8:00-19:00",
        link: "https://t.me/Coinex6633", // Telegram link
        actionLabel: "Go to Telegram",
    },
];

const MainCustomer = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const theme = useTheme();
    const primaryColor = getPrimaryColor(theme);

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            {/* Back arrow and Service Title */}
            <div style={{ padding: 24, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <button
                    style={{
                        border: "none",
                        background: "none",
                        position: "absolute",
                        left: 24,
                        top: 24,
                        cursor: "pointer",
                        padding: 0,
                    }}
                    aria-label="back"
                    onClick={() => window.history.back()}
                >
                    {/* Simple left arrow */}
                    <svg width="28" height="28" viewBox="0 0 24 24">
                        <path d="M15.5 19l-7-7 7-7" fill="none" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <span style={{ fontWeight: 600, fontSize: 20, color: primaryColor }}>Customer Service</span>
            </div>

            {/* Service Cards */}
            <div style={{ maxWidth: 500, margin: "0 auto", padding: "24px 8px" }}>
                {services(primaryColor, navigate).map((service, idx) => (
                    <div
                        key={service.title}
                        style={{
                            border: "1px solid #ececec",
                            borderRadius: 16,
                            background: "#f8f8f8",
                            padding: 24,
                            marginBottom: 24,
                            textAlign: "center",
                            boxShadow: "0 2px 8px 0 rgba(60, 60, 60, 0.06)",
                            maxWidth: 400,
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        <div>{service.icon}</div>
                        <div style={{ fontWeight: 600, fontSize: 18, marginTop: 10, marginBottom: 6, color: primaryColor }}>
                            {service.title}
                        </div>
                        <div style={{ fontSize: 15, color: "#666", marginBottom: 14 }}>
                            {service.desc}
                        </div>
                        <a
                            onClick={service.onAction}
                            href={service.link}
                            target={service.title === "Live service" ? "_blank" : undefined}
                            rel={service.title === "Live service" ? "noopener noreferrer" : undefined}
                            style={{
                                display: "inline-block",
                                background: primaryColor,
                                color: "#fff",
                                padding: "10px 28px",
                                borderRadius: 32,
                                fontWeight: 500,
                                fontSize: 15,
                                textDecoration: "none",
                                transition: "background 0.18s",
                                marginTop: 8,
                            }}
                        >
                            {service.actionLabel}
                        </a>
                    </div>
                ))}
            </div>
        </Container>
    );
};

export default MainCustomer;
