import React, { Component } from 'react';
// Components
import ProfilePicture from '../../components/blocks/profile/ProfilePicture';
import FormProfile from '../../components/forms/FormProfile';

class MyProfile extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  };

  render() {
    return (
      <React.Fragment>
        <ProfilePicture />
        <FormProfile />
      </React.Fragment>
    );
  }
}

export default MyProfile;