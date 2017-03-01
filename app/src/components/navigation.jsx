import React from 'react';
import { render } from 'react-dom';
import { Navbar, NavItem, Icon, Modal } from 'react-materialize';
import { moneyList } from 'common/constants';

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
    this.refs.add_money_input.value = amount;
  }
  set saldoRemoveMoney(amount){
    this.remove_saldo = amount;

  }
  
  render () {
    
    let help = 
      <Modal
        key={"help_modal"}
        header="Allahu Akbar"
        trigger={<NavItem key={"help"}><Icon>help_outline</Icon></NavItem>}
      >
        <p>
          <h4>Hjelp</h4>
          <b>Hvordan legger jeg inn penger?</b>
          <p>
            Du kan legge inn penger manuelt på appen etter du har logget inn eller du kan legge til med ditt kredittkort på online.ntnu.no under min profil.
          </p>
          <b>Det er tomt for en vare, hva gjør jeg?</b>
          <p>Det er funksjonalitet for automatisk varsling under utvikling men foreløpig må du sende mail til trikom@online.ntnu.no.</p>
          <b>Jeg fant en feil, hva gjør jeg?</b>
          <p>Legg til en issue på github.com/dotKom/nibble/ eller send en mail til dotkom@online.ntnu.no</p>
        </p>
      </Modal>
    let navitems = [
        <NavItem key={"replay"} onClick={this._onReload}><Icon>replay</Icon></NavItem>,
        help
    ];
    let user = this.props.user;

    let moneyButtons = [];
    for(let o of moneyList){
      moneyButtons.push(<button className={`btn-large money-${o}`} onClick={() => this.saldoAddMoney = o}>{o} kr</button>)
    }
    let updateSaldo =
      <Modal
          key={"cash_modal"}
          header="Legg Til Penger"
          trigger={<NavItem key={"add"}><Icon>add</Icon> </NavItem>}
        >
          <p>
            <h5>Kontant</h5>
            <b>Legg kontant i pengekassa som står i kjøleskapet, så registrer samme beløp her!</b>

            <div className="radio-group">
              <button className="btn-large" onClick={() => this.enableCustom}>Velg eget beløp</button>
              <span ng-repeat="amount in cash_amounts track by $index">
                {moneyButtons}
              </span>
            </div>
            <div className="input-field col s6">
              <input ref="add_money_input" id="custom_amount" type="number" />
              <br />
            </div>
          </p>
      </Modal>


    if(user){
      navitems = [
        updateSaldo,
        <NavItem key={"remove"}><Icon>remove</Icon></NavItem>,
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
