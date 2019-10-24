import React, { Component } from 'react';
// Components
import FormPostTripPart1 from '../../components/forms/FormPostTripPart1';
import FormPostTripPart2 from '../../components/forms/FormPostTripPart2';
import FormPostTripPart3 from '../../components/forms/FormPostTripPart3';
import Snackbar from '../../components/layouts/Snackbar';
// Utils
import { createTrip } from '../../utils/FunctionsTrips';
import { FREE } from '../../utils/Variables';

class PostTrip extends Component {
    constructor() {
        super();
        this.initialState = {
            fromCountry: '',
            fromAirport: '',
            toCountry: '',
            toAirport: '',
            arrivalDate: '',
            packageSize: '',
            arrivalRange: '',
            cities: [],
            stores: [{ value: 'ALL', label: 'ALL', isFixed: true }],
            comment: '',
            dropAirport: false,
            dropCities: false,
            status: FREE,
            active: 1,
            success: null,
        };
        this.state = { ...this.initialState };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCreateTrip = this.handleCreateTrip.bind(this);
    };

    componentDidMount() {
        window.scrollTo(0, 0);
    };

    handleSubmit(data, part) {
        window.scrollTo(0, 0);
        for (const item in data) {
            this.setState({ [item]: data[item] });
        };
        if (part === 4) {
            this.handleCreateTrip();
        } else {
            this.setState({ active: part, success: null });
        };
    };

    async handleCreateTrip() {
        window.scrollTo(0, 0);
        const data = { ...this.state };
        const isSuccess = await createTrip(data);
        this.setState({ ...this.initialState, success: isSuccess });
    };

    render() {
        return (
            <React.Fragment>
                {
                    (this.state.success !== null) &&
                    <div className="block">
                        <Snackbar success={this.state.success} />
                    </div>
                }
                {
                    (this.state.active === 1) &&
                    <FormPostTripPart1
                        handleSubmit={this.handleSubmit}
                    />
                }
                {
                    (this.state.active === 2) &&
                    <FormPostTripPart2
                        handleSubmit={this.handleSubmit}
                        fromCountry={this.state.fromCountry}
                    />
                }
                {
                    (this.state.active === 3) &&
                    <FormPostTripPart3
                        handleSubmit={this.handleSubmit}
                        toCountry={this.state.toCountry}
                        toAirport={this.state.toAirport}
                    />
                }
            </React.Fragment>
        );
    }
}

export default PostTrip;