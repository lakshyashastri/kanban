import { useEffect, useRef } from "react";
import { allowedTransitions } from "../utils/fsa";

function useFakeTicketTransition(tickets, updateTicketStatus, isLiveMode) {
    const intervalRef = useRef(null); // ref to store interval ID

    useEffect(() => {
        if (isLiveMode) {
            intervalRef.current = setInterval(() => {
                if (tickets.length === 0) return; // no tickets to update

                const randomTicket =
                    tickets[Math.floor(Math.random() * tickets.length)]; // pick a random ticket

                const possibleTransitions =
                    allowedTransitions[randomTicket.status];

                if (possibleTransitions && possibleTransitions.length > 0) {
                    const newStatus =
                        possibleTransitions[
                            Math.floor(
                                Math.random() * possibleTransitions.length
                            )
                        ]; // pick a new VALID status randomly

                    updateTicketStatus(
                        randomTicket.ticketId,
                        newStatus,
                        randomTicket.status
                    ); // update the ticket status
                }
            }, 1000); // run every second

            return () => {
                clearInterval(intervalRef.current); // cleanup on unmount or mode change
            };
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current); // stop interval if not live mode
            }
        }
    }, [isLiveMode, tickets, updateTicketStatus]);
}

export default useFakeTicketTransition;
