import React, { useRef, useEffect, useState, useCallback } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { VariableSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import TicketCard from "./TicketCard";

function Column({
    status,
    tickets,
    updateTicketStatus,
    loadMoreTickets,
    hasMore,
    totalCount,
    isSearching,
}) {
    const listRef = useRef();
    const containerRef = useRef();
    const itemSizeMap = useRef({});
    const [listHeight, setListHeight] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const getItemSize = useCallback((index) => {
        return itemSizeMap.current[index] || 220;
    }, []);

    const setItemSize = useCallback((index, size) => {
        itemSizeMap.current[index] = size;
        if (listRef.current) {
            listRef.current.resetAfterIndex(index);
        }
    }, []);

    const Row = React.memo(({ index, style, data }) => {
        const ticket = data[index];
        if (!ticket) {
            return (
                <div style={style}>
                    <div style={{ padding: "16px", textAlign: "center" }}>
                        Loading...
                    </div>
                </div>
            );
        }
        return (
            <div style={style}>
                <TicketCard
                    ticket={ticket}
                    setItemSize={(size) => setItemSize(index, size)}
                    updateTicketStatus={updateTicketStatus}
                />
            </div>
        );
    });

    const isItemLoaded = useCallback(
        (index) => !hasMore || index < tickets.length,
        [hasMore, tickets.length]
    );

    const loadMoreItems = useCallback(() => {
        if (hasMore) {
            loadMoreTickets(status);
        }
    }, [hasMore, loadMoreTickets, status]);

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
            marginRight={isMobile ? 0 : 2}
            marginBottom={isMobile ? 2 : 0}
            minWidth={0}
            overflow="hidden"
            sx={{
                backgroundColor: "#f5f5f5",
                borderRight: "1px solid #e0e0e0",
                "&:last-child": {
                    borderRight: "none",
                },
                "&:hover": {
                    boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
                },
            }}
        >
            <Typography
                variant="h6"
                align="center"
                gutterBottom
                sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    borderBottom: "1px solid #e0e0e0",
                    padding: "8px 0",
                }}
            >
                {status} ({tickets.length} loaded)
            </Typography>
            <Box
                flexGrow={1}
                overflow="auto"
                sx={{
                    overflowX: "hidden",
                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#cccccc",
                        borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: "#f0f0f0",
                    },
                }}
            >
                {listHeight > 0 && (
                    <InfiniteLoader
                        isItemLoaded={isItemLoaded}
                        itemCount={
                            hasMore ? tickets.length + 1 : tickets.length
                        }
                        loadMoreItems={loadMoreItems}
                    >
                        {({ onItemsRendered, ref }) => (
                            <List
                                height={listHeight}
                                itemCount={tickets.length}
                                itemSize={getItemSize}
                                width="100%"
                                ref={(list) => {
                                    listRef.current = list;
                                    ref(list);
                                }}
                                itemData={tickets}
                                onItemsRendered={onItemsRendered}
                                style={{ overflowX: "hidden" }}
                            >
                                {Row}
                            </List>
                        )}
                    </InfiniteLoader>
                )}
            </Box>
        </Box>
    );
}

export default React.memo(Column);
