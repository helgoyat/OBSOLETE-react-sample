import React, { Component } from 'react';
// Packages
import Lodash from 'lodash';
// import PictureEncoder from 'base64-arraybuffer';
// Material-UI
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Person from '@material-ui/icons/Person';
// Components
import Snackbar from '../../layouts/Snackbar';
import CircularLoader from '../../layouts/CircularLoader';
// Utils
import { getMyPicture, updateMyPicture } from '../../../utils/FunctionsUsers';

class ProfilePicture extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = {
            img: false,
            type: '',
            url: '',
            readOnly: true,
            error: false,
            errorMsg: '',
            success: null,
            loading: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    componentDidMount() {
        this._isMounted = true;
        this.setState({ loading: true }, async () => {
            const picture = await getMyPicture();
            if (!Lodash.isEmpty(picture)) {
                // const data = PictureEncoder.encode(picture.data);
                const contentType = picture.contentType;
                const url = "data:" + contentType + ";base64," + picture.data;
                if (this._isMounted) {
                    this.setState({ img: true, url, type: contentType });
                };
            };
            if (this._isMounted) {
                this.setState({ loading: false });
            };
        });
    };

    componentWillUnmount() {
        this._isMounted = false;
    };

    handleChange = (event) => {
        const file = event.target.files[0];
        if (file !== undefined) {
            if ((file.type !== 'image/jpeg') && (file.type !== 'image/png')) {
                this.setState({
                    img: false,
                    type: '',
                    url: '',
                    error: true,
                    errorMsg: "Invalid file type",
                });
            } else {
                if (file.size <= 200000) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e) => {
                        this.setState({
                            img: true,
                            type: file.type,
                            url: e.target.result,
                            error: false,
                            errorMsg: '',
                        });
                    };
                } else {
                    this.setState({
                        img: false,
                        type: '',
                        url: '',
                        error: true,
                        errorMsg: "Invalid file size",
                    });
                };
            };
        };
    };

    async handleSubmit() {
        const data = {
            type: this.state.type,
            url: this.state.url
        };
        const isSuccess = await updateMyPicture(data);
        this.setState({ readOnly: true, success: isSuccess });
    };

    render() {
        return (
            <div
                className="block basics"
                style={{ marginBottom: 20 }}
            >
                <h4>Picture</h4>
                {
                    !this.state.loading ?
                        <React.Fragment>
                            <div className="container" style={{ padding: '10px 10px', backgroundColor: '#fdfdfd' }}>
                                {
                                    this.state.img ?
                                        <Avatar src={this.state.url} alt="avatar" className="avatar" /> :
                                        <Avatar alt="avatar" className="avatar">
                                            <Person className="empty-avatar" />
                                        </Avatar>
                                }
                                {
                                    this.state.error && <div className="error">{this.state.errorMsg}</div>
                                }
                                {
                                    !this.state.readOnly &&
                                    <div className="info" style={{ marginTop: 20, textAlign: 'right' }}>Accepted files: max. 200 KB and jpeg or png images.</div>
                                }
                            </div>
                            {
                                (this.state.success !== null) &&
                                <div className="container" style={{ paddingBottom: 2 }}>
                                    <Snackbar success={this.state.success} />
                                </div>
                            }
                            <div className="progress-bar" style={{ paddingTop: 10, backgroundColor: '#fdfdfd', borderTop: 'none' }}>
                                {
                                    !this.state.readOnly &&
                                    <input
                                        accept="image/*"
                                        id="contained-button-file"
                                        style={{ display: 'none' }}
                                        onChange={this.handleChange}
                                        type="file"
                                    />
                                }
                                {
                                    this.state.readOnly ?
                                        <Button
                                            onClick={() => this.setState({ readOnly: false })}
                                            variant="outlined"
                                            color="secondary"
                                            style={{ marginLeft: 'auto' }}
                                        >
                                            Edit
                                        </Button> :
                                        <label htmlFor="contained-button-file" style={{ marginLeft: 'auto' }}>
                                            <Button
                                                component="span"
                                                variant="outlined"
                                                color="secondary"
                                            >
                                                Upload
                                            </Button>
                                        </label>
                                }
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.handleSubmit}
                                    disabled={!this.state.img || this.state.readOnly}
                                    style={{ marginLeft: '4px' }}
                                >
                                    Save
                                </Button>
                            </div>
                        </React.Fragment> : <CircularLoader />
                }
            </div>
        )
    }
}

export default ProfilePicture;