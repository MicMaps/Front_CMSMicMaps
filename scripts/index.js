import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from './App';
import NewMic from './components/newMic';
import Header from './components/header';
import MicEntry from './components/micEntry';
import EditMic from './components/editMic';
import Login from './components/login';

render(
  <BrowserRouter>
    <div>
      {/*<Header title='Admin Panel' />*/}
      <Route exact path='/' component={Login} />
      {/*<Route exact path='/' component={App} />*/}
      <Route path='/List' component={App} />
      <Route path='/AddMic' component={NewMic} />
      <Route path='/Mic/:MicId' component={MicEntry} />
      <Route path='/Edit/:MicId' component={EditMic} />
    </div>
  </BrowserRouter>
  , document.getElementById('root')
);
