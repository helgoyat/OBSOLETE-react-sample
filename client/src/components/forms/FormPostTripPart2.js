import React, { Component } from 'react';
// Material-UI
import { ValidatorForm } from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
// Components
import Dropdown from '../utils/Dropdown';
import MultiAutocomplete from '../utils/MultiAutocomplete';
import CircularLoader from '../layouts/CircularLoader';
// Utils
import { getJSON } from '../../utils/FunctionsJSON';
import { MAX_STORES } from '../../utils/Variables';
import { getAllStores } from '../../utils/FunctionsStores';

class FormPostTripPart2 extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.JSONdata = {
            JSONstores: [],
            JSONpackageSizes: [],
        };
        this.state = {
            ...this.JSONdata,
            stores: [{ value: 'ALL', label: 'ALL', isFixed: true }],
            packageSize: '',
            loading: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    componentDidMount() {
        this._isMounted = true;
        this.setState({ loading: true }, async () => {
            const JSONstores = await getAllStores();
            const JSONpackageSizes = await getJSON('package-sizes');
            if (this._isMounted) {
                this.setState({ JSONstores, JSONpackageSizes, loading: false });
            };
        });
    };

    componentWillUnmount() {
        this._isMounted = false;
    };

    handleChange(event) {
        const { name, value } = event.target;
        const val = (name === 'packageSize') ? parseInt(value) : value;
        this.setState({ [name]: val });
    };

    handleMultiSelectChange(value, name) {
        this.setState({ [name]: value });
    };

    handleSubmit() {
        const data = { ...this.state };
        data.stores = (data.stores[0].value === 'ALL') ?
            this.state.JSONstores.find(e => (e.value === this.props.fromCountry)).stores.map(e => (e._id)) : data.stores.map(e => (e.value));
        const hide = 'JSONstores JSONpackageSizes loading';
        hide.split(' ').forEach(function (prop) {
            delete data[prop];
        });
        this.props.handleSubmit(data, 3);
    };

    render() {
        // Display
        const { JSONstores, JSONpackageSizes } = this.state;
        const countryStores = JSONstores.find(e => (e.value === this.props.fromCountry));
        const stores = (countryStores !== undefined) && countryStores.stores.map(e => ({ value: e._id, label: e.name }));
        const packageSizes = JSONpackageSizes.map(e => ({ value: e.value, label: e.name }));

        return (
            <ValidatorForm
                onSubmit={this.handleSubmit}
                className="block basics"
                autoComplete="off"
            >
                <h4>Products</h4>
                {
                    !this.state.loading ?
                        <div className="container">
                            <React.Fragment>
                                <h6>From Stores</h6>
                                <MultiAutocomplete
                                    name="stores"
                                    options={stores}
                                    initial={{ value: 'ALL', label: 'ALL', fixed: true }}
                                    onChange={this.handleMultiSelectChange}
                                    max={MAX_STORES}
                                />
                                <FormHelperText>Pick up to {MAX_STORES} stores</FormHelperText>
                            </React.Fragment>
                            <React.Fragment>
                                <h6>Package Size</h6>
                                <Dropdown
                                    name="packageSize"
                                    list={packageSizes}
                                    value={this.state.packageSize}
                                    onChange={this.handleChange}
                                    validators={['required']}
                                    errorMessages={['Please select a value']}
                                    helperText="Select a range"
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
                        Next
                    </Button>
                </div>
            </ValidatorForm>
        );
    }
}

export default FormPostTripPart2;