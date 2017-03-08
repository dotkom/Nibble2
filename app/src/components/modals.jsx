import React from 'react';
import { Navbar, NavItem, Icon, Modal, Button, Row, Col } from 'react-materialize';




/*Proxy in order to fire click events*/
/**
 * props:
 *  proxy : callforward, an Observable
 */
export class ClickProxy extends React.Component{
  constructor(props){
    super(props);
  }
  
  componentDidMount(){
    if(this.props.proxy){
      this.sub = this.props.proxy.subscribe(() => {
        this.props.onClick(new MouseEvent("PROXY_CLICK"));
      });
    }
  }
  componentWillUnmount(){
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  render(){
    return <NavItem onClick={(a) => {console.log(a)}}><Icon>help_outline</Icon></NavItem>
  }
}


/**
 * props:
 *  trigger
 */
export const HelpModal = (props) => {
  return (<Modal
    key={"help_modal"}
    header="Hjelp"
    trigger={props.trigger}
  >
    <div>
      <b>Hvordan legger jeg inn penger?</b>
      <p>
        Du kan legge inn penger manuelt på appen etter du har logget inn eller du kan legge til med ditt kredittkort på online.ntnu.no under min profil.
      </p>
      <b>Det er tomt for en vare, hva gjør jeg?</b>
      <p>Det er funksjonalitet for automatisk varsling under utvikling men foreløpig må du sende mail til trikom@online.ntnu.no.</p>
      <b>Jeg fant en feil, hva gjør jeg?</b>
      <p>Legg til en issue på github.com/dotKom/nibble/ eller send en mail til dotkom@online.ntnu.no</p>
    </div>
  </Modal>);
}

/**
 * props:
 *  trigger : node
 *  saldoList : [50,200,300]
 *  submit : callback
 */
export class AddSaldoModal extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      inval: 0,
      indisable: false
    }
  }

  inputChange(event){
    this.setValue(event.target.value);
  }

  setValue(amount,disable){
    this.setState(Object.assign(this.state,{
      inval: amount==null ? this.state.inval : amount,
      indisable: disable==null ? this.state.indisable : disable
    }));
  }

  render(){
    let moneyButtons = [];
    for(let i in this.props.saldoList){
      let amount = this.props.saldoList[i];
      moneyButtons.push(<Button key={i} large className={`money-${amount}`} onClick={() => this.setValue(amount,true)}>{amount} kr</Button>)
    }


    let inputAmount = 0;
    let inField = <input value={this.state.inval} disabled={this.state.indisable} onChange={(a) => this.inputChange(a)} type="number" />;
    const changeInput = (amount) => {
      inputAmount = amount;
    }

  
    return (
      <Modal
        key={"cash_modal"}
        header="Legg Til Penger"
        trigger={this.props.trigger}
        actions={[
          <Button waves='light' modal='close'>Avbryt</Button>,
          <Button onClick={() => {this.props.onSubmit(this.state.inval)}} modal='close'>Sett inn</Button>]}
      >
        <div>
          <h5>Kontant</h5>
          <b>Legg kontant i pengekassa som står i kjøleskapet, så registrer samme beløp her!</b>

          <div className="radio-group">
            <Button onClick={() => this.setValue(null,false)}>Velg eget beløp</Button>
            <span>
              {moneyButtons}
            </span>
          </div>
          <div className="input-field col s6">
            <br />
            {inField}
          </div>
        </div>
      </Modal>
    );
  }
}

/**
 * props:
 *  trigger : node
 *  onSubmit : callback
 *  saldoList : list of selectable saldos
 */
export class RemoveSaldoModal extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      inval: 0,
      indisable: false
    }
  }

  inputChange(event){
    this.setValue(event.target.value);
  }

  setValue(amount,disable){
    this.setState(Object.assign(this.state,{
      inval: amount==null ? this.state.inval : amount,
      indisable: disable==null ? this.state.indisable : disable
    }));
  }

  render(){
    let moneyButtons = [];
    for(let i in this.props.saldoList){
      let amount = this.props.saldoList[i];
      moneyButtons.push(<Button key={i} large className={`money-${amount}`} onClick={() => this.setValue(amount,true)}>{amount} kr</Button>)
    }


    let inputAmount = 0;
    let inField = <input value={this.state.inval} disabled={this.state.indisable} onChange={(a) => this.inputChange(a)} type="number" />;
    const changeInput = (amount) => {
      inputAmount = amount;
    }

    return (
      <Modal
        key={"cash_modal"}
        header="Legg Til Penger"
        trigger={this.props.trigger}
        actions={[
          <Button waves='light' modal='close'>Avbryt</Button>,
          <Button onClick={() => this.props.onSubmit(this.state.inval)} modal='close'>Ta ut</Button>
        ]}
      >
        <div>
          <h5>Kontant</h5>
          <b>Velg beløpet du ønsker å ta ut, så ta pengene fra pengekassa i kjøleskapet!</b>
          <div className="radio-group">
            <Button onClick={() => this.setValue(null,false)}>Velg eget beløp</Button>
            <span>
              { moneyButtons }
            </span>
          </div>
          <div className="input-field col s6">
            <br />
            { inField }
          </div>
        </div>
      </Modal>
    );
  }
}

/*
<div class="modal-content valign-wrapper row">
        <div class="valign center-align col s12">
          <!--<i class="material-icons large-icon green-text">check_circle</i>-->

          <div class="checkmark">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" x="0px" y="0px" viewBox="0, 0, 100, 100" id="checkmark">
                  <g transform="">
                    <circle class="path" fill="none" stroke="#7DB0D5" stroke-width="4" stroke-miterlimit="10" cx="50" cy="50" r="44"/>
                      <circle class="fill" fill="none" stroke="#7DB0D5" stroke-width="4" stroke-miterlimit="10" cx="50" cy="50" r="44"/>
                    <polyline class="check" fill="none" stroke="#7DB0D5" stroke-width="8" stroke-linecap="square" stroke-miterlimit="10" points="70,35 45,65 30,52  "/>
                  </g>
              </svg>
          </div>

          <h4 class="thinner" id="order-status">Handel fullført</h4>
          <h5>
            <div class="row">
              <div ng-repeat="element in shopQueue track by $index">
                <span class="col s6 bold right-align padd">
                {{ element.item.name }}
                </span>
                <span class="col s6 thinner left-align padd">
                  {{ element.quantity }} x {{ element.item.price }},-
                </span>
              </div>
            </div>
          </h5>
          <h5 class="thinner grey-text darken-2">
            <b>{{ user.balance }}kr</b> igjen
          </h5>
        </div>
      </div>
      <div class="modal-footer">
          <a href ng-click="newOrder()" class="modal-action modal-close waves-effect btn-flat">Ny handel</a>
          <a ng-click="logout()" class="modal-action modal-close waves-effect btn blue-grey darken-1">Logg ut nå ({{ceil(logoutTimer)}})</a>
      </div> 
*/



/**
 * props:
 *  trigger : node
 *  onSubmit : callback
 *  orders : list of orders
 *  balance : money left after purchase
 */
export class CheckoutModal extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    let svgClass = ({
      await: ["","",""],
      fail: ["","",""],
      success: [""," fill-complete success"," check-complete success"],
      complete: ["path-complete"," fill-complete success"," check-complete success"]
    })[this.props.status];

    let svgStroke = ({
      await: "#7DB0D5",
      success: "7DB0D5",
      fail: "#F44336",
      complete: "7DB0D5"
    })[this.props.status];

    let statusMessage = ({
      await: "Din ordre behandles...",
      fail: "Handel feilet!",
      success: "Handel fullført",
      complete: "Handel fullført"
    })[this.props.status];

    let orderList = [];
    for(let o of this.props.orders){
      orderList.push(
        <div>
          <Col s={6} className="right-align padd">
            { o.item.name }
          </Col>
          <Col s={6} className="left-align padd">
            { o.qty } x { o.item.price },-
          </Col>
        </div>
      );
    }


    return (

      <Modal
        key={"cash_modal"}
        header="Legg Til Penger"
        trigger={this.props.trigger}
        actions={[
          <Button waves='light' modal='close'>Ny handel</Button>,
          <Button onClick={() => this.props.onSubmit()} modal='close'>Logg ut nå</Button>
        ]}
      >
        <Row>
          <Col s={12} className="align center-align">
            <div className="checkmark">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve" x="0px" y="0px" viewBox="0, 0, 100, 100" id="checkmark">
                <g transform="">
                  <circle className={"path" + svgClass[0]} fill="none" stroke={svgStroke} strokeWidth="4" strokeMiterlimit="10" cx="50" cy="50" r="44"/>
                  <circle className={"fill" + svgClass[1]} fill="none" stroke={svgStroke} strokeWidth="4" strokeMiterlimit="10" cx="50" cy="50" r="44"/>
                  <polyline className={"check" + svgClass[2]} fill="none" stroke="#7DB0D5" strokeWidth="8" strokeLinecap="square" strokeMiterlimit="10" points="70,35 45,65 30,52  "/>
                </g>
              </svg>
            </div>
            <h4 className="thinner">{statusMessage}</h4>
            <Row>
              {orderList}
            </Row>
            <h5 className="thinner grey-text darken-2">
              <b>{ this.props.balance || 0 }kr</b> igjen
            </h5>
          </Col>
        </Row>
      </Modal>
    );
  }
}


/**
 * props:
 *  trigger : node
 *  onSubmit : callback
 */
export class RegModal extends React.Component{
  constructor(props){
    super(props);
  }

  render(){

  }
}