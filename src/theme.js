import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        background: {
            default: "#f5f5f5", // light gray background
        },
        text: {
            primary: "#333333", // dark gray text
            secondary: "#666666", // medium gray text
        },
        primary: {
            main: "#4d90fe",
        },
        success: {
            main: "#6abf69",
        },
        grey: {
            100: "#f9f9f9", // card backgrounds
            200: "#eeeeee", // borders and lines
        },
    },
    typography: {
        fontFamily: "Roboto, sans-serif",
        h6: {
            fontWeight: 700,
            color: "#333333",
        },
        subtitle1: {
            fontWeight: 500,
            color: "#333333",
        },
        body1: {
            color: "#666666",
        },
        body2: {
            color: "#666666",
        },
        caption: {
            color: "#999999",
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#f5f5f5",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    color: "#333333",
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    "&.Mui-checked": {
                        color: "#6abf69", // soft green
                    },
                },
                track: {
                    backgroundColor: "#cccccc",
                    ".Mui-checked.Mui-checked + &": {
                        backgroundColor: "#6abf69",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    border: "1px solid #eeeeee", // light gray borderr
                    "&:hover": {
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)", // shadow
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                },
            },
        },
    },
});

export default theme;
