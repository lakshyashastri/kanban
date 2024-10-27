import React from "react";
import { Box, Typography } from "@mui/material";
import { FixedSizeList as List } from "react-window";
import TicketCard from "./TicketCard";

function Column({ status, tickets }) {
    const Row = ({ index, style }) => (
        <div style={style}>
            <TicketCard ticket={tickets[index]} />
        </div>
    );

    return (
        <Box
            flex={1}
            display="flex"
            flexDirection="column"
            marginRight={2}
            minWidth={0}
        >
            <Typography variant="h6" align="center" gutterBottom>
                {status} ({tickets.length})
            </Typography>
            <Box flexGrow={1} overflow="hidden">
                <List
                    height={600}
                    itemCount={tickets.length}
                    itemSize={120}
                    width="100%"
                >
                    {Row}
                </List>
            </Box>
        </Box>
    );
}

export default Column;
