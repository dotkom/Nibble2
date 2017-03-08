import React from 'react';
import { Navbar, NavItem, Icon, Modal } from 'react-materialize';

import { AddSaldoModal, HelpModal, RemoveSaldoModal, CheckoutModal } from './modals.jsx';
import { saldoList } from 'common/constants';


export class Navigation extends React.Component {
  
  constructor(props){
    super(props);
    this.add_saldo = 0;
    this.remove_saldo = 0;
    this.add_enableCustom = true;
    this.remove_enableCustom = true;
  }


  _onReload(){
    location.reload();
  }
  
  set saldoAddMoney(amount){
    this.add_saldo = amount;
    this.add_enableCustom = false;
    this.refs.add_money_input.value = amount;
    this.setState({})
  }
  set saldoRemoveMoney(amount){
    this.remove_saldo = amount;

  }
  
  render () {
    let user = this.props.user;

    let help = <HelpModal trigger={<NavItem onClick={(a) => {console.log}}><Icon>help_outline</Icon></NavItem>}/>;
    let navitems = [
        <NavItem key={"replay"} onClick={this._onReload}><Icon>replay</Icon></NavItem>,
        help
    ];
    
    
    let addSaldo = <AddSaldoModal onSubmit={console.log} trigger={<NavItem key={"add"}><Icon>add</Icon></NavItem>} saldoList={saldoList} />;
    let removeSaldo = <RemoveSaldoModal onSubmit={console.log} trigger={<NavItem key={"remove"}><Icon>remove</Icon></NavItem>} saldoList={saldoList} />;
    let checkoutTest = <CheckoutModal 
      onSubmit={console.log} 
      status="await" 
      trigger={<NavItem key={"checkout"}>Checkout</NavItem>}
      orders={[{item:{name:"test",price:-1},qty:10}]}/>;

    if(user){
      navitems = [
        checkoutTest,
        addSaldo,
        removeSaldo,
        help,
        <NavItem className="nav-user" key={"user"}>
          <span>{user.fullname} </span>
          <small>{user.saldo}kr</small>
        </NavItem>,
        <NavItem key={"exit"} onClick={() => this.props.onExit()}><Icon>exit_to_app</Icon></NavItem>
      ];
    }

    return (
      <div>
        {navitems}
      </div>
    )
  }
}
