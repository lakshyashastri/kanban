import React, { useEffect, useState, useCallback } from "react";
import Papa from "papaparse";
import Header from "./components/Header";
import KanbanBoard from "./components/KanbanBoard";
import useFakeTicketTransition from "./hooks/useFakeTicketTransition";
import { useSnackbar } from "notistack";

function AppContent() {
    const [ticketData, setTicketData] = useState([]);
    const [liveMode, setLiveMode] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetch("/tickets.csv")
            .then((response) => response.text())
            .then((csvData) => {
                Papa.parse(csvData, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        setTicketData(results.data); // load all tickets at once for now
                    },
                });
            })
            .catch((error) => {
                console.error("Error fetching or parsing CSV file:", error);
            });
    }, []);

    const handleLiveModeToggle = () => {
        setLiveMode((prev) => !prev);
    };

    // Calculate ticket counts by status
    const ticketCounts = ticketData.reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
    }, {});

    const updateTicketStatus = useCallback(
        (ticketId, newStatus, prevStatus) => {
            setTicketData((prevTickets) =>
                prevTickets.map((ticket) =>
                    ticket.ticketId === ticketId
                        ? { ...ticket, status: newStatus }
                        : ticket
                )
            );
            enqueueSnackbar(
                `Ticket ${ticketId} moved from ${prevStatus} to ${newStatus}`,
                { variant: "info" }
            );
        },
        [enqueueSnackbar]
    );

    useFakeTicketTransition(ticketData, updateTicketStatus, liveMode);

    return (
        <>
            <Header
                liveMode={liveMode}
                handleLiveModeToggle={handleLiveModeToggle}
                ticketCounts={ticketCounts}
            />
            <KanbanBoard
                tickets={ticketData}
                updateTicketStatus={updateTicketStatus}
            />
        </>
    );
}

export default AppContent;
