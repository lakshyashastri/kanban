import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Switch,
    FormControlLabel,
    Box,
    TextField,
} from "@mui/material";

function Header({
    liveMode,
    handleLiveModeToggle,
    ticketCounts,
    searchTerm,
    setSearchTerm,
}) {
    return (
        <AppBar position="static">
            <Toolbar
                sx={{
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                }}
            >
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Kanban Dashboard
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        width: { xs: "100%", sm: "auto" },
                        marginTop: { xs: 2, sm: 0 },
                        marginRight: { sm: 2 },
                    }}
                >
                    <TextField
                        label="Search Tickets"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                    />
                </Box>
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
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        marginLeft: { sm: 2 },
                        marginTop: { xs: 2, sm: 0 },
                    }}
                >
                    {Object.entries(ticketCounts).map(([status, count]) => (
                        <Typography
                            variant="body2"
                            key={status}
                            sx={{ marginRight: 2 }}
                        >
                            {status}: {count}
                        </Typography>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
