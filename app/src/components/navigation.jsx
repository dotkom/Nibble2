import React from 'react';
import { Navbar, NavItem, Icon, Modal } from 'react-materialize';

import { AddSaldoModal, HelpModal, RemoveSaldoModal, CheckoutModal } from './modals.jsx';
import { saldoList } from 'common/constants';

import { userService } from 'services/user';


export class Navigation extends React.Component {
  
  constructor(props){
    super(props);
    this.add_saldo = 0;
    this.remove_saldo = 0;
    this.add_enableCustom = true;
    this.remove_enableCustom = true;
    this.userSubscription = null;
  }

  componentDidMount(){
    this.updateProps(this.props);
  }

  componentWillReceiveProps(props){
    this.updateProps(props);
  }

  updateProps(props){
    if(this.userSubscription)
      this.userSubscription.unsubscribe();
    
    if(props.user)
      this.userSubscription = props.user.onChange().subscribe(() => {
        this.forceUpdate();
      })
  }

  _onReload(){
    location.reload();
  }
  
  submitSaldo(diff){
    userService.updateSaldo(this.props.user, diff);
  }
  
  render () {

    let user = this.props.user;

    let help = <HelpModal key="help_modal" trigger={<NavItem><Icon>help_outline</Icon></NavItem>}/>;
    let navitems = [
      <NavItem key="replay" onClick={this._onReload}><Icon>replay</Icon></NavItem>,
      help
    ];
    
    
    let addSaldo = 
      <AddSaldoModal 
        key={"add_saldo"}
        onSubmit={ (a) => this.submitSaldo(a) } 
        trigger={<NavItem key={"add"}><Icon>add</Icon><Icon>attach_money</Icon></NavItem>}
        saldoList={saldoList} />;
    
    let removeSaldo = 
      <RemoveSaldoModal
        key={"remove_saldo"}
        onSubmit={ (a) => this.submitSaldo(a) } 
        trigger={<NavItem key={"remove"}><Icon>remove</Icon><Icon>attach_money</Icon></NavItem>} 
        saldoList={saldoList} />;
    
    if(user){
      navitems = [
        addSaldo,
        removeSaldo,
        help,
        <NavItem className="nav-user" key="user">
          <span>{user.fullname}</span>
          <small>{user.saldo} kr</small>
        </NavItem>,
        <NavItem key={"exit"} onClick={() => this.props.onExit()}><Icon>exit_to_app</Icon></NavItem>
      ];
    }

    return (
      <div>
        {navitems}
      </div>
    );
  }
}
