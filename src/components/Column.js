import React, { useRef, useEffect, useState, useCallback } from "react";
import {
    Box,
    Typography,
    useTheme,
    useMediaQuery,
    IconButton,
    Modal,
    TextField,
    Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { VariableSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import TicketCard from "./TicketCard";
import { useSnackbar } from "notistack";

function Column({
    status,
    tickets,
    updateTicketStatus,
    loadMoreTickets,
    hasMore,
    totalCount,
    isSearching,
    addTicket,
}) {
    const listRef = useRef();
    const containerRef = useRef();
    const itemSizeMap = useRef({});
    const [listHeight, setListHeight] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [openModal, setOpenModal] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const { enqueueSnackbar } = useSnackbar();

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setNewTitle("");
        setNewDescription("");
    };

    const handleAddTicket = () => {
        if (!newTitle.trim() || !newDescription.trim()) {
            enqueueSnackbar("Title and Description are required.", {
                variant: "error",
            });
            return;
        }

        addTicket(status, newTitle.trim(), newDescription.trim());
        handleCloseModal();
    };

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

    const loadMoreItemsCallback = useCallback(() => {
        if (hasMore) {
            loadMoreTickets(status);
        }
    }, [hasMore, loadMoreTickets, status]);

    useEffect(() => {
        function updateHeight() {
            if (containerRef.current) {
                const headerHeight =
                    containerRef.current.querySelector("h6")?.clientHeight || 0;
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
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    borderBottom: "1px solid #e0e0e0",
                    padding: "8px 0",
                    position: "relative",
                }}
            >
                <Typography
                    variant="h6"
                    align="center"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                    }}
                >
                    {status} ({tickets.length} loaded)
                </Typography>
                <IconButton
                    aria-label="add ticket"
                    onClick={handleOpenModal}
                    size="small"
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: theme.palette.primary.main,
                    }}
                >
                    <AddIcon />
                </IconButton>
            </Box>
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
                        loadMoreItems={loadMoreItemsCallback}
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

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="add-ticket-modal-title"
                aria-describedby="add-ticket-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "8px",
                    }}
                >
                    <Typography
                        id="add-ticket-modal-title"
                        variant="h6"
                        component="h2"
                        gutterBottom
                    >
                        Add New Ticket
                    </Typography>
                    <TextField
                        fullWidth
                        label="Title"
                        variant="outlined"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        variant="outlined"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        marginTop={2}
                        gap={1}
                    >
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleAddTicket}
                        >
                            Add
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleCloseModal}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

export default React.memo(Column);
