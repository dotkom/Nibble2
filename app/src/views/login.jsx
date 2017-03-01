import React from 'react';
import {render} from 'react-dom';
import {Navbar,NavItem,Icon} from 'react-materialize';

import { Row, Col } from 'react-materialize';

import { inventory, Item } from 'services/inventory';

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
  }

  handleKeyPress(event){
    if(this.logKeys){
      if(event.keyCode == 13){ // Enter
        this.submitState = 1;
        this.props.onSubmit(this.currentRfid).subscribe((state)=>{
          //Show register modal if state == 3 (error)
          this.submitState = state;
          this.intervals.push(setTimeout(()=>{
            this.submitState = 0
          },500));
        });
        this.currentRfid="";
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
    inventory.getInventory().subscribe((inv)=>{
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
    );
  }
}
