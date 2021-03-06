import React, { Component } from 'react';
// Packages
import { ValidatorForm } from 'react-material-ui-form-validator';
// Material-UI
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
// Components
import Autocomplete from '../../utils/Autocomplete';
import MultiAutocomplete from '../../utils/MultiAutocomplete';
import Checkboxes from '../../utils/Checkboxes';
import CircularLoader from '../../layouts/CircularLoader';
// Utils
import { getJSON, getOneJSON, getTwoJSON } from '../../../utils/FunctionsJSON';
import { MAX_CITIES, MAX_STORES } from '../../../utils/Variables';
import { getAllStores } from '../../../utils/FunctionsStores';

class OrdersFilter extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.JSONdata = {
            JSONairports: [],
            JSONstores: [],
            JSONcities: [],
            JSONairport: {},
        };
        this.initialItinerary = {
            fromCountry: '',
            fromAirport: '',
            toCountry: '',
            toAirport: '',
        };
        this.initialState = {
            cities: [],
            stores: [{ value: 'ALL', label: 'ALL', isFixed: true }],
            dropAirport: false,
            dropCities: false,
            checkError: false,
        };
        this.state = {
            ...this.JSONdata,
            ...this.initialItinerary,
            ...this.initialState,
            loading: false,
            reloadStores: false,
            reloadCities: false,
            expanded: true,
        };
        this.handlePanelChange = this.handlePanelChange.bind(this);
        this.handleDownshiftChange = this.handleDownshiftChange.bind(this);
        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    componentDidMount() {
        this._isMounted = true;
        this.setState({ loading: true }, async () => {
            const JSONairports = await getJSON('airports');
            const JSONstores = await getAllStores();
            if (this._isMounted) {
                this.setState({ JSONairports, JSONstores, loading: false });
            };
        });
    };

    componentWillUnmount() {
        this._isMounted = false;
    };

    handlePanelChange(event, expanded) {
        this.setState({ expanded: expanded });
    };

    handleDownshiftChange(name, value) {
        if (name === 'fromAirport') {
            this.setState({ reloadStores: true }, async () => {
                const fromCountry = value ? this.state.JSONairports.find(e => e.value === value).country : '';
                this.setState({
                    fromCountry: fromCountry,
                    fromAirport: value,
                    stores: [...this.initialState.stores],
                    reloadStores: false,
                });
            });
        };
        if (name === 'toAirport') {
            this.setState({ reloadCities: true }, async () => {
                if (value) {
                    const toCountry = this.state.JSONairports.find(e => e.value === value).country;
                    const JSONcities = await getOneJSON('country-cities', toCountry);
                    const JSONairport = await getTwoJSON('airport', toCountry, value);
                    const defaultCity = { value: JSONairport.location, label: `${JSONairport.location} (${JSONairport.state})`, state: JSONairport.state };
                    if (this._isMounted) {
                        this.setState({
                            toCountry: toCountry,
                            toAirport: value,
                            cities: [defaultCity],
                            JSONairport: JSONairport,
                            JSONcities: JSONcities,
                            reloadCities: false,
                        });
                    };
                } else {
                    this.setState({
                        toCountry: '',
                        toAirport: '',
                        reloadCities: false,
                    });
                };
            });
        };
    };

    handleCheckChange(event) {
        const { name, checked } = event.target;
        this.setState({ [name]: checked });
        if (name === 'dropCities') {
            const { JSONairport } = this.state;
            const defaultCity = { value: JSONairport.location, label: `${JSONairport.location} (${JSONairport.state})`, state: JSONairport.state };
            this.setState({ cities: [defaultCity] });
        };
        // Remove checkboxes errors
        if (this.state.checkError) {
            this.setState({ checkError: false });
        };
    };

    handleMultiSelectChange(value, name) {
        this.setState({ [name]: value });
    };

    handleReset() {
        this.setState({ loading: true }, () => {
            this.setState({
                ...this.initialItinerary,
                ...this.initialState,
                loading: false
            });
            this.props.handleReset();
        });
    };

    handleSubmit(event) {
        event.preventDefault();
        if (!this.state.dropAirport && !this.state.dropCities) {
            this.setState({ checkError: true });
        } else {
            if (!this.state.checkError && !this.state.reloadCities && !this.state.reloadStores) {
                this.setState({ expanded: false }, () => {
                    const result = { ...this.state };
                    result.stores = (result.stores[0].value === 'ALL') ?
                        this.state.JSONstores.find(e => (e.value === result.fromCountry)).stores.map(e => (e._id)) : result.stores.map(e => (e.value));
                    result.cities = result.cities.map(e => ({ value: e.value, state: e.state }));
                    const hide = 'JSONairports JSONstores JSONairport JSONcities loading reloadStores reloadCities checkError expanded';
                    hide.split(' ').forEach(function (prop) {
                        delete result[prop];
                    });
                    this.props.handleSubmit(result);
                });
            };
        };
    };

    render() {
        const checkboxes = [
            { name: 'dropAirport', value: this.state.dropAirport, label: 'Airport', color: 'primary' },
            { name: 'dropCities', value: this.state.dropCities, label: 'Cities', color: 'primary' },
        ];
        // Display
        const { JSONairports, JSONairport, JSONstores, JSONcities } = this.state;
        const airports = JSONairports.map(e => ({
            value: e.value,
            label: `${e.name} (${e.value}) - ${e.country}`,
            country: e.country
        }));
        const stores = this.state.fromCountry ?
            JSONstores.find(e => (e.value === this.state.fromCountry)).stores.map(e => ({ value: e._id, label: e.name })) : [];
        const cities = this.state.toAirport ?
            JSONcities.map(e => ({ value: e.value, label: `${e.value} (${e.state})`, state: e.state })) : [];
        const defaultCity = this.state.toAirport ?
            { value: JSONairport.location, label: `${JSONairport.location} (${JSONairport.state})`, state: JSONairport.state } : {};
        // // Boolean
        const isItinerary = (this.state.fromCountry && this.state.fromAirport && this.state.toCountry && this.state.toAirport) ? true : false;
        const isDisabled = (!isItinerary || (!this.state.dropCities && !this.state.dropAirport)) ? true : false;

        return (
            <ExpansionPanel
                onChange={this.handlePanelChange}
                expanded={this.state.expanded}
                style={{ width: '450px', margin: 'auto', marginBottom: 10, boxShadow: 'none' }}
            >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon style={{ color: '#fff' }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography><b>SEARCH</b></Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ backgroundColor: '#fff', borderBottom: '4px solid #dddddd' }}>
                    <div style={{ width: '100%' }}>
                        <ValidatorForm onSubmit={this.handleSubmit} autoComplete="off">
                            {
                                !this.state.loading ?
                                    <React.Fragment>
                                        <React.Fragment>
                                            <h6>Traveling From</h6>
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
                                            <h6>Arriving To</h6>
                                            <Autocomplete
                                                name="toAirport"
                                                options={airports}
                                                value={this.state.toAirport}
                                                onChange={this.handleDownshiftChange}
                                                validators={['required']}
                                                errorMessages={['Please select a value']}
                                            />
                                        </React.Fragment>
                                        {
                                            isItinerary &&
                                            <div style={{ marginBottom: '20px' }}>
                                                <React.Fragment>
                                                    <h6>Shop at</h6>
                                                    {
                                                        !this.state.reloadStores ?
                                                            <MultiAutocomplete
                                                                name="stores"
                                                                options={stores}
                                                                initial={{ value: 'ALL', label: 'ALL', fixed: true }}
                                                                onChange={this.handleMultiSelectChange}
                                                                max={MAX_STORES}
                                                            /> : <div style={{ margin: '10px 0px', fontStyle: 'italic' }}>Loading...</div>
                                                    }
                                                    <FormHelperText>Pick up to {MAX_STORES} stores</FormHelperText>
                                                </React.Fragment>
                                                <div style={{ marginTop: 15 }}>
                                                    <h6>Delivery Preferences</h6>
                                                    <Checkboxes
                                                        checkboxes={checkboxes}
                                                        onChange={this.handleCheckChange}
                                                        error={this.state.checkError}
                                                        helperText="Select at least one of the two"
                                                    />
                                                </div>
                                                {
                                                    this.state.dropCities &&
                                                    <React.Fragment>
                                                        <h6>Cities</h6>
                                                        {
                                                            !this.state.reloadCities ?
                                                                <MultiAutocomplete
                                                                    name="cities"
                                                                    options={cities}
                                                                    initial={defaultCity}
                                                                    onChange={this.handleMultiSelectChange}
                                                                    max={MAX_CITIES}
                                                                /> : <div style={{ margin: '10px 0px', fontStyle: 'italic' }}>Loading...</div>
                                                        }
                                                        <FormHelperText>Pick up to {MAX_CITIES} cities</FormHelperText>
                                                    </React.Fragment>
                                                }
                                            </div>
                                        }
                                    </React.Fragment> : <CircularLoader />
                            }
                            <div style={{ textAlign: 'right', marginTop: '15px' }}>
                                <Button onClick={this.handleReset} variant="outlined" color="primary">Reset</Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    style={{ marginLeft: '4px' }}
                                    disabled={isDisabled}
                                >
                                    Apply
                                </Button>
                            </div>
                        </ValidatorForm>
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

export default OrdersFilter;