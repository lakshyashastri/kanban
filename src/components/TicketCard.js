import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    CardContent,
    Typography,
    Button,
    ButtonGroup,
    Snackbar,
    Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { canTransition, allowedTransitions } from "../utils/fsa";

function TicketCard({ ticket, setItemSize, updateTicketStatus }) {
    const [expanded, setExpanded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const cardRef = useRef();

    const handleToggleExpand = () => {
        setExpanded((prev) => !prev);
    };

    useEffect(() => {
        if (cardRef.current) {
            setItemSize(cardRef.current.offsetHeight);
        }
    }, [expanded, setItemSize]);

    const nextStatuses = allowedTransitions[ticket.status] || [];

    const handleStatusChange = (newStatus) => {
        if (canTransition(ticket.status, newStatus)) {
            updateTicketStatus(ticket.ticketId, newStatus);
        } else {
            setErrorMessage(
                `Cannot move from ${ticket.status} to ${newStatus}`
            );
        }
    };

    const handleCloseSnackbar = () => {
        setErrorMessage("");
    };

    return (
        <>
            <motion.div
                layout
                ref={cardRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
            >
                <Card variant="outlined" sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Typography
                            variant="caption"
                            color="textSecondary"
                            align="right"
                            gutterBottom
                        >
                            ID: {ticket.ticketId}
                        </Typography>
                        <Typography variant="h6" component="div">
                            {ticket.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{
                                overflow: expanded ? "visible" : "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: expanded ? "none" : 2,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {ticket.description}
                        </Typography>
                        <Button size="small" onClick={handleToggleExpand}>
                            {expanded ? "Show Less" : "Show More"}
                        </Button>
                        {nextStatuses.length > 0 && (
                            <ButtonGroup
                                size="small"
                                variant="text"
                                sx={{ marginTop: 1 }}
                            >
                                {nextStatuses.map((status) => (
                                    <Button
                                        key={status}
                                        onClick={() =>
                                            handleStatusChange(status)
                                        }
                                    >
                                        Move to {status}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
            {errorMessage && (
                <Snackbar
                    open={Boolean(errorMessage)}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity="error">
                        {errorMessage}
                    </Alert>
                </Snackbar>
            )}
        </>
    );
}

export default TicketCard;
