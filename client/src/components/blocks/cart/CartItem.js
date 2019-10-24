import React from 'react';
// Redux
import { store } from '../../../store';
import { addItem, removeItem, deleteItem } from '../../../actions/cart';
import { getCount } from '../../../reducers/index';
// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import Truncate from 'react-truncate';
// Components
import DialogItemDetails from '../../layouts/DialogItemDetails';
// Utils
import { MAX_COUNT } from '../../../utils/Variables';

const useStyles = makeStyles({
    card: {
        maxWidth: 345,
        marginBottom: '6px',
        borderRadius: 4,
    },
    media: {
        height: 140,
        backgroundSize: 'contain',
    },
    actionArea: {
        "&:hover $focusHighlight": {
            opacity: 0,
        },
    },
    focusHighlight: {},
    fab: {
        width: 30,
        height: 30,
        boxShadow: 'none',
        minHeight: 30,
        '&:active': {
            boxShadow: 'none',
        },
    },
});

export default function CartItem(props) {
    const classes = useStyles();
    const [isDialog, setDialog] = React.useState(false);
    const item = props.data;
    const state = store.getState();
    const count = getCount(state);
    const quantity = state.cart.quantityById[item._id];
    // Booleans
    const isRemoveDisabled = (quantity > 1) ? false : true;
    const isAddDisabled = (count === MAX_COUNT) ? true : false;

    return (
        <React.Fragment>
            <Card className={classes.card}>
                <CardActionArea
                    classes={{
                        root: classes.actionArea,
                        focusHighlight: classes.focusHighlight
                    }}
                    onClick={() => setDialog(true)}
                    disableRipple={true}
                >
                    <CardMedia
                        className={classes.media}
                        image={item.imageURL}
                    />
                    <CardContent>
                        <Typography style={{ fontWeight: 'bold' }}>
                            <Truncate lines={1}>{item.name}</Truncate>
                        </Typography>
                        <Typography component="p">
                            <font color="#E91E63"><b>{item.formattedPrice}</b></font>
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Fab
                        onClick={() => store.dispatch(deleteItem(item))}
                        size="small"
                        color="default"
                        aria-label="Delete"
                        className={classes.fab}
                        style={{ color: '#909090', backgroundColor: '#fff' }}
                    >
                        <DeleteIcon />
                    </Fab>
                    <Button
                        onClick={() => setDialog(true)}
                        size="small"
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: 'auto' }}
                    >
                        Details
                    </Button>
                    <Fab
                        onClick={() => store.dispatch(removeItem(item))}
                        disabled={isRemoveDisabled}
                        size="small"
                        color="default"
                        aria-label="Remove"
                        className={classes.fab}
                    >
                        <RemoveIcon />
                    </Fab>
                    <div style={{ marginLeft: 8, fontWeight: 'bold' }}>{quantity}</div>
                    <Fab
                        onClick={() => store.dispatch(addItem(item, 1))}
                        disabled={isAddDisabled}
                        size="small"
                        color="secondary"
                        aria-label="Add"
                        className={classes.fab}
                    >
                        <AddIcon />
                    </Fab>
                </CardActions>
            </Card>
            <DialogItemDetails
                isOpen={isDialog}
                handleClose={() => setDialog(false)}
                data={item}
                isActions={false}
            />
        </React.Fragment>
    );
}