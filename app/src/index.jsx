import React from 'react';
import { render } from 'react-dom';

import { 
  serviceManager, 
  InventoryServiceProvider, 
  OrderServiceProvider, 
  UserServiceProvider, 
  DevUserSerivce,
  DevInventoryServiceProvider,
  DevOrderServiceProvider, 
  HttpServiceProvider } from 'services';
import { MOCK } from 'common/constants.js';

import { App } from 'components/App.jsx';




if(!MOCK){
  serviceManager.registerService("default.inventory", InventoryServiceProvider);
  serviceManager.registerService("default.order", OrderServiceProvider);
  serviceManager.registerService("default.user", UserServiceProvider);

  serviceManager.alias("inventory","default.inventory");
  serviceManager.alias("order","default.order");
  serviceManager.alias("user","default.user");
}else{
  serviceManager.registerService("mock.inventory", DevInventoryServiceProvider);
  serviceManager.registerService("mock.order", DevOrderServiceProvider);
  serviceManager.registerService("mock.user", DevUserSerivce);

  serviceManager.alias("inventory","mock.inventory");
  serviceManager.alias("order","mock.order");
  serviceManager.alias("user","mock.user");  
}


render(<App />, document.getElementById('app'));