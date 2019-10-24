import React, { Component } from 'react';
// Packages
import Moment from 'moment';
import { ValidatorForm } from 'react-material-ui-form-validator';
// Material-UI
import Button from '@material-ui/core/Button';
// Components
import Autocomplete from '../utils/Autocomplete';
import DatePickerFlight from '../utils/DatePickerFlight';
import CircularLoader from '../layouts/CircularLoader';
// Utils
import { getJSON } from '../../utils/FunctionsJSON';

class FormPostTripPart1 extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.JSONdata = {
            JSONairports: [],
        };
        this.state = {
            ...this.JSONdata,
            fromCountry: '',
            fromAirport: '',
            toCountry: '',
            toAirport: '',
            arrivalDate: Moment().format(),
            loading: false,
        };
        this.handleDownshiftChange = this.handleDownshiftChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    componentDidMount() {
        this._isMounted = true;
        this.setState({ loading: true }, async () => {
            const JSONairports = await getJSON('airports');
            const tomorrow = Moment().add(1, 'day').format();
            if (this._isMounted) {
                this.setState({
                    JSONairports: JSONairports,
                    arrivalDate: tomorrow,
                    loading: false
                });
            };
        });
    };

    componentWillUnmount() {
        this._isMounted = false;
    };

    handleDownshiftChange(name, value) {
        if (name === 'fromAirport') {
            const fromCountry = value ? this.state.JSONairports.find(e => e.value === value).country : '';
            this.setState({ fromCountry: fromCountry });
        };
        if (name === 'toAirport') {
            const toCountry = value ? this.state.JSONairports.find(e => e.value === value).country : '';
            this.setState({ toCountry: toCountry });
        };
        this.setState({ [name]: value });
    };

    handleDateChange(date) {
        this.setState({ arrivalDate: date });
    };

    handleSubmit(event) {
        event.preventDefault();
        const data = { ...this.state };
        delete data.loading;
        delete data.JSONairports;
        this.props.handleSubmit(data, 2);
    };

    render() {
        // Display
        const airports = this.state.JSONairports.map(e => ({
            value: e.value,
            label: `${e.name} (${e.value}) - ${e.country}`,
            country: e.country
        }));

        return (
            <ValidatorForm
                onSubmit={this.handleSubmit}
                className="block basics"
                autoComplete="off"
            >
                <h4>Itinerary</h4>
                {
                    !this.state.loading ?
                        <div className="container">
                            <React.Fragment>
                                <h6>Departure</h6>
                                <Autocomplete
                                    name="fromAirport"
                                    options={airports}
                                    value={this.state.fromAirport}
                                    onChange={this.handleDownshiftChange}
                                    validators={['required']}
                                    errorMessages={['Please select a value']}
                                />
                            </React.Fragment>
                            <React.Fragment>
                                <h6>Arrival</h6>
                                <Autocomplete
                                    name="toAirport"
                                    options={airports}
                                    value={this.state.toAirport}
                                    onChange={this.handleDownshiftChange}
                                    validators={['required']}
                                    errorMessages={['Please select a value']}
                                />
                            </React.Fragment>
                            <React.Fragment>
                                <h6>Date of Arrival</h6>
                                <DatePickerFlight handleDateChange={this.handleDateChange} value={this.state.arrivalDate} />
                            </React.Fragment>
                        </div> : <CircularLoader />
                }
                <div className="progress-bar">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: 'auto' }}
                    >
                        Next
                    </Button>
                </div>
            </ValidatorForm>
        );
    }
}

export default FormPostTripPart1;