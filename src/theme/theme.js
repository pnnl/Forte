import { createTheme } from "@mui/material/styles";// Create a theme instance.
const outerTheme = createTheme({
  palette: {
    primary: {
      main: "#0069d9"
    },
    secondary: {
      main: "#0069d9"
    }
  }
})



// eslint-disable-next-line no-unused-vars
const outerTheme1 = createTheme({
  palette: {
    primary: {
      main: "#f00"
    },
    secondary: {
      main: "#0069d9"
    }
  },
  typography: {
    fontFamily: "Times New Roman",
    body2: {
      fontFamily: "Times New Roman",
      fontSize: "1.1rem"
    }
  },
  shape: {
    borderRadius: 2
  },
  spacing: 2,
  overrides: {
    MuiFilledInput: {
      root: {
        backgroundColor: "none",
        padding:0,
      }
    },
    MuiInputLabel: {
      root: {
        backgroundColor: "yellow"
      }
    },
    MuiTextField: {
      root: {}
    },
    MuiButton: {
      root: {
        textTransform: "none",
        padding: "15px"
      },
      fullWidth: {
        maxWidth: "100%"
      }
    },
    // eslint-disable-next-line no-dupe-keys
    MuiFilledInput:{
      root:{
        padding:0,
        backgroundColor:"yellow"
      }
    },
    MuiAutocomplete:{
      Root:{
        padding:0
      }
    }

  },
  props: {
    MuiButton: {
      disableRipple: true,
      variant: "contained",
      color: "primary"
    },
    MuiCheckbox: {
      disableRipple: true
    },
    MuiTextField: {
      variant: "filled",
      InputLabelProps: {
        shrink: true
      }
    },
    MuiPaper: {
      elevation: 12
    },
    MuiCard: {
      elevation: 2
    },
  }
});

export default outerTheme