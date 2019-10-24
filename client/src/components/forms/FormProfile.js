import React, { Component } from 'react';
// Packages
import Moment from 'moment';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
// Material-UI
import Button from '@material-ui/core/Button';
// Components
import Dropdown from '../utils/Dropdown';
import DatePickerBirthday from '../utils/DatePickerBirthday';
import Snackbar from '../layouts/Snackbar';
import CircularLoader from '../layouts/CircularLoader';
// Utils
import { getJSON } from '../../utils/FunctionsJSON';
import { getMyProfile, updateMyProfile } from '../../utils/FunctionsUsers';

class FormProfile extends Component {
  _isMounted = false;

  constructor() {
    super();
    this.JSONdata = {
      JSONworldCountries: [],
    };
    this.initialState = {
      firstname: '',
      lastname: '',
      country: '',
      birthday: Moment().format(),
      bio: '',
    };
    this.state = {
      ...this.JSONdata,
      ...this.initialState,
      completed: false,
      reloadDate: false,
      readOnly: true,
      success: null,
      loading: false
    };
    this.loadExistingProfile = this.loadExistingProfile.bind(this);
    this.trimText = this.trimText.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  componentDidMount() {
    this._isMounted = true;
    this.setState({ loading: true }, async () => {
      const JSONworldCountries = await getJSON('world-countries');
      this.loadExistingProfile();
      if (this._isMounted) {
        this.setState({ JSONworldCountries, loading: false });
      };
    });
  };

  componentWillUnmount() {
    this._isMounted = false;
  };

  async loadExistingProfile() {
    const profile = await getMyProfile();
    if (profile.completed) {
      if (this._isMounted) {
        this.setState({ reloadDate: true }, () => {
          this.setState({
            completed: true,
            firstname: profile.firstname,
            lastname: profile.lastname,
            country: profile.country,
            birthday: Moment(profile.birthday).format(),
            bio: profile.bio,
            reloadDate: false
          });
        });
      };
    };
  };

  trimText(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value.trim() });
  };

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleDateChange(fullDate) {
    this.setState({ birthday: fullDate });
  };

  async handleSubmit() {
    const data = { ...this.state };
    const isSuccess = await updateMyProfile(data);
    if (!isSuccess) {
      this.loadExistingProfile();
    };
    this.setState({ readOnly: true, success: isSuccess });
  };

  render() {
    // Display
    const countries = this.state.JSONworldCountries.map(e => ({ value: e.value, label: e.name }));

    return (
      <ValidatorForm
        onSubmit={this.handleSubmit}
        className="block basics"
        autoComplete="off"
      >
        <h4>Details</h4>
        {
          !this.state.loading ?
            <React.Fragment>
              <div className="container">
                <h6>Firstname</h6>
                <TextValidator
                  name="firstname"
                  value={this.state.firstname}
                  onChange={this.handleChange}
                  onBlur={this.trimText}
                  disabled={this.state.readOnly}
                  validators={['required', 'maxStringLength:60']}
                  errorMessages={['Please enter a value', 'Characters allowed: 60 max']}
                  variant="outlined"
                  margin="dense"
                  fullWidth
                />
                <h6>Lastname</h6>
                <TextValidator
                  name="lastname"
                  value={this.state.lastname}
                  onChange={this.handleChange}
                  onBlur={this.trimText}
                  disabled={this.state.readOnly}
                  validators={['required', 'maxStringLength:60']}
                  errorMessages={['Please enter a value', 'Characters allowed: 60 max']}
                  variant="outlined"
                  margin="dense"
                  fullWidth
                />
                <h6>Birthday</h6>
                {
                  !this.state.reloadDate &&
                  <DatePickerBirthday
                    initial={this.state.birthday}
                    handleDateChange={this.handleDateChange}
                    disabled={this.state.readOnly}
                  />
                }
                <h6>Country</h6>
                <Dropdown
                  name="country"
                  list={countries}
                  value={this.state.country}
                  onChange={this.handleChange}
                  disabled={this.state.readOnly}
                  validators={['required']}
                  errorMessages={['Please select a value']}
                  helperText="Where you mainly live"
                />
                <h6>Bio</h6>
                <TextValidator
                  name="bio"
                  value={this.state.bio}
                  onChange={this.handleChange}
                  onBlur={this.trimText}
                  disabled={this.state.readOnly}
                  validators={['maxStringLength:200']}
                  errorMessages={['Characters allowed: 200 max']}
                  helperText="Let others know about yourself"
                  variant="outlined"
                  margin="dense"
                  rows="4"
                  fullWidth
                  multiline
                />
              </div>
              {
                (this.state.success !== null) &&
                <div className="container" style={{ paddingBottom: 2 }}>
                  <Snackbar success={this.state.success} />
                </div>
              }
              <div className="progress-bar">
                <Button
                  onClick={() => this.setState({ readOnly: false })}
                  variant="outlined"
                  color="primary"
                  disabled={!this.state.readOnly}
                  style={{ marginLeft: 'auto' }}
                >
                  Edit
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={this.state.readOnly}
                  style={{ marginLeft: '4px' }}
                >
                  Save
                </Button>
              </div>
            </React.Fragment> : <CircularLoader />
        }
      </ValidatorForm>
    );
  }
}

export default FormProfile;