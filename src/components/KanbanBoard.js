import React, { useMemo } from "react";
import { Box } from "@mui/material";
import Column from "./Column";

function KanbanBoard({ tickets, updateTicketStatus }) {
    const statuses = ["To Do", "In Progress", "Blocked", "Done"];

    const ticketsByStatus = useMemo(() => {
        return statuses.reduce((acc, status) => {
            acc[status] = tickets.filter((ticket) => ticket.status === status);
            return acc;
        }, {});
    }, [tickets]);

    return (
        <Box
            display="flex"
            padding={2}
            height={`calc(100vh - 64px)`}
            overflow="hidden"
        >
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

export default React.memo(KanbanBoard);
