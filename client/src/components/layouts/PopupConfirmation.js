import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

const styles = {
    root: {
        margin: 0,
        padding: '16px 20px',
        backgroundColor: '#e91e63',
    },
};

const DialogTitle = withStyles(styles)(props => {
    const { children, classes } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6" style={{ color: '#fff', fontWeight: 'bold' }}>{children}</Typography>
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles({
    root: {
        padding: 20,
    },
})(MuiDialogContent);

const DialogActions = withStyles({
    root: {
        margin: 0,
        padding: '16px 20px',
        backgroundColor: '#f3f3f3',
    },
})(MuiDialogActions);

export default function PopupConfirmation(props) {
    let modalTitle = "";
    let modalText = "";
    switch (props.type) {
        case 'deletePost':
            modalTitle = "Deletion";
            modalText = "Are you sure you want to delete your post?";
            break;
        case 'deleteCompletedPost':
            modalTitle = "Deletion";
            modalText = "Are you sure you want to delete that post?";
            break;
        case 'declineOffer':
            modalTitle = "Declining";
            modalText = "Are you sure you want to decline that offer?";
            break;
        case 'acceptOffer':
            modalTitle = "Acceptance";
            modalText = "Do you want to accept that offer?";
            break;
        case 'cancelRequest':
            modalTitle = "Cancellation";
            modalText = "Are you sure you want to cancel your request?";
            break;
        default:
            break;
    };

    return (
        <Dialog aria-labelledby="customized-dialog-title" open={props.isOpen}>
            <DialogTitle id="customized-dialog-title">
                {modalTitle}
            </DialogTitle>
            <DialogContent dividers>
                <Typography gutterBottom>
                    {modalText}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose.bind(this, false)} color="primary" variant="outlined">No</Button>
                <Button onClick={props.handleClose.bind(this, true)} color="primary" variant="contained">Yes</Button>
            </DialogActions>
        </Dialog>
    );
}