import React, { Component } from 'react';
// Packages
import Pagination from "material-ui-flat-pagination";
// Components
import TripsItem from '../../components/blocks/trip/TripsItem';
import TripsFilter from '../../components/blocks/trip/TripsFilter';
import DialogOfferToTrip from '../../components/layouts/DialogOfferToTrip';
import CircularLoader from '../../components/layouts/CircularLoader';
// Utils
import { getMyAvailableOrdersCondensed } from '../../utils/FunctionsOrders';
import {
    countAvailableTrips,
    getAvailableTrips
} from '../../utils/FunctionsTrips';

class Trips extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.initialState = {
            availableTrips: null,
            offset: 0,
            count: 0,
            filter: null,
        };
        this.initialDialog = {
            isDialog: false,
            offerToTrip: null,
        };
        this.state = {
            ...this.initialState,
            ...this.initialDialog,
            loading: false,
            myOrdersList: [],
        };
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    };

    componentDidMount() {
        this._isMounted = true;
        window.scrollTo(0, 0);
    };

    componentWillUnmount() {
        this._isMounted = false;
    };

    handleReset() {
        this.setState({ ...this.initialState, ...this.initialDialog });
    };

    handleSubmit(filter) {
        window.scrollTo(0, 0);
        this.setState({ loading: true, availableTrips: [] }, async () => {
            const count = await countAvailableTrips(filter);
            const availableTrips = await getAvailableTrips(filter, 0);
            const myAvailableOrders = await getMyAvailableOrdersCondensed();
            const myOrdersList = myAvailableOrders.map(e => ({ value: e._id, label: `${e.storeName} - ${e.count} ${(e.count > 1) ? 'items' : 'item'} (${e.createdAt}) to ${e.toAirport}` }));
            if (this._isMounted) {
                this.setState({ availableTrips, myOrdersList, count, offset: 0, filter, loading: false });
            };
        });
    };

    openDialog(trip) {
        this.setState({ isDialog: true, offerToTrip: trip });
    };

    closeDialog() {
        this.setState({ ...this.initialDialog });
    };

    handlePageChange(offset) {
        window.scrollTo(0, 0);
        const { filter } = this.state;
        this.setState({ loading: true }, async () => {
            const count = await countAvailableTrips(filter);
            const availableTrips = await getAvailableTrips(filter, offset);
            if (this._isMounted) {
                this.setState({ availableTrips, count, offset, loading: false });
            };
        });
    };

    render() {
        return (
            <React.Fragment>
                <TripsFilter handleSubmit={this.handleSubmit} handleReset={this.handleReset} />
                {
                    (this.state.availableTrips !== null) &&
                    <div className="block">
                        {
                            !this.state.loading ?
                                <React.Fragment>
                                    {
                                        (this.state.availableTrips.length > 0) ?
                                            <React.Fragment>
                                                {
                                                    this.state.availableTrips.map(item => {
                                                        return <TripsItem
                                                            key={item.trip._id}
                                                            data={item}
                                                            isOffer={false}
                                                            isRequest={false}
                                                            openDialog={this.openDialog}
                                                        />
                                                    })
                                                }
                                                <div style={{ marginTop: 20, textAlign: 'center' }}>
                                                    <Pagination
                                                        limit={4}
                                                        offset={this.state.offset}
                                                        total={this.state.count}
                                                        onClick={(e, offset) => this.handlePageChange(offset)}
                                                    />
                                                </div>
                                                <DialogOfferToTrip
                                                    isOpen={this.state.isDialog}
                                                    handleClose={this.closeDialog}
                                                    myOrdersList={this.state.myOrdersList}
                                                    offerToTrip={this.state.offerToTrip}
                                                />
                                            </React.Fragment> : <div className="empty-list">No result</div>
                                    }
                                </React.Fragment> : <CircularLoader />
                        }
                    </div>
                }
            </React.Fragment>
        );
    }
}

export default Trips;