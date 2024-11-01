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
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { canTransition, allowedTransitions } from "../utils/fsa";

function TicketCard({ ticket, setItemSize, updateTicketStatus }) {
    const [expanded, setExpanded] = useState(false); // controls description expansion
    const [errorMessage, setErrorMessage] = useState(""); // error message for invalid transitions
    const [isOverflowing, setIsOverflowing] = useState(false); // checks if description overflows (for click to show more)
    const cardRef = useRef(); // ref to the card for size calculation
    const descRef = useRef(); // ref to the description text
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleToggleExpand = () => {
        if (isOverflowing) {
            setExpanded((prev) => !prev); // toggle expanded state of ticket card (show more)
        }
    };

    useEffect(() => {
        if (cardRef.current) {
            setItemSize(cardRef.current.offsetHeight + 8); // update item size
        }
    }, [expanded, setItemSize]);

    useEffect(() => {
        if (descRef.current) {
            const { scrollHeight, clientHeight } = descRef.current;
            setIsOverflowing(scrollHeight > clientHeight); // check if text is overflowing
        }
    }, [ticket.description]);

    const nextStatuses = allowedTransitions[ticket.status] || []; // possible next statuses

    const handleStatusChange = (newStatus) => {
        if (canTransition(ticket.status, newStatus)) {
            updateTicketStatus(ticket.ticketId, newStatus, ticket.status); // update status if allowed
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
                ref={cardRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ marginBottom: "8px" }}
            >
                <Card
                    variant="outlined"
                    sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        border: "1px solid #eeeeee",
                        padding: isMobile ? 1 : 2,
                        overflow: "hidden",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                            transform: "scale(1.01)",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        },
                    }}
                >
                    <CardContent sx={{ padding: "0 !important" }}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            flexDirection={isMobile ? "column" : "row"}
                        >
                            <Typography
                                variant="caption"
                                color="textSecondary"
                                align="left"
                                gutterBottom
                                sx={{ fontSize: "0.75rem", color: "#999999" }}
                            >
                                Status: {ticket.status}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="textSecondary"
                                align="right"
                                gutterBottom
                                sx={{
                                    fontSize: "0.75rem",
                                    color: "#999999",
                                    marginLeft: isMobile ? 0 : "auto",
                                }}
                            >
                                ID: {ticket.ticketId}
                            </Typography>
                        </Box>
                        <Typography
                            variant={isMobile ? "subtitle1" : "h6"}
                            component="div"
                            sx={{
                                fontSize: isMobile ? "1rem" : "1.25rem",
                                fontWeight: 700,
                                color: "#333333",
                            }}
                        >
                            {ticket.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: expanded ? "block" : "-webkit-box",
                                WebkitLineClamp: expanded ? "none" : 2,
                                WebkitBoxOrient: "vertical",
                                cursor: isOverflowing ? "pointer" : "default",
                                color: "#666666",
                            }}
                            ref={descRef}
                            onClick={handleToggleExpand}
                        >
                            {ticket.description}
                            {isOverflowing && !expanded && (
                                <Box
                                    component="span"
                                    sx={{
                                        color: theme.palette.primary.main,
                                        marginLeft: 0.5,
                                    }}
                                >
                                    {"... Show More"}
                                </Box>
                            )}
                            {isOverflowing && expanded && (
                                <Box
                                    component="span"
                                    sx={{
                                        color: theme.palette.primary.main,
                                        marginLeft: 0.5,
                                    }}
                                >
                                    {" Show Less"}
                                </Box>
                            )}
                        </Typography>
                        {nextStatuses.length > 0 && (
                            <ButtonGroup
                                size={isMobile ? "small" : "medium"}
                                variant="outlined"
                                sx={{ marginTop: 1 }}
                            >
                                {nextStatuses.map((status) => (
                                    <Button
                                        key={status}
                                        onClick={() =>
                                            handleStatusChange(status)
                                        }
                                        sx={{
                                            textTransform: "none",
                                            borderColor: "#cccccc",
                                            color: "#333333",
                                            "&:hover": {
                                                borderColor:
                                                    theme.palette.primary.main,
                                                color: theme.palette.primary
                                                    .main,
                                            },
                                        }}
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
