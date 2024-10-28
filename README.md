# Kanban Dashboard App: A Modern & Minimalist Design

## Overview

This Kanban Dashboard is a React application designed to help users manage tasks (tickets) across different statuses in a Kanban-style board. The app includes features such as:

-   Viewing and organizing tickets in columns based on their status.
-   Moving tickets between statuses according to defined transitions.
-   Adding new tickets to the board.
-   Searching for tickets by title, description, or ID.
-   Simulating live updates where tickets change status automatically.
-   Responsive design that adapts to both desktop and mobile devices.

## Components Breakdown

### 1. `App.js`

-   Serves as the root component of the application.
-   Wraps the app with `SnackbarProvider` for notifications.
-   Applies global theming using `ThemeProvider` and `CssBaseline`.
-   Renders the main content via `AppContent`.

### 2. `AppContent.js`

-   **Purpose**: Manages the main logic and state of the application.
-   **State Variables**:
    -   `ticketCounts`: Holds the total number of tickets per status.
    -   `ticketsByStatus`: Stores all tickets and currently loaded tickets, organized by status.
    -   `liveMode`: Boolean indicating if live mode is active.
    -   `searchTerm`: The current search query.
-   **Functions**:
    -   **Data Loading**: Uses `Papa.parse` to load tickets from a CSV file.
    -   `loadMoreTickets`: Loads additional tickets when the user scrolls to the end of a column.
    -   `updateTicketStatus`: Updates the status of a ticket and moves it between columns.
    -   `addTicket`: Adds a new ticket to the board.
    -   `handleLiveModeToggle`: Toggles the live mode simulation.
-   **Hooks**:
    -   `useFakeTicketTransition`: Simulates ticket status changes in live mode.
-   **Rendering**:
    -   Displays the `Header` and `KanbanBoard` components.
    -   Filters tickets based on the search term.

### 3. `Header.js`

-   **Purpose**: Displays the application header with controls for search and live mode.
-   **Components**:
    -   **Search Bar**: Allows users to search for tickets.
    -   **Live Mode Toggle**: Switch to enable or disable live mode.
    -   **Ticket Counts**: Shows the number of tickets per status with a flashing effect on change.

### 4. `KanbanBoard.js`

-   **Purpose**: Organizes the board into columns representing each ticket status.
-   **Features**:
    -   Dynamically generates columns for predefined statuses: `To Do`, `In Progress`, `Blocked`, and `Done`.
    -   Adjusts layout for mobile devices by using accordions.

### 5. `Column.js`

-   **Purpose**: Represents a single column in the Kanban board.
-   **Features**:
    -   **Ticket List**: Displays tickets using an infinite loader and virtualized list for performance optimization.
    -   **Add Ticket Modal**: Modal dialog to add new tickets to the column.
    -   **Dynamic Sizing**: Adjusts the size of list items based on content.
-   **Interactions**:
    -   Allows users to scroll to load more tickets.
    -   Users can open a modal to add new tickets.

### 6. `TicketCard.js`

-   **Purpose**: Displays individual ticket details and handles status transitions.
-   **Features**:

    -   **Display**: Shows ticket ID, title, status, and description.
    -   **Expandable Description**: Users can expand or collapse long descriptions.
    -   **Status Transition Buttons**: Buttons to move tickets to allowed next statuses.
    -   Shows error messages for invalid transitions via a snackbar.

### 7. `useFakeTicketTransition.js` (Custom Hook)

-   **Purpose**: Simulates automatic ticket status changes in live mode.
-   **Functionality**:
    -   Randomly selects tickets and changes their status at intervals.
    -   Ensures transitions are valid based on allowed transitions.
    -   Cleans up intervals when live mode is disabled.

### 8. `fsa.js` (Finite State Automaton Utility)

-   **Purpose**: Defines the allowed status transitions for tickets.
-   **Exports**:
    -   `allowedTransitions`: An object mapping each status to its possible next statuses.
    -   `canTransition`: A function that checks if a transition between statuses is allowed.

### 9. `FlashingCount.js` and `FlashingCount.css`

-   **Purpose**: Displays the ticket count with a flashing effect when the count changes.
-   **Features**:
    -   Flashes green when the count increases.
    -   Flashes red when the count decreases.
-   **Styling**:
    -   Uses CSS animations defined in `FlashingCount.css`.

## Additional Components and Utilities

### `theme.js`

-   **Purpose**: Customizes the Material-UI theme for consistent styling across the app.

### `tickets.csv`

-   **Purpose**: The data source containing all tickets loaded into the app, generated via `gendata.py`

## Key Features

### Infinite Scrolling

-   Utilizes `react-window` and `react-window-infinite-loader` to efficiently render large lists of tickets.
-   Loads more tickets as the user scrolls, improving performance.

### Live Mode Simulation

-   When enabled, tickets randomly change statuses to simulate a dynamic environment.

### Responsive Design

-   Adapts to different screen sizes using Material-UI's `useMediaQuery`.
-   On mobile devices, columns are displayed as accordions for better usability.

### Search Functionality

-   Users can search for tickets by title, description, or ID.
-   The search filters tickets across all statuses
    -   Searches are performed on all tickets, loaded and unloaded. Search results are loaded into the interface.

### Status Transition Validation

-   Only allows valid status transitions based on a finite state machine.

### Notifications

-   Provides real-time feedback using snackbars via the `notistack` library.
-   Displays success messages for actions like adding or moving tickets.

## Development Notes

-   **Performance Optimization**:

    -   Virtualized lists prevent performance issues with large datasets.
    -   Memoization (`React.memo`) reduces unnecessary re-renders.

-   **Extensibility**:

    -   The finite state machine (`allowedTransitions`) can be modified to add new statuses or transitions.
    -   Additional features can be integrated with minimal changes to the existing codebase.

-   **Error Handling**:
    -   The app includes adequate error handling for data parsing and user actions.
    -   Errors are communicated to the user through alerts and snackbars.

## Running the Application

To run the application locally:

1. **Install Dependencies**:
    ```bash
    npm install
    ```
2. **Start the Development Server**:
    ```bash
    npm start
    ```
3. **Access the App**:
    - Open your browser and navigate to `http://localhost:3000`.
