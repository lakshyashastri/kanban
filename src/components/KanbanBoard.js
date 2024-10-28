import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Column from "./Column";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function KanbanBoard({
    ticketsByStatus,
    updateTicketStatus,
    searchTerm,
    loadMoreTickets,
    totalTicketCounts,
    addTicket,
}) {
    const statuses = ["To Do", "In Progress", "Blocked", "Done"];
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            padding={2}
            height={`calc(100vh - 64px)`}
            overflow="auto"
        >
            {statuses.map((status) => {
                const tickets = ticketsByStatus[status] || [];
                const totalCount = totalTicketCounts[status] || 0;
                const hasMore = !searchTerm && tickets.length < totalCount;

                return isMobile ? (
                    <Accordion key={status} defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${status}-content`}
                            id={`${status}-header`}
                        >
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                width="100%"
                            >
                                <Box>
                                    <strong>{status}</strong> ({tickets.length}{" "}
                                    / {totalCount})
                                </Box>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Column
                                status={status}
                                tickets={tickets}
                                updateTicketStatus={updateTicketStatus}
                                loadMoreTickets={loadMoreTickets}
                                hasMore={hasMore}
                                totalCount={totalCount}
                                isSearching={Boolean(searchTerm)}
                                addTicket={addTicket}
                            />
                        </AccordionDetails>
                    </Accordion>
                ) : (
                    <Column
                        key={status}
                        status={status}
                        tickets={tickets}
                        updateTicketStatus={updateTicketStatus}
                        loadMoreTickets={loadMoreTickets}
                        hasMore={hasMore}
                        totalCount={totalCount}
                        isSearching={Boolean(searchTerm)}
                        addTicket={addTicket}
                    />
                );
            })}
        </Box>
    );
}

export default React.memo(KanbanBoard);
