import React, { useEffect, useState, useCallback, useMemo } from "react";
import Papa from "papaparse";
import Header from "./components/Header";
import KanbanBoard from "./components/KanbanBoard";
import useFakeTicketTransition from "./hooks/useFakeTicketTransition";
import { useSnackbar } from "notistack";

function AppContent() {
    const [ticketCounts, setTicketCounts] = useState({});
    const [ticketsByStatus, setTicketsByStatus] = useState({
        allTickets: {},
        loadedTickets: {},
    });
    const [liveMode, setLiveMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { enqueueSnackbar } = useSnackbar();

    const statuses = ["To Do", "In Progress", "Blocked", "Done"];
    const TICKETS_PER_LOAD = 20;

    useEffect(() => {
        const counts = {};
        const ticketsTemp = {};
        statuses.forEach((status) => {
            counts[status] = 0;
            ticketsTemp[status] = [];
        });

        Papa.parse("/tickets.csv", {
            download: true,
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            chunk: (results) => {
                results.data.forEach((ticket) => {
                    if (statuses.includes(ticket.status)) {
                        counts[ticket.status] += 1;
                        ticketsTemp[ticket.status].push(ticket);
                    }
                });
            },
            complete: () => {
                setTicketCounts(counts);

                const initialTickets = {};
                statuses.forEach((status) => {
                    initialTickets[status] = ticketsTemp[status].slice(
                        0,
                        TICKETS_PER_LOAD
                    );
                });
                setTicketsByStatus({
                    allTickets: ticketsTemp,
                    loadedTickets: initialTickets,
                });
            },
            error: (err) => {
                console.error("Error parsing CSV file:", err);
            },
        });
    }, []);

    const loadMoreTickets = useCallback((status) => {
        setTicketsByStatus((prevState) => {
            const currentLoaded = prevState.loadedTickets[status]?.length || 0;
            const additionalTickets = prevState.allTickets[status]?.slice(
                currentLoaded,
                currentLoaded + TICKETS_PER_LOAD
            );

            return {
                ...prevState,
                loadedTickets: {
                    ...prevState.loadedTickets,
                    [status]: [
                        ...prevState.loadedTickets[status],
                        ...additionalTickets,
                    ],
                },
            };
        });
    }, []);

    const updateTicketStatus = useCallback(
        (ticketId, newStatus, prevStatus) => {
            setTicketsByStatus((prevState) => {
                const updatedAllTickets = { ...prevState.allTickets };
                const updatedLoadedTickets = { ...prevState.loadedTickets };

                const ticketIndexAll = updatedAllTickets[prevStatus].findIndex(
                    (ticket) => ticket.ticketId === ticketId
                );
                if (ticketIndexAll > -1) {
                    const [movedTicket] = updatedAllTickets[prevStatus].splice(
                        ticketIndexAll,
                        1
                    );
                    movedTicket.status = newStatus;
                    updatedAllTickets[newStatus].unshift(movedTicket);
                }

                const ticketIndexLoaded = updatedLoadedTickets[
                    prevStatus
                ].findIndex((ticket) => ticket.ticketId === ticketId);
                if (ticketIndexLoaded > -1) {
                    const [movedTicket] = updatedLoadedTickets[
                        prevStatus
                    ].splice(ticketIndexLoaded, 1);
                    movedTicket.status = newStatus;
                    updatedLoadedTickets[newStatus].unshift(movedTicket);
                }

                return {
                    allTickets: updatedAllTickets,
                    loadedTickets: updatedLoadedTickets,
                };
            });

            setTicketCounts((prevCounts) => ({
                ...prevCounts,
                [prevStatus]: prevCounts[prevStatus] - 1,
                [newStatus]: prevCounts[newStatus] + 1,
            }));

            enqueueSnackbar(
                `Ticket ${ticketId} moved from ${prevStatus} to ${newStatus}`,
                {
                    variant: "success",
                }
            );
        },
        [enqueueSnackbar]
    );

    const handleLiveModeToggle = () => {
        setLiveMode((prev) => !prev);
    };

    const displayedTicketsByStatus = useMemo(() => {
        const result = {};
        const { allTickets, loadedTickets } = ticketsByStatus;

        if (searchTerm.trim()) {
            const lowercasedTerm = searchTerm.toLowerCase();
            statuses.forEach((status) => {
                result[status] = allTickets[status]?.filter(
                    (ticket) =>
                        ticket.title.toLowerCase().includes(lowercasedTerm) ||
                        ticket.description
                            .toLowerCase()
                            .includes(lowercasedTerm) ||
                        ticket.ticketId.toString().includes(lowercasedTerm)
                );
            });
        } else {
            statuses.forEach((status) => {
                result[status] = loadedTickets[status] || [];
            });
        }
        return result;
    }, [ticketsByStatus, searchTerm]);

    useFakeTicketTransition(
        Object.values(ticketsByStatus.loadedTickets || {}).flat(),
        updateTicketStatus,
        liveMode
    );

    return (
        <>
            <Header
                liveMode={liveMode}
                handleLiveModeToggle={handleLiveModeToggle}
                ticketCounts={ticketCounts}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
            <KanbanBoard
                ticketsByStatus={displayedTicketsByStatus}
                updateTicketStatus={updateTicketStatus}
                searchTerm={searchTerm}
                loadMoreTickets={loadMoreTickets}
                totalTicketCounts={ticketCounts}
            />
        </>
    );
}

export default AppContent;
