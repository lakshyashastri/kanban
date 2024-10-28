export const allowedTransitions = {
    "To Do": ["In Progress"],
    "In Progress": ["Blocked", "Done"],
    Blocked: ["In Progress"],
    Done: [], // no transitions from "done"
};

export function canTransition(currentStatus, newStatus) {
    const possibleTransitions = allowedTransitions[currentStatus] || [];
    return possibleTransitions.includes(newStatus); // check if transition is allowed
}
