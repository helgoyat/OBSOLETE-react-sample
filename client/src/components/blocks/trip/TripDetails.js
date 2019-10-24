import React from 'react';
// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
// Components
import DialogProfile from '../../layouts/DialogProfile';
// import DialogSendMessage from '../../layouts/DialogSendMessage';
// import DialogReportIssue from '../../layouts/DialogReportIssue';
import PopupConfirmation from '../../layouts/PopupConfirmation';
// Utils
import { deleteMyTrip } from '../../../utils/FunctionsTrips';
import { ACCEPTED } from '../../../utils/Variables';

const useStyles = makeStyles({
    cardHeader: {
        padding: '12px 20px',
        backgroundColor: '#e9e9e9',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    card: {
        position: 'relative',
        marginBottom: 10,
        paddingTop: 50,
    },
    cardActions: {
        padding: '10px 20px 20px',
    },
    avatar: {
        margin: 'auto',
        backgroundColor: '#595959',
        width: 80,
        height: 80,
        '&:hover': {
            cursor: 'pointer',
        },
    },
});

export default function TripDetails(props) {
    const { trip, user } = props.data;
    const classes = useStyles();
    const [isDialog, setDialog] = React.useState(false);
    const [isDialogRI, setDialogRI] = React.useState(false);
    const [isDialogSM, setDialogSM] = React.useState(false);
    const [isPopup, setPopup] = React.useState(false);
    // Functions
    function handleOpenDialogProfile() {
        setDialog(true);
    };
    async function handlePopupClose(isConfirmed) {
        setPopup(false);
        if (isConfirmed) {
            const response = await deleteMyTrip(trip._id);
            if (response) {
                document.location.reload();
            };
        };
    };
    return (
        <React.Fragment>
            <Card className={classes.card}>
                <div className="status">Trip</div>
                {
                    (user !== null) &&
                    <div className={classes.cardHeader}>
                        <div onClick={handleOpenDialogProfile} className="link-profile">{user.username}</div>
                    </div>
                }
                <CardContent style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignContent: 'stretch', marginBottom: 20 }}>
                        <div style={{ flex: '45%' }}>
                            <div className="country-from">{trip.fromCountry}</div>
                            <div style={{ marginTop: 6, color: '#1f1f1f' }}>{trip.fromAirport}</div>
                        </div>
                        <div style={{ flex: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '2px 6px' }}>
                            <i className="fas fa-plane"></i>
                        </div>
                        <div style={{ flex: '45%' }}>
                            <div className="country-to">{trip.toCountry}</div>
                            <div style={{ marginTop: 6, color: '#1f1f1f' }}>{trip.toAirport}</div>
                        </div>
                    </div>

                    <Typography component="div" style={{ marginBottom: 10 }}><h6>Arrival Date</h6></Typography>
                    <div className="option"><span role="img" aria-label="img">📅</span> {trip.arrivalDate}</div>

                    <Typography component="div" style={{ marginBottom: 10 }}><h6>Package Size</h6></Typography>
                    <div className="option">
                        <span role="img" aria-label="img">📦</span> {trip.packageSize}
                    </div>
                    <Typography component="div" style={{ marginBottom: 10 }}><h6>Stores</h6></Typography>
                    <Typography component="div">
                        {
                            trip.stores.map((store, index) => {
                                return (
                                    <div className="option" key={index}>
                                        <span role="img" aria-label="img">🛒</span> {store}
                                    </div>
                                );
                            })
                        }
                    </Typography>
                    <Typography component="div" style={{ marginBottom: 10 }}><h6>Delivery Preferences</h6></Typography>
                    {
                        trip.dropAirport &&
                        <div className="option"><span role="img" aria-label="img">✔️</span> Airport</div>
                    }
                    {
                        trip.dropCities &&
                        <div className="option"><span role="img" aria-label="img">✔️</span> Cities</div>
                    }
                    {
                        trip.dropCities &&
                        <Typography component="div">
                            <div style={{ marginBottom: 10 }}><h6>Cities</h6></div>
                            <div>
                                {
                                    trip.cities.map((city, index) => {
                                        return (
                                            <div className="option" key={index}>
                                                <span role="img" aria-label="img">📍</span> {city}
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </Typography>
                    }
                    {
                        trip.dropAirport &&
                        <Typography component="div">
                            <div style={{ marginBottom: 10 }}><h6>Local arrival time</h6></div>
                            <div className="option">
                                <span role="img" aria-label="img">🕒</span> {trip.arrivalRange}
                            </div>
                        </Typography>
                    }
                    {
                        trip.comment &&
                        <div>
                            <Typography component="div" style={{ marginBottom: 10 }}><h6>Comment</h6></Typography>
                            <Typography component="div">{trip.comment}</Typography>
                        </div>
                    }
                    <Typography component="div" className="date">Posted {trip.createdAt}</Typography>
                </CardContent>
                {
                    (props.isSelf && (trip.status < ACCEPTED)) &&
                    <CardActions className={classes.cardActions} disableSpacing>
                        <Button onClick={() => setPopup(true)} style={{ marginLeft: 'auto' }} variant="outlined" color="secondary">Delete</Button>
                    </CardActions>
                }
                {
                    (props.isSelf && (trip.status >= ACCEPTED)) &&
                    <CardActions className={classes.cardActions} disableSpacing>
                        <Button onClick={() => setDialogRI(true)} style={{ marginLeft: 'auto' }} variant="outlined" color="secondary">Report issue</Button>
                    </CardActions>
                }
                {
                    (!props.isSelf && (trip.status > ACCEPTED)) &&
                    <CardActions className={classes.cardActions} disableSpacing>
                        <Button onClick={() => setDialogSM(true)} style={{ marginLeft: 'auto' }} variant="contained" color="primary">Send a message</Button>
                    </CardActions>
                }
            </Card>
            <DialogProfile
                isOpen={isDialog}
                handleClose={() => setDialog(false)}
                user={user}
            />
            {/* <DialogSendMessage
                isOpen={isDialogSM}
                handleClose={() => setDialogSM(false)}
            />
            <DialogReportIssue
                isOpen={isDialogRI}
                handleClose={() => setDialogRI(false)}
            /> */}
            <PopupConfirmation
                isOpen={isPopup}
                handleClose={handlePopupClose}
                type={'deletePost'}
            />
        </React.Fragment>
    );
}