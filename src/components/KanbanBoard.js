import React, { useMemo } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Column from "./Column";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function KanbanBoard({ tickets, updateTicketStatus, searchTerm }) {
    const statuses = ["To Do", "In Progress", "Blocked", "Done"];
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const filteredTickets = useMemo(() => {
        if (!searchTerm.trim()) return tickets;
        const lowercasedTerm = searchTerm.toLowerCase();
        return tickets.filter(
            (ticket) =>
                ticket.title.toLowerCase().includes(lowercasedTerm) ||
                ticket.description.toLowerCase().includes(lowercasedTerm) ||
                ticket.ticketId.toString().includes(lowercasedTerm)
        );
    }, [tickets, searchTerm]);

    const ticketsByStatus = useMemo(() => {
        return statuses.reduce((acc, status) => {
            acc[status] = filteredTickets.filter(
                (ticket) => ticket.status === status
            );
            return acc;
        }, {});
    }, [filteredTickets, statuses]);

    return (
        <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            padding={2}
            height={`calc(100vh - 64px)`}
            overflow="auto"
        >
            {isMobile
                ? statuses.map((status) => (
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
                                      <strong>{status}</strong> (
                                      {ticketsByStatus[status].length})
                                  </Box>
                              </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                              <Column
                                  status={status}
                                  tickets={ticketsByStatus[status]}
                                  updateTicketStatus={updateTicketStatus}
                              />
                          </AccordionDetails>
                      </Accordion>
                  ))
                : statuses.map((status) => (
                      <Column
                          key={status}
                          status={status}
                          tickets={ticketsByStatus[status]}
                          updateTicketStatus={updateTicketStatus}
                      />
                  ))}
        </Box>
    );
}

export default React.memo(KanbanBoard);
