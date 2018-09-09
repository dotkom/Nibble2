import React from 'react';
import { Navbar, NavItem, Icon } from 'react-materialize';
import { API_BASE } from 'common/constants';
import { http } from 'services/net';
import 'common/lang';
import { Navigation } from 'components/Navigation.jsx';
import { Observable, Subject } from 'rxjs';
import { LoginView, ShopView } from 'components/views';

import { User } from 'services/user/user';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loginState: 0,
    };
  }

  submitLogin(user) {
    this.setState(Object.assign(this.state, {
      user,
    }));
  }

  submitLogout() {
    this.setState(Object.assign(this.state, {
      user: null,
    }));
  }

  render() {
    const brand = (
      <span>
        <img
          alt="Nibble2 logo" className="logo"
          src="./assets/images/favicon.png"
        />
        Nibble
      </span>
    );

    const currentView = (this.state.user == null) ?
      (<LoginView
        onSubmit={user => this.submitLogin(user)}
      />) :
      (<ShopView
        user={this.state.user}
        onExit={() => this.submitLogout()}
      />);

    return (
      <div>
        <div className="navbar-fixed">
          <Navbar brand={brand} right>
            <Navigation
              user={this.state.user}
              onExit={() => this.submitLogout()}
            />
          </Navbar>
        </div>
        {currentView}
      </div>
    );
  }
}
