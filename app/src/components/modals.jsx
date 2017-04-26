import React from 'react';
import { Navbar, NavItem, Icon, Modal, Button, Row, Col, Input } from 'react-materialize';




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
      this.sub = this.props.proxy.subscribe((a) => {
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
    return null;
  }
}


/**
 * props:
 *  trigger
 */
export const HelpModal = (props) => {
  return (<Modal
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
      inval: "",
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
      moneyButtons.push(<Button key={i} large waves='light' className={`money-${amount}`} onClick={() => this.setValue(amount,true)}>{amount} kr</Button>)
    }


    let inputAmount = 0;
    let inField = <input placeholder="" name="asaldo" value={this.state.inval} disabled={this.state.indisable} onChange={(a) => this.inputChange(a)} type="number" />;
    const changeInput = (amount) => {
      inputAmount = amount;
    }

  
    return (
      <Modal
        key={"cash_modal"}
        header="Legg Til Penger"
        trigger={this.props.trigger}
        actions={[
          <Button waves='light' modal='close' flat>Avbryt</Button>,
          <Button waves='light' onClick={() => {this.props.onSubmit(parseInt(this.state.inval))}} modal='close'>Sett inn</Button>]}
      >
        <div>
          <h5>Kontant</h5>
          <b>Legg kontant i pengekassa som står i kjøleskapet, så registrer samme beløp her!</b>
          <br />
          <div className="radio-group">
            <Button waves='light' large onClick={() => this.setValue(null,false)}>Velg eget beløp</Button>
            {moneyButtons}
          </div>
          <br />
          <div className="col input-field">
            {inField}
            <label htmlFor="asaldo" className="active">Skriv beløp</label>
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
      inval: "",
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
      moneyButtons.push(<Button key={i} large waves='light' className={`money-${amount}`} onClick={() => this.setValue(amount,true)}>{amount} kr</Button>)
    }


    let inputAmount = 0;
    let inField = <input placeholder="" name="rsaldo" value={this.state.inval} disabled={this.state.indisable} onChange={(a) => this.inputChange(a)} type="number" />;
    const changeInput = (amount) => {
      inputAmount = amount;
    }

    return (
      <Modal
        key={"cash_modal"}
        header="Legg Til Penger"
        trigger={this.props.trigger}
        actions={[
          <Button waves='light' modal='close' flat>Avbryt</Button>,
          <Button waves='light' onClick={() => this.props.onSubmit(-parseInt(this.state.inval))} modal='close'>Ta ut</Button>
        ]}
      >
        <div>
          <h5>Kontant</h5>
          <b>Velg beløpet du ønsker å ta ut, så ta pengene fra pengekassa i kjøleskapet!</b>
          <br />
          <div className="radio-group">
            <Button large waves='light' onClick={() => this.setValue(null,false)}>Velg eget beløp</Button>
            { moneyButtons }
          </div>
          <br />
          <div className="col input-field">
            { inField }
            <label htmlFor="rsaldo" className="active">Skriv beløp</label>
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
 *  orders : list of orders
 *  balance : money left after purchase
 */
export class CheckoutModal extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      current_status: props.status || "await",
    }
    this.c_interval = null;
  }

  componentWillUnmount(){
    clearInterval(this.c_interval);  
  }
  componentWillReceiveProps(props){
    this.setState(Object.assign(this.state,{
      current_status: props.status || "await"
    }));
    clearInterval(this.c_interval);
    if(props.status == "success")
      this.c_interval = setTimeout(() => {
        this.setState(Object.assign(this.state,{
          current_status: "complete"
        }));
      },1000);
  }
  render(){
    let svgClass = ({
      await: ["","",""],
      fail: ["","",""],
      success: [""," fill-complete success"," check-complete success"],
      complete: ["path-complete"," fill-complete success"," check-complete success"]
    })[this.state.current_status];

    let svgStroke = ({
      await: "#7DB0D5",
      success: "7DB0D5",
      fail: "#F44336",
      complete: "7DB0D5"
    })[this.state.current_status];

    let statusMessage = ({
      await: "Din ordre behandles...",
      fail: "Handel feilet!",
      success: "Handel fullført",
      complete: "Handel fullført"
    })[this.state.current_status];

    let orderList = [];
    for(let o of this.props.orders){
      orderList.push(
        <div key={o.item.id}>
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
        header={statusMessage}
        trigger={this.props.trigger}
        actions={[
          <Button waves='light' onClick={() => this.props.onSubmit()} modal='close' flat>Logg ut nå</Button>,
          <Button waves='light' modal='close'>Ny handel</Button>
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

  handleSubmit(e){
    if(this.props.onSubmit){
      console.log("Username ref",this.username);
      this.props.onSubmit(this.username.value,this.password.value);
    }
    e.preventDefault();
  }
  onClose(){
    this.username = "";
    this.password = "";
    if(this.props.onClose){
      this.props.onClose();
    }
  }
  onOpen(){
    this.username = "";
    this.password = "";
    if(this.props.onOpen){
      this.props.onOpen();
    }
  }
  render(){
    return (
      <Modal
        modalOptions={{
          complete: () => this.onClose(),
          ready: () => this.onOpen()
        }}
        header="Registrer - Nibble"
        trigger={this.props.trigger}
        actions={[
          <Button waves='light' modal='close' onClick={() => this.handleSubmit()}>Registrer</Button>,
          <Button waves='light' modal='close' flat>Avbryt</Button>
        ]}
      >
        Fyll inn ditt brukernavn og passord for å knytte rfidekortet opp mot din online bruker
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <Input onChange={(v) => this.username = v} value={this.username} placeholder="Brukernavn" type="text" />
          <Input onChange={(v) => this.password = v} value={this.password} placeholder="Passord" type="password" />
        </form>
      </Modal>
    )
  }
}