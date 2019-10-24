import React, { Component } from 'react';
// Redux
import { connect } from 'react-redux';
import { getCount } from '../../reducers/index';
// Packages
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
// Material-UI
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import Search from '@material-ui/icons/Search';
import Menu from '@material-ui/icons/Menu';
// Components
import MenuDrawer from './MenuDrawer';

const useStyles = {
    navlinks: {
        display: 'inline-flex',
        '@media (max-width: 700px)': {
            display: 'none',
        },
    },
    button: {
        textTransform: 'initial',
        fontFamily: 'Vice-City-Sans',
        fontWeight: 'bold',
        fontSize: 16,
        padding: '10px 12px',
        borderRadius: '0px',
        '&:hover': {
            backgroundColor: 'transparent',
            color: '#FFC107',
        },
    },
    iconButton: {
        padding: 10,
        borderRadius: 0,
    },
};

class Navbar extends Component {
    constructor() {
        super();
        this.state = {
            isOpen: false
        };
    };

    setActiveLink(match, location) {
        switch (location.pathname) {
            case '/account/my-profile':
            case '/account/my-orders':
            case '/account/my-trips':
            case '/account/my-messages':
            case '/account/my-money':
            case '/account/my-settings':
                return true;
            default:
                return false;
        };
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <div style={{ flexGrow: 1 }}>
                    <AppBar position="fixed">
                        <Toolbar variant="dense">
                            <div style={{ flexGrow: 1, marginRight: 14 }}></div>
                            <div className={classes.navlinks}>
                                <NavLink
                                    exact
                                    to="/shop"
                                    className="navLink"
                                    activeClassName="active-navLink"
                                >
                                    <Button
                                        color="inherit"
                                        className={classes.button}
                                        disableRipple={true}
                                    >
                                        Shop
                                    </Button>
                                </NavLink>
                                <NavLink
                                    exact
                                    to="/orders"
                                    className="navLink"
                                    activeClassName="active-navLink"
                                >
                                    <Button
                                        color="inherit"
                                        className={classes.button}
                                        disableRipple={true}
                                    >
                                        <Search />Orders
                                    </Button>
                                </NavLink>
                                <NavLink
                                    exact
                                    to="/post-trip"
                                    className="navLink"
                                    activeClassName="active-navLink"
                                >
                                    <Button
                                        color="inherit"
                                        className={classes.button}
                                        disableRipple={true}
                                    >
                                        Post a Trip
                                    </Button>
                                </NavLink>
                                <NavLink
                                    exact
                                    to="/trips"
                                    className="navLink"
                                    activeClassName="active-navLink"
                                >
                                    <Button
                                        color="inherit"
                                        className={classes.button}
                                        disableRipple={true}
                                    >
                                        <Search />Travelers
                                    </Button>
                                </NavLink>
                                <NavLink
                                    exact
                                    to="/cart"
                                    className="navLink"
                                    activeClassName="active-navLink"
                                >
                                    <Button
                                        color="inherit"
                                        className={classes.button}
                                        style={{ paddingLeft: 14, paddingRight: 20 }}
                                        disableRipple={true}
                                    >
                                        <font style={{ marginRight: 16 }}>My Cart</font>
                                        <Badge
                                            badgeContent={this.props.count}
                                            color="secondary"
                                            style={{ marginBottom: 2 }}
                                            showZero
                                        />
                                    </Button>
                                </NavLink>
                                <NavLink
                                    isActive={this.setActiveLink}
                                    to={this.props.location.pathname}
                                    className="navLink"
                                    activeClassName="active-navLink"
                                >
                                    <Button
                                        color="inherit"
                                        onClick={() => this.setState({ isOpen: true })}
                                        className={classes.button}
                                        disableRipple={true}
                                    >
                                        <Menu style={{ marginRight: 6, marginBottom: 2 }} />
                                        Menu
                                    </Button>
                                </NavLink>
                            </div>
                        </Toolbar>
                    </AppBar>
                </div>
                <MenuDrawer
                    isOpen={this.state.isOpen}
                    handleClose={() => this.setState({ isOpen: false })}
                    history={this.props.history}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    count: getCount(state)
});

export default connect(mapStateToProps)(withRouter(withStyles(useStyles)(Navbar)));