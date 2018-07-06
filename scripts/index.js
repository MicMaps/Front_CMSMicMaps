import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from './App';
import NewMic from './components/newMic';
import Header from './components/header';
import MicEntry from './components/micEntry';
import EditMic from './components/editMic';
import Login from './components/login';
import Ambassadors from './components/Ambassadors';
import AddAmbassador from './components/AddAmbassador';
import Users from './components/Users';
import UserMicDetails from './components/UserMicDetails';
import AmbassadorMicDetails from './components/AmbassadorMicDetails';
import AmbassadorUsers from './components/AmbassadorUsers';
import UserPush from './components/UserPush';

render(
  <BrowserRouter>
    <div>
    <Switch>
      {/*<Header title='Admin Panel' />*/}
      <Route exact path='/' component={Login} />
      {/*<Route exact path='/' component={App} />*/}
      <Route path='/List' component={App} />
      <Route path='/AddMic' component={NewMic} />
      <Route path='/Mic/:MicId' component={MicEntry} />
      <Route path='/Edit/:MicId' component={EditMic} />
      <Route exact path='/Ambassadors' component={Ambassadors} />

      <Route path='/Ambassadors/:id/users' component={AmbassadorUsers} />
      <Route path='/Ambassadors/:id' component={AmbassadorMicDetails} />
      <Route path='/AddAmbassadors' component={AddAmbassador} />
      <Route exact path='/Users' component={Users} />
      <Route path='/Users/:id' component={UserMicDetails} />
      <Route path='/push-notifications' component={UserPush} />
    </Switch>
    </div>
  </BrowserRouter>
  , document.getElementById('root')
);
