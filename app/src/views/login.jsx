import React from 'react';
import {render} from 'react-dom';

import { Row, Col } from 'react-materialize';

import { inventory, Item } from 'services/inventory';

import { userService } from 'services/user';


import { ClickProxy, RegModal } from 'components/modals.jsx';
import { Subject } from 'rxjs';


export class LoginView extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      inventory: [],
      submitState: 0
    };
    this.intervals = [];
    this.logKeys = true;
    this.currentRfid = "";
    this.regProxy = new Subject();
    this.invSub = null;
  }

  handleKeyPress(event){
    if(this.logKeys){
      if(event.keyCode == 13){ // Enter
        this.submitState = 1;
        userService.getUser(this.currentRfid).subscribe(user => {
          this.submitState = 2;
          this.props.onSubmit(user);
        },()=> {
          this.submitState = 3;
          this.regProxy.next();
          this.intervals.push(setTimeout(()=>{
            this.submitState = 0
          },500));
        });
        this.currentRfid = "";
      }
      else{
        this.currentRfid += String.fromCharCode(event.keyCode);
      }
    }
  }
  set submitState(a){
    this.setState(Object.assign(this.state,{
      submitState: a
    }));
  }
  get submitState(){
    return this.state.submitState;
  }

  componentWillMount(){
    $(document).on("keypress",this.handleKeyPress.bind(this));
  }

  componentDidMount(){
    this.invSub = inventory.getInventory().subscribe((inv)=>{
      this.setState(Object.assign(this.state,{
        inventory: inv
      }));
    });
  }

  componentWillUnmount(){
    $(document).off("keypress");
    for(let interval of this.intervals){
      clearInterval(interval);
    }
    this.invSub.unsubscribe();
  }
  handleRegSubmit(username,password){
    
  }
  render () {
    let tableContent = [];
    let k = 0;
    for(let item of this.state.inventory){
      tableContent.push(
        <tr className="item_box" key={++k}>
          <td className="item_name inventory-list">{item.name}</td>
          <td className="item-count inventory-list">{item.price}</td>
        </tr>
      );
    }
    let tables = [];
    let colCount = 2;
    for(let i=0; i<colCount;i++){
      tables.push(
        <Col key={i} m={6} l={6}>
          <table>
            <tbody>
              {tableContent.slice(Math.ceil(k/colCount) * i,Math.ceil(k/colCount) * (i+1))}
            </tbody>
          </table>
        </Col>
      );
    }

    let rfid_marker =  (["","wait","ok","error"])[this.submitState]; 

    return (
      <div>
        <RegModal 
          trigger={<ClickProxy proxy={this.regProxy.asObservable()} />} 
          onSubmit={(username, password) => this.handleRegSubmit(username, password)}
        />
        <Row>
          <Col m={2} offset="l1 m1">
            <div className={"marker rfid-marker " + rfid_marker} id="rfid-rlogo"></div>
          </Col>
          <Col m={7} offset="l1 m1">
            <div className="card nibble-color alt">
              <div className="card-content white-text">
                <span className="card-title">Scan ditt studentkort for å handle</span>
              </div>
            </div>
            <Row>
              {tables}
            </Row>      
          </Col>
        </Row>
      </div>
    );
  }
}
