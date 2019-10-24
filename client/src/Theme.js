import { createMuiTheme } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';
// import { deepOrange } from '@material-ui/core/colors';

const Theme = createMuiTheme({
    palette: {
        error: { main: '#E91E63' },
        primary: { main: deepPurple[600] },
        secondary: { main: '#E91E63' },
    },
    overrides: {
        // Icon Button
        MuiIconButton: {
            root: {
                '&:hover': {
                    backgroundColor: 'none',
                },
            },
            colorPrimary: {
                color: '#fff',
            }
        },
        // App bar
        MuiAppBar: {
            root: {
                boxShadow: 'none',
            },
            colorPrimary: {
                backgroundColor: deepPurple[600],
            }
        },
        MuiToolbar: {
            dense: {
                minHeight: 48,
            }
        },
        // Badge
        MuiBadge: {
            colorSecondary: {
                color: '#fff',
                backgroundColor: '#E91E63',
            }
        },
        // Buttons
        MuiButton: {
            contained: {
                boxShadow: 'none',
                '&:active': {
                    boxShadow: 'none',
                }
            }
        },
        // Checkbox
        MuiCheckbox: {
            root: {
                '&:hover': {
                    backgroundColor: 'transparent !important',
                }
            }
        },
        // Inputs
        MuiInputBase: {
            // input: {
            //     '&:focus': {
            //         backgroundColor: '#fff',
            //     }
            // }
        },
        MuiOutlinedInput: {
            root: {
                '&$focused $notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                    borderWidth: '1px',
                },
                '&:hover $notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                }
            },
            input: {
                fontWeight: 'normal',
                padding: '6px 10px',
                backgroundColor: '#ffffff',
                borderRadius: '4px',
            },
            multiline: {
                fontWeight: 'normal',
                padding: '6px 10px',
                backgroundColor: '#ffffff',
                borderRadius: '4px',
                '&$focused': {
                    backgroundColor: '#ffffff',
                }
            }
        },
        // Helper text
        MuiFormHelperText: {
            contained: {
                margin: '8px 0px 0px',
            },
            marginDense: {
                marginTop: '8px',
            }
        },
        // Text near avatar in Card
        MuiCardHeader: {
            avatar: {
                marginRight: 10,
            },
            title: {
                fontWeight: 'bold',
                textTransform: 'uppercase'
            },
        },
        // Expansion panels filters
        MuiExpansionPanelSummary: {
            root: {
                padding: '0 20px 0 20px',
                backgroundColor: '#1c1c1c',
                color: '#fff',
                '&$expanded': {
                    minHeight: 50,
                },
            },
            content: {
                '&$expanded': {
                    margin: '12px 0',
                },
            },
        },
        // MuiDialog
        MuiDialog: {
            paperFullScreen: {
                paddingTop: 60,
            },
            paperWidthSm: {
                maxWidth: 500,
                width: '100%',
            },
        },
        MuiExpansionPanelDetails: {
            root: {
                padding: '10px 20px 20px',
            },
        },
        // Mui Paper
        MuiPaper: {
            rounded: {
                borderRadius: 0,
            },
        },
        // Drawer
        MuiDrawer: {
            paper: {
                boxShadow: 'none',
                backgroundColor: '#4d2897',
            },
        },
        MuiListItem: {
            button: {
                color: '#fff',
                '&:hover': {
                    color: '#FFC107',
                },
            },
        },
        MuiListItemIcon: {
            root: {
                minWidth: 48,
                color: '#fff',
            },
        },
        MuiListItemText: {
            primary: {
                fontFamily: 'Vice-City-Sans',
            },
        },
    },
    typography: {
        fontFamily: ['Arial, Helvetica, sans-serif'].join(','),
        useNextVariants: true,
    }
});

export default Theme;