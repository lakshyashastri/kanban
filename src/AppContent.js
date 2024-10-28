import React, { useEffect, useState, useCallback, useMemo } from "react";
import Papa from "papaparse";
import Header from "./components/Header";
import KanbanBoard from "./components/KanbanBoard";
import useFakeTicketTransition from "./hooks/useFakeTicketTransition";
import { useSnackbar } from "notistack";

function AppContent() {
    const [ticketCounts, setTicketCounts] = useState({}); // count of tickets per status
    const [ticketsByStatus, setTicketsByStatus] = useState({
        allTickets: {},
        loadedTickets: {},
    }); // all and loaded tickets
    const [liveMode, setLiveMode] = useState(false); // live mode toggle
    const [searchTerm, setSearchTerm] = useState(""); // search input
    const { enqueueSnackbar } = useSnackbar(); // for notifications

    const statuses = ["To Do", "In Progress", "Blocked", "Done"];
    const TICKETS_PER_LOAD = 20; // how many tickets to load each time

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
                setTicketCounts(counts); // set counts after parsing

                const initialTickets = {};
                statuses.forEach((status) => {
                    initialTickets[status] = ticketsTemp[status].slice(
                        0,
                        TICKETS_PER_LOAD
                    ); // load initial tickets
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
            ); // get more tickets

            return {
                allTickets: prevState.allTickets,
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
                    updatedAllTickets[newStatus].unshift(movedTicket); // move to new status
                }

                const ticketIndexLoaded = updatedLoadedTickets[
                    prevStatus
                ].findIndex((ticket) => ticket.ticketId === ticketId);
                if (ticketIndexLoaded > -1) {
                    const [movedTicket] = updatedLoadedTickets[
                        prevStatus
                    ].splice(ticketIndexLoaded, 1);
                    movedTicket.status = newStatus;
                    updatedLoadedTickets[newStatus].unshift(movedTicket); // move in loaded tickets
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
            })); // update counts

            enqueueSnackbar(
                `ticket ${ticketId} moved from ${prevStatus} to ${newStatus}`,
                {
                    variant: "success",
                }
            ); // toast notif
        },
        [enqueueSnackbar]
    );

    const addTicket = useCallback(
        (status, title, description) => {
            // gen new ticket id
            let newTicketId;
            do {
                newTicketId = Math.floor(10000 + Math.random() * 90000);
            } while (
                Object.values(ticketsByStatus.allTickets).some((tickets) =>
                    tickets.some((ticket) => ticket.ticketId === newTicketId)
                )
            );

            const newTicket = {
                ticketId: `TICKET-${newTicketId}`,
                title,
                description,
                status,
            };

            setTicketsByStatus((prevState) => {
                const updatedAllTickets = { ...prevState.allTickets };
                const updatedLoadedTickets = { ...prevState.loadedTickets };

                updatedAllTickets[status].unshift(newTicket); // add to all tickets
                updatedLoadedTickets[status].unshift(newTicket); // add to loaded tickets

                return {
                    allTickets: updatedAllTickets,
                    loadedTickets: updatedLoadedTickets,
                };
            });

            setTicketCounts((prevCounts) => ({
                ...prevCounts,
                [status]: prevCounts[status] + 1,
            })); // update counts

            enqueueSnackbar(
                `ticket ${status}: ${newTicketId} added successfully!`,
                {
                    variant: "success",
                }
            ); // notify user
        },
        [enqueueSnackbar, ticketsByStatus.allTickets]
    );

    const handleLiveModeToggle = () => {
        setLiveMode((prev) => !prev); // toggle live mode
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
                ); // filter tickets based on search input
            });
        } else {
            statuses.forEach((status) => {
                result[status] = loadedTickets[status] || []; // show loaded tickets
            });
        }
        return result;
    }, [ticketsByStatus, searchTerm]);

    useFakeTicketTransition(
        Object.values(ticketsByStatus.loadedTickets || {}).flat(),
        updateTicketStatus,
        liveMode
    ); // handle live updates

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
                addTicket={addTicket}
            />
        </>
    );
}

export default AppContent;
