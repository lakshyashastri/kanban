import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Switch,
    FormControlLabel,
    Box,
    TextField,
    useTheme,
} from "@mui/material";
import FlashingCount from "./FlashingCount";

function Header({
    liveMode,
    handleLiveModeToggle,
    ticketCounts,
    searchTerm,
    setSearchTerm,
}) {
    const theme = useTheme();

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: theme.palette.background.default,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                color: theme.palette.text.primary,
            }}
        >
            <Toolbar
                sx={{
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1,
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                    }}
                >
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
                        sx={{
                            backgroundColor: "#ffffff",
                            borderRadius: "4px",
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#cccccc",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#aaaaaa",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: theme.palette.primary.main,
                                },
                            },
                        }}
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
                    sx={{
                        "& .MuiFormControlLabel-label": {
                            color: theme.palette.text.primary,
                        },
                    }}
                />
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        marginLeft: { sm: 2 },
                        marginTop: { xs: 2, sm: 0 },
                        backgroundColor: "#eeeeee",
                        padding: "4px 8px",
                        borderRadius: "4px",
                    }}
                >
                    {Object.entries(ticketCounts).map(
                        ([status, count], index) => (
                            <Typography
                                variant="body2"
                                key={status}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginRight: 2,
                                    fontWeight: 700,
                                    color: theme.palette.text.primary,
                                    ...(index > 0 && {
                                        borderLeft: "1px solid #cccccc",
                                        paddingLeft: 2,
                                    }),
                                }}
                            >
                                {status}: <FlashingCount count={count} />
                            </Typography>
                        )
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
