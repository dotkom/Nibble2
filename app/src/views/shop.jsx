import React from 'react';
import {render} from 'react-dom';
import {Navbar,NavItem,Icon} from 'react-materialize';

import { Row, Col, Card, CardTitle } from 'react-materialize';

import { inventory, Item } from 'services/inventory';


class Stack{
  constructor(item,qty){
    this._item = item;
    this._qty = qty;
  }

  inc(){
    this._qty = this._qty + 1;
  }

  get item(){
    return this._item;
  }

  canStack(item){
    return this.item == item;
  }

  get qty(){
    return this._qty;
  }

}

export class ShopView extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      inventory: [],
      shoppingCart: []
    };
  }

  get shoppingCart(){
    return this.state.shoppingCart;
  }

  componentDidMount(){
    inventory.getInventory().subscribe((inv)=>{
      this.setState(Object.assign(this.state,{
        inventory: inv
      }));
    });
  }

  addToCart(item){
    console.log(item);
    let existingStack = false;
    for(let stack of this.shoppingCart){
      if(stack.canStack(item)){
        stack.inc();
        existingStack = true;
        break;
      }
    }

    if(!existingStack){
      this.shoppingCart.push(new Stack(item,1));
    }

    this.forceUpdate();
  }

  clearStack(stack){
    console.log(stack);
  }

  componentWillUnmount(){
    $(document).off("keypress");
  }
  
  render () {
    let inv = [];
    let k = 0;
    for(let item of this.state.inventory){
      let img = item.image;
      inv.push(
        <Col s={4} key={k++}>
          <Card 
            onClick={()=>this.addToCart(item)}
            className="small hoverable clickable item"
            header={
              <CardTitle 
                image={img ? img.thumb : ""}
                waves="light"
              ></CardTitle>
            }
            actions={[
              <a 
                key={0}
                className="add waves-effect waves-blue btn btn-flat nibble-color lighter left-align"
              >
                Legg til
              </a>
            ]}
          > 
            <span className="card-title activator grey-text text-darken-4 truncate">
              { item.name }
            </span>  
            <p className="thin truncate item-description">
              {item.description}
            </p>
            <span className="item-count">
              { item.price }kr 
            </span>
          </Card>
        </Col>
      );
    }
    
    let cartContents = [];
    k = 0;
    for(let stack of this.shoppingCart){
      cartContents.push(
        /*<li key={k++}>
          <div>
            <span className="item_name" >
              { stack.item.name }
            </span>
            <a className="remove waves-effect waves-red right" onClick={() => this.clearStack(stack)}>
              <i className="material-icons">clear</i>
            </a>
            <a className="item-quantity right">
              { stack.item.dispQuantity } x { stack.item.price },-
            </a>
          </div>
        </li>
        */
        <tr className="item_box" key={k++}> 
          <td>
            <span className="item_name">
              { stack.item.name }
            </span> 
            
            <a className="remove waves-effect waves-red right" onClick={ () => this.clearStack(stack) } >
              <i className="material-icons">clear</i>
            </a>
            <a className="item-quantity right">
              { stack.qty } x { stack.item.price },-
            </a>
          </td>
        </tr>
      );
    }


    return (
      <div>
        <Row>
          <Col m={9} l={9}>
            {inv}
          </Col>
          <Col m={3} l={3}>
            <table className="item_box">
              { cartContents }
            </table>
          </Col>
        </Row>
      </div>
    );
  }
}
