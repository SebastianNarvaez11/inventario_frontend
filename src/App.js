import React from 'react';
import { Provider } from 'react-redux'
import store from './redux/store'
import Router from './router/Router'
import { initAxiosInterceptors } from './helpers/helper'
import './assets/css/sidebar.css'

initAxiosInterceptors()

function App() {
  return (
    <Provider store={store} >
      <Router />
    </Provider>
  );
}

export default App;
