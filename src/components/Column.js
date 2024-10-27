import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";
import { VariableSizeList as List } from "react-window";
import TicketCard from "./TicketCard";

function Column({ status, tickets, updateTicketStatus }) {
    const listRef = useRef();
    const itemSizeMap = useRef({});

    const getItemSize = (index) => {
        return itemSizeMap.current[index] || 150; // default height
    };

    const setItemSize = (index, size) => {
        itemSizeMap.current = { ...itemSizeMap.current, [index]: size };
        listRef.current.resetAfterIndex(index);
    };

    const Row = ({ index, style }) => (
        <div style={{ ...style, padding: "8px" }}>
            <TicketCard
                ticket={tickets[index]}
                setItemSize={(size) => setItemSize(index, size)}
                updateTicketStatus={updateTicketStatus}
            />
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
                    itemSize={getItemSize}
                    width="100%"
                    ref={listRef}
                >
                    {Row}
                </List>
            </Box>
        </Box>
    );
}

export default Column;
