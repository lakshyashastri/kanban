import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Switch,
    FormControlLabel,
    Box,
} from "@mui/material";

function Header({ liveMode, handleLiveModeToggle, ticketCounts }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Kanban Dashboard
                </Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={liveMode}
                            onChange={handleLiveModeToggle}
                            color="error"
                        />
                    }
                    label="Live Mode"
                />
                <Box sx={{ marginLeft: 2 }}>
                    {Object.entries(ticketCounts).map(([status, count]) => (
                        <Typography variant="body2" key={status}>
                            {status}: {count}
                        </Typography>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
