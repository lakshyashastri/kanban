import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";

function TicketCard({ ticket }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            style={{ marginBottom: 8 }}
        >
            <Card variant="outlined">
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
                    <Typography variant="body2" color="textSecondary">
                        {ticket.description}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default TicketCard;
