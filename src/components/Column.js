import React, { useRef, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { VariableSizeList as List } from "react-window";
import TicketCard from "./TicketCard";

function Column({ status, tickets, updateTicketStatus }) {
    const listRef = useRef();
    const containerRef = useRef();
    const itemSizeMap = useRef({});
    const [listHeight, setListHeight] = useState(0);

    const getItemSize = (index) => {
        return itemSizeMap.current[index] || 180;
    };

    const setItemSize = (index, size) => {
        itemSizeMap.current[index] = size;
        if (listRef.current) {
            listRef.current.resetAfterIndex(index);
        }
    };

    const Row = ({ index, style }) => (
        <div style={{ ...style, padding: "8px", boxSizing: "border-box" }}>
            <TicketCard
                ticket={tickets[index]}
                setItemSize={(size) => setItemSize(index, size)}
                updateTicketStatus={updateTicketStatus}
            />
        </div>
    );

    useEffect(() => {
        function updateHeight() {
            if (containerRef.current) {
                const headerHeight =
                    containerRef.current.querySelector("h6").clientHeight;
                const height =
                    containerRef.current.clientHeight - headerHeight - 16;
                setListHeight(height);
            }
        }
        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    return (
        <Box
            ref={containerRef}
            flex="1 1 0"
            display="flex"
            flexDirection="column"
            marginRight={2}
            minWidth={0}
            overflow="hidden"
        >
            <Typography variant="h6" align="center" gutterBottom>
                {status} ({tickets.length})
            </Typography>
            <Box flexGrow={1} overflow="hidden">
                {listHeight > 0 && (
                    <List
                        height={listHeight}
                        itemCount={tickets.length}
                        itemSize={getItemSize}
                        width="100%"
                        ref={listRef}
                    >
                        {Row}
                    </List>
                )}
            </Box>
        </Box>
    );
}

export default Column;
