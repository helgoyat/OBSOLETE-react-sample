import React, { Component } from 'react';
// Packages
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
// Material-UI
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
// Components
import Dropdown from '../utils/Dropdown';
import Checkboxes from '../utils/Checkboxes';
import MultiAutocomplete from '../utils/MultiAutocomplete';
import CircularLoader from '../layouts/CircularLoader';
// Utils
import { getJSON, getOneJSON, getTwoJSON } from '../../utils/FunctionsJSON';
import { MAX_CITIES } from '../../utils/Variables';

class FormPostTripPart3 extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.JSONdata = {
            JSONarrivalRanges: [],
            JSONcities: [],
            JSONairport: {},
        };
        this.state = {
            ...this.JSONdata,
            cities: [],
            arrivalRange: '',
            comment: '',
            dropAirport: false,
            dropCities: false,
            checkError: false,
            loading: false,
        };
        this.trimText = this.trimText.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    componentDidMount() {
        this._isMounted = true;
        this.setState({ loading: true }, async () => {
            const JSONarrivalRanges = await getJSON('arrival-ranges');
            const JSONcities = await getOneJSON('country-cities', this.props.toCountry);
            const JSONairport = await getTwoJSON('airport', this.props.toCountry, this.props.toAirport);
            const defaultCity = { value: JSONairport.location, label: `${JSONairport.location} (${JSONairport.state})`, state: JSONairport.state };
            if (this._isMounted) {
                this.setState({ JSONarrivalRanges, JSONcities, JSONairport, cities: [defaultCity], loading: false, });
            };
        });
    };

    componentWillUnmount() {
        this._isMounted = false;
    };

    trimText(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value.trim() });
    };

    handleChange(event) {
        const { name, value } = event.target;
        const val = (name === 'arrivalRange') ? parseInt(value) : value;
        this.setState({ [name]: val });
    };

    handleCheckChange(event) {
        const { name, checked } = event.target;
        this.setState({ [name]: checked });
        if (name === 'dropAirport') {
            this.setState({ arrivalRange: '' });
        };
        // Remove checkboxes errors
        if (this.state.checkError) {
            this.setState({ checkError: false });
        };
    };

    handleMultiSelectChange(value, name) {
        this.setState({ [name]: value });
    };

    handleSubmit() {
        if (!this.state.dropAirport && !this.state.dropCities) {
            this.setState({ checkError: true });
        } else {
            if (!this.state.checkError) {
                const data = { ...this.state };
                const hide = 'JSONcities JSONarrivalRanges JSONairportCity loading checkError';
                hide.split(' ').forEach(function (prop) {
                    delete data[prop];
                });
                this.props.handleSubmit(data, 4);
            };
        };
    };

    render() {
        const checkboxes = [
            { value: this.state.dropAirport, name: 'dropAirport', label: 'Airport', color: 'primary' },
            { value: this.state.dropCities, name: 'dropCities', label: 'Cities', color: 'primary' },
        ];
        // Display
        const { JSONarrivalRanges, JSONcities, JSONairport } = this.state;
        const arrivalRanges = JSONarrivalRanges.map(e => ({ value: e.value, label: e.name }));
        const cities = JSONcities.map(e => ({ value: e.value, label: `${e.value} (${e.state})`, state: e.state }));
        const defaultCity = { value: JSONairport.location, label: `${JSONairport.location} (${JSONairport.state})`, state: JSONairport.state };

        return (
            <ValidatorForm
                onSubmit={this.handleSubmit}
                className="block basics"
                autoComplete="off"
            >
                <h4>Drop Off</h4>
                {
                    !this.state.loading ?
                        <div className="container">
                            <React.Fragment>
                                <h6>Delivery Preferences</h6>
                                <Checkboxes
                                    checkboxes={checkboxes}
                                    onChange={this.handleCheckChange}
                                    error={this.state.checkError}
                                    helperText="Select at least one of the two options"
                                />
                            </React.Fragment>
                            {
                                this.state.dropAirport &&
                                <React.Fragment>
                                    <h6>Local arrival time</h6>
                                    <Dropdown
                                        name="arrivalRange"
                                        list={arrivalRanges}
                                        value={this.state.arrivalRange}
                                        onChange={this.handleChange}
                                        validators={['required']}
                                        errorMessages={['Please select a value']}
                                        helperText="Select a time range"
                                    />
                                </React.Fragment>
                            }
                            {
                                this.state.dropCities &&
                                <React.Fragment>
                                    <h6>Cities</h6>
                                    <MultiAutocomplete
                                        name="cities"
                                        options={cities}
                                        initial={defaultCity}
                                        onChange={this.handleMultiSelectChange}
                                        max={MAX_CITIES}
                                    />
                                    <FormHelperText>Pick up to {MAX_CITIES} cities</FormHelperText>
                                </React.Fragment>
                            }
                            <React.Fragment>
                                <h6>Comment</h6>
                                <TextValidator
                                    name="comment"
                                    value={this.state.comment}
                                    onChange={this.handleChange}
                                    onBlur={this.trimText}
                                    validators={['maxStringLength:200']}
                                    errorMessages={['Characters allowed: 200 max']}
                                    helperText="Leave a note for the shopper"
                                    variant="outlined"
                                    margin="dense"
                                    rows="4"
                                    fullWidth
                                    multiline
                                />
                            </React.Fragment>
                        </div> : <CircularLoader />
                }
                <div className="progress-bar">
                    <Button
                        onClick={() => document.location.reload()}
                        variant="outlined"
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: 'auto' }}
                    >
                        Post
                    </Button>
                </div>
            </ValidatorForm >
        );
    }
}

export default FormPostTripPart3;