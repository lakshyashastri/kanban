import { useEffect, useRef } from "react";
import { allowedTransitions } from "../utils/fsa";

function useFakeTicketTransition(tickets, updateTicketStatus, isLiveMode) {
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isLiveMode) {
            intervalRef.current = setInterval(() => {
                if (tickets.length === 0) return;

                const randomTicket =
                    tickets[Math.floor(Math.random() * tickets.length)];

                const possibleTransitions =
                    allowedTransitions[randomTicket.status];

                if (possibleTransitions && possibleTransitions.length > 0) {
                    const newStatus =
                        possibleTransitions[
                            Math.floor(
                                Math.random() * possibleTransitions.length
                            )
                        ];

                    updateTicketStatus(randomTicket.ticketId, newStatus);
                }
            }, 1000); // interval time

            return () => {
                clearInterval(intervalRef.current);
            };
        } else {
            // clear existing intervals if live mode is off
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, [isLiveMode, tickets, updateTicketStatus]);
}

export default useFakeTicketTransition;
