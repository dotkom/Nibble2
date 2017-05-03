import React from 'react';
import { render } from 'react-dom';

import { Row, Col } from 'react-materialize';

import { inventory, Item } from 'services/inventory';

import { userService } from 'services/user';


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
    this.regProxy = new Subject();
    this.invSub = null;
  }

  handleKeyPress(event){
    if(this.logKeys){
      if(event.keyCode == 13){ // Enter
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
    userService.getUser(this.currentRfid).subscribe(user => {
      this.currentRfid = "";
      this.submitState = 2;
      this.props.onSubmit(user);
    },(err)=> {
      this.submitState = 3;
      this.intervals.push(setTimeout(()=>{
        this.submitState = 0
      },500));

      if(err.type == 1){
        this.regProxy.next();
      }else{
        this.currentRfid = "";
        //Show toast that it is invalid
      }
    });
  }
  disableKeyLogger(){
    $(document).off("keypress");
  }
  enableKeyLogger() {
    $(document).on('keypress', (...a) => this.handleKeyPress(...a));
  }
  componentWillMount() {
    this.enableKeyLogger();
  }

  componentDidMount() {
    this.invSub = inventory.getInventory().subscribe((inv) => {
      this.setState(Object.assign(this.state, {
        inventory: inv,
      }));
    });
  }

  componentWillUnmount() {
    this.disableKeyLogger();
    this.currentRfid = '';

    for (const interval of this.intervals) {
      clearInterval(interval);
    }
    this.invSub.unsubscribe();
  }
  handleRegSubmit(username, password){
    userService.bindRfid(username, password, this.currentRfid).subscribe(u => {
      // Try to login if user was registered
      this.attemptLogin();
    }, () => {}, () => {
      this.currentRfid = '';
    });
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

    const rfid_marker = (['', 'ok', 'error'])[this.submitState];

    return (
      <div>
        <RegModal
          trigger={<ClickProxy proxy={this.regProxy.asObservable()} />}
          onSubmit={(username, password) => this.handleRegSubmit(username, password)}
          onClose={() => this.enableKeyLogger()}
          onOpen={() => this.disableKeyLogger()}
        />
        <Row>
          <Col m={2} offset="l1 m1">
            <div className={`marker rfid-marker ${rfid_marker}`} id="rfid-rlogo" />
          </Col>
          <Col m={7} offset="l1 m1">
            <div className="card nibble-color alt">
              <div className="card-content white-text">
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
