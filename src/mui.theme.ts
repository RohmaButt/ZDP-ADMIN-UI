import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#1890ff",
    },
    secondary: {
      main: "#FFFFFF",
    },
    action: {
      disabled: "#aaa",
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#132640",
          color: "white",
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          p: {
            marginBottom: 0,
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#edebeb",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#edebeb",
            width: "0.5em",
            height: "0.5em",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#979797",
            minHeight: 1,
            minWidth: 2,
            maxWidth: 1,
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
          {
            backgroundColor: "#edebeb",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
          {
            backgroundColor: "#edebeb",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
          {
            backgroundColor: "#979797",
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#ffffff",
          },
        },
      },
    },
  },
  typography: {
    fontSize: 13,
  },
});

theme = responsiveFontSizes(theme);

export default theme;
