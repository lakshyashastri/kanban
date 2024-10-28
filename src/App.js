import React from "react";
import { SnackbarProvider } from "notistack";
import AppContent from "./AppContent";

function App() {
    return (
        <SnackbarProvider maxSnack={5}>
            <AppContent />
        </SnackbarProvider>
    );
}

export default App;
