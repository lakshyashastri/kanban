import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import Header from "./components/Header";
import KanbanBoard from "./components/KanbanBoard";

function App() {
    const [ticketData, setTicketData] = useState([]);
    const [liveMode, setLiveMode] = useState(false);

    useEffect(() => {
        fetch("/tickets.csv")
            .then((response) => response.text())
            .then((csvData) => {
                Papa.parse(csvData, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        setTicketData(results.data);
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

    const ticketCounts = ticketData.reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
    }, {});

    const updateTicketStatus = (ticketId, newStatus) => {
        setTicketData((prevTickets) =>
            prevTickets.map((ticket) =>
                ticket.ticketId === ticketId
                    ? { ...ticket, status: newStatus }
                    : ticket
            )
        );
    };

    return (
        <div>
            <Header
                liveMode={liveMode}
                handleLiveModeToggle={handleLiveModeToggle}
                ticketCounts={ticketCounts}
            />
            <KanbanBoard
                tickets={ticketData}
                updateTicketStatus={updateTicketStatus}
            />
        </div>
    );
}

export default App;
