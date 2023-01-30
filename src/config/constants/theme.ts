import { ThemeOptions } from '@mui/material';

export const light: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#fb6519'
        },
        secondary: {
            main: '#f126a4'
        },
        background: {
            paper: '#ffffff',
            default: '#f4edf1'
        }
    },
    typography: {
        fontFamily: "'Fredoka', sans-serif"
    },
    shape: {
        borderRadius: 16
    }
};

export const dark: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#fb6519'
        },
        secondary: {
            main: '#f126a4'
        },
        background: {
            paper: '#1e2745',
            default: '#161d34'
        }
    },
    typography: {
        fontFamily: "'Fredoka', sans-serif"
    },
    shape: {
        borderRadius: 16
    }
};
