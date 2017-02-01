import React from 'react';
import { render } from 'react-dom';
import { Navbar,NavItem,Icon } from 'react-materialize';


export class Navigation extends React.Component {
  
  _onReload(){
    location.reload();
  }

  
  render () {
    return (
      <div>
        <NavItem onClick={this._onReload}><Icon>replay</Icon></NavItem>
        <NavItem><Icon>add</Icon></NavItem>
        <NavItem><Icon>remove</Icon></NavItem>
        <NavItem><Icon>help_outline</Icon></NavItem>
        <NavItem><Icon>exit_to_app</Icon></NavItem>
      </div>
    )
  }
}
