import React from 'react';
// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// Material Icon
import MailIcon from '@material-ui/icons/Mail';
import Person from '@material-ui/icons/Person';
import ListAlt from '@material-ui/icons/ListAlt';
import Flight from '@material-ui/icons/Flight';
import MonetizationOn from '@material-ui/icons/MonetizationOn';
import Lock from '@material-ui/icons/Lock';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

export default function MenuDrawer(props) {
    const classes = useStyles();

    function goToPage(url) {
        props.history.push(url)
    };

    const sideList = () => (
        <div
            className={classes.list}
            onClick={props.handleClose}
            onKeyDown={props.handleClose}
        >
            <List>
                <ListItem onClick={() => goToPage('/account/my-profile')} className="drawer-listItem" disableRipple={true} button>
                    <ListItemIcon className="drawer-icon"><Person /></ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItem>
                <ListItem onClick={() => goToPage('/account/my-messages')} className="drawer-listItem" disableRipple={true} button>
                    <ListItemIcon className="drawer-icon"><MailIcon /></ListItemIcon>
                    <ListItemText primary="Messages" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem onClick={() => goToPage('/account/my-orders')} className="drawer-listItem" disableRipple={true} button>
                    <ListItemIcon className="drawer-icon"><ListAlt /></ListItemIcon>
                    <ListItemText primary="My Orders" />
                </ListItem>
                <ListItem onClick={() => goToPage('/account/my-trips')} className="drawer-listItem" disableRipple={true} button>
                    <ListItemIcon className="drawer-icon"><Flight /></ListItemIcon>
                    <ListItemText primary="My Trips" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem onClick={() => goToPage('/account/my-money')} className="drawer-listItem" disableRipple={true} button>
                    <ListItemIcon className="drawer-icon"><MonetizationOn /></ListItemIcon>
                    <ListItemText primary="Money" />
                </ListItem>
                <ListItem onClick={() => goToPage('/account/my-settings')} className="drawer-listItem" disableRipple={true} button>
                    <ListItemIcon className="drawer-icon"><Lock /></ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem className="drawer-listItem" disableRipple={true} button>
                    <ListItemIcon className="drawer-icon"><PowerSettingsNew /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </div>
    );

    return (
        <Drawer
            anchor="right"
            open={props.isOpen}
            onClose={props.handleClose}
        >
            {sideList()}
        </Drawer>
    );
}