import React from "react";
import { SnackbarProvider } from "notistack";
import { ThemeProvider, CssBaseline } from "@mui/material";
import AppContent from "./AppContent";
import theme from "./theme";

function App() {
    return (
        <SnackbarProvider maxSnack={5}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppContent />
            </ThemeProvider>
        </SnackbarProvider>
    );
}

export default App;
