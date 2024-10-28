import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    CardContent,
    Typography,
    Button,
    ButtonGroup,
    Snackbar,
    Alert,
    Box,
} from "@mui/material";
import { motion } from "framer-motion";
import { canTransition, allowedTransitions } from "../utils/fsa";

function TicketCard({ ticket, setItemSize, updateTicketStatus }) {
    const [expanded, setExpanded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isOverflowing, setIsOverflowing] = useState(false);
    const cardRef = useRef();
    const descRef = useRef();

    const handleToggleExpand = () => {
        setExpanded((prev) => !prev);
    };

    useEffect(() => {
        if (cardRef.current) {
            setItemSize(cardRef.current.offsetHeight);
        }
    }, [expanded, setItemSize]);

    useEffect(() => {
        if (descRef.current) {
            const { scrollHeight, clientHeight } = descRef.current;
            setIsOverflowing(scrollHeight > clientHeight);
        }
    }, [ticket.description]);

    const nextStatuses = allowedTransitions[ticket.status] || [];

    const handleStatusChange = (newStatus) => {
        if (canTransition(ticket.status, newStatus)) {
            updateTicketStatus(ticket.ticketId, newStatus, ticket.status);
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
                <Card
                    variant="outlined"
                    sx={{
                        marginBottom: 2,
                        backgroundColor: "#f9f9f9",
                        border: "1px solid #ddd",
                    }}
                >
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography
                                variant="caption"
                                color="textSecondary"
                                align="left"
                                gutterBottom
                            >
                                Status: {ticket.status}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="textSecondary"
                                align="right"
                                gutterBottom
                            >
                                ID: {ticket.ticketId}
                            </Typography>
                        </Box>
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
                            ref={descRef}
                        >
                            {ticket.description}
                        </Typography>
                        {isOverflowing && (
                            <Button size="small" onClick={handleToggleExpand}>
                                {expanded ? "Show Less" : "Show More"}
                            </Button>
                        )}
                        {nextStatuses.length > 0 && (
                            <ButtonGroup
                                size="small"
                                variant="outlined"
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

export default React.memo(TicketCard);
