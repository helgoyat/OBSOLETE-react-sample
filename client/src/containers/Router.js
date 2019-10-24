import React, { Component } from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';
// Pages
import PostTrip from './pages/PostTrip';
import Trips from './pages/Trips';
import MyProfile from './pages/MyProfile';

class Router extends Component {
    render() {
        return (
            <div className="content">
                <Switch>
                    <Route exact path='/post-trip' component={PostTrip} />
                    <Route exact path='/trips' component={Trips} />
                    <Route exact path='/account/my-profile' component={MyProfile} />
                </Switch>
            </div>
        )
    }
}

export default Router;