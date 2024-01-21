import { createTheme } from '@material-ui/core/styles';

import { blue } from '@material-ui/core/colors';

// COMMON
const overrides = {
  MuiTypography: {
    body2: {
      fontFamily: 'Comfortaa',
    },
  },
  MuiPaper: {
    root: {
      boxShadow: 'none',
    },
  },
};

const themeOptions = {
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    subtitle1: {
      fontWeight: 'bold',
    },
  },
  props: {
    MuiLink: {
      color: 'secondary',
    },
    MuiTextField: {
      variant: 'outlined',
    },
  },
};

// DARK MODE
const darkPalette = {
  type: 'dark',
  background: {
    default: '#282c34',
    paper: '#181b20',
  },
  primary: {
    main: 'rgb(26, 28, 34)',
  },
  secondary: {
    main: blue['A100'],
  },
};

const darkOverrides = {
  ...overrides,
  MuiChip: {
    outlined: {
      color: '#c8def1',
    },
  },
  MuiTypography: {
    subtitle1: {
      color: '#769ee7',
    },
  },
};

// LIGHT MODE

const lightPalette = {
  type: 'light',
  primary: { main: blue['700'] },
  secondary: { main: blue['600'] },
  background: {
    default: '#f9fafb',
    paper: '#ffffff',
  },
};
const lightOverrides = {
  ...overrides,
  MuiChip: {
    outlined: {
      color: '#143d66',
    },
  },
  MuiPaper: {
    elevation3: {
      boxShadow: `0 4px 6px -1px rgba(0,0,0,.1),
                  0 2px 4px -1px rgba(0,0,0,.06)`,
    },
  },
  MuiTypography: {
    subtitle1: {
      color: '#2674c2',
    },
  },
};

export const darkTheme = createTheme({
  ...themeOptions,
  palette: darkPalette,
  overrides: darkOverrides,
});

export const lightTheme = createTheme({
  ...themeOptions,
  palette: lightPalette,
  overrides: lightOverrides,
});
