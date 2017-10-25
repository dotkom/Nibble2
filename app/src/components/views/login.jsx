import React from 'react';
import { render } from 'react-dom';

import { Row, Col } from 'react-materialize';

import { serviceManager } from 'services';

import { ClickProxy, RegModal } from 'components/modals.jsx';
import { Subject } from 'rxjs';

export class LoginView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inventory: [],
      submitState: 0,
    };
    this.intervals = [];
    this.logKeys = true;
    this.currentRfid = '';
    this.storedRfid = '';
    this.regProxy = new Subject();
    this.invSub = null;

    this.userService = serviceManager.getService('user');
    this.inventory = serviceManager.getService('inventory');
  }

  handleKeyPress(event){
    if(this.logKeys){
      if(event.keyCode == 13){ // Enter
        this.storedRfid = this.currentRfid;
        this.currentRfid = '';
        this.attemptLogin();
      }
      else{
        this.currentRfid += String.fromCharCode(event.keyCode);
      }
    }
  }
  set submitState(a) {
    this.setState(Object.assign(this.state, {
      submitState: a,
    }));
  }
  get submitState() {
    return this.state.submitState;
  }

  attemptLogin(){
    this.submitState = 1;
    this.userService.getUser(this.storedRfid).subscribe(user => {
      this.storedRfid = "";
      this.submitState = 2;
      this.props.onSubmit(user);
    },(err)=> {
      this.submitState = 3;
      Materialize.toast(err.message,2000);
      this.intervals.push(setTimeout(()=>{
        this.submitState = 0
      },1000));

      if(err.type == 1){
        this.regProxy.next();
      }else{
        this.storedRfid = "";
        //Materialize.toast("Ugyldig RFID!",2000);
        //Show toast that it is invalid
      }
    });
  }
  disableKeyLogger(){
    this.currentRfid = '';
    $(document).off("keypress");
  }
  enableKeyLogger() {
    this.currentRfid = '';
    $(document).on('keypress', (...a) => this.handleKeyPress(...a));
  }
  componentWillMount() {
    this.enableKeyLogger();
  }

  componentDidMount() {
    this.invSub = this.inventory.getInventory().subscribe((inv) => {
      this.setState(Object.assign(this.state, {
        inventory: inv,
      }));
    });
  }

  componentWillUnmount() {
    this.disableKeyLogger();
    this.currentRfid = '';
    this.storedRfid = '';
    for (const interval of this.intervals) {
      clearInterval(interval);
    }
    this.invSub.unsubscribe();
  }
  handleRegSubmit(username, password){
    this.userService.bindRfid(username, password, this.storedRfid).subscribe(u => {
      // Try to login if user was registered
      this.attemptLogin();
    }, () => {
      Materialize.toast("Registrering feilet!",2000);
      this.storedRfid = '';
    }, () => {
      this.storedRfid = '';
    });
  }

  handleMagicLink(username, options) {
    return this.userService.bindRfid(username, '', this.storedRfid, options);
  }

  render() {

    const menuContent = [];

    let k = 0;
    for (const item of this.state.inventory) {
      menuContent.push(
        <div className="menuItem" key={k += 1}>
          <div className="menuItemName">{item.name}</div>
          <div className="menuItemPrice">{item.price}</div>
        </div>,
      );
    }

    if (menuContent.length % 3 === 2) {
      menuContent.push(
        <div className="menuItem menuItemEmpty" key={k += 1} />,
      );
    }

    const rfid_marker = (['', 'ok', 'ok', 'error'])[this.submitState];

    return (
      <div>
        <RegModal
          trigger={<ClickProxy proxy={this.regProxy.asObservable()} />}
          onSubmit={(username, password) => this.handleRegSubmit(username, password)}
          handleMagicLink={(username, opts) => this.handleMagicLink(username, opts)}
          onClose={() => this.enableKeyLogger()}
          onOpen={() => this.disableKeyLogger()}
        />
        <Row>
          <Col m={2} offset="l1 m1">
            <div className={`marker rfid-marker ${rfid_marker}`} id="rfid-rlogo" />
          </Col>
          <Col m={7} offset="l1 m1">
            <div className="card nibble-color alt">
              <div className="card-content intro-card white-text">
                <span className="card-title">Scan ditt studentkort for å handle</span>
              </div>
            </div>
            <Row>
              <div className="menuContainer">
                {menuContent}
              </div>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}
