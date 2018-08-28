import React from 'react';
import { Navbar, NavItem, Icon, Modal } from 'react-materialize';

import { AdjustSaldoModal, HelpModal, CheckoutModal } from './modals.jsx';
import { saldoList } from 'common/constants';
import { serviceManager } from 'services';

export class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.userSubscription = null;

    // Services
    this.userService = serviceManager.getService('user');
  }

  componentDidMount() {
    this.updateProps(this.props);
  }

  componentWillReceiveProps(props) {
    this.updateProps(props);
  }

  updateProps(props) {
    if (this.userSubscription) { this.userSubscription.unsubscribe(); }

    if (props.user) {
      this.userSubscription = props.user.onChange().subscribe(() => {
        this.forceUpdate();
      });
    }
  }

  _onReload() {
    location.reload();
  }

  submitSaldo(diff) {
    this.userService.updateSaldo(this.props.user, diff).subscribe((a) => {
      Materialize.toast(
        `${Math.abs(a.amount)}kr ${(a.amount < 0 ? 'tatt ut' : 'satt inn')}`,
        1000
      );
    }, (err) => {
      Materialize.toast(err);
    });
  }

  render() {
    const user = this.props.user;

    const help = (
      <HelpModal
        key="help_modal"
        trigger={<NavItem><Icon>help_outline</Icon></NavItem>}
      />
    );

    let navitems = [
      <NavItem key="replay" onClick={this._onReload}><Icon>replay</Icon></NavItem>,
      help,
    ];


    const adjustSaldo =
      (<AdjustSaldoModal
        key={'adjust_saldo'}
        onSubmit={a => this.submitSaldo(a)}
        trigger={<NavItem key={'adjust'}><Icon>account_balance_wallet</Icon></NavItem>}
        saldoList={saldoList}
      />);

    if (user) {
      navitems = [
        adjustSaldo,
        help,
        <NavItem className="nav-user" key="user">
          <span>{user.fullname}</span>
          <small>{user.saldo} kr</small>
        </NavItem>,
        <NavItem key={'exit'} onClick={() => this.props.onExit()}>
          <Icon>exit_to_app</Icon>
        </NavItem>,
      ];
    }

    return (
      <div>
        {navitems}
      </div>
    );
  }
}
