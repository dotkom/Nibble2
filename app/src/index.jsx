import React from 'react';
import {render} from 'react-dom';
import {Navbar,NavItem,Icon} from 'react-materialize';
import http from 'services/net';
import inventory from 'services/inventory';




class App extends React.Component {
  render () {
    const brand = <span><img className="logo" src="./assets/images/favicon.png"/>Nibble</span>

    return (
      <Navbar brand={brand} right>
        <NavItem><Icon>replay</Icon></NavItem>
        <NavItem><Icon>add</Icon></NavItem>
        <NavItem><Icon>remove</Icon></NavItem>
        <NavItem><Icon>help_outline</Icon></NavItem>
        <NavItem><Icon>exit_to_app</Icon></NavItem>
      </Navbar>
    )
  }
}

render(<App/>, document.getElementById('app'));