import React from "react";
import { Box } from "@mui/material";
import Column from "./Column";

function KanbanBoard({ tickets, updateTicketStatus }) {
    const statuses = ["To Do", "In Progress", "Blocked", "Done"];

    const ticketsByStatus = statuses.reduce((acc, status) => {
        acc[status] = tickets.filter((ticket) => ticket.status === status);
        return acc;
    }, {});

    return (
        <Box display="flex" padding={2} overflow="auto">
            {statuses.map((status) => (
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

export default KanbanBoard;
