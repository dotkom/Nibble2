import React from 'react';
import { render } from 'react-dom';
import { Navbar, NavItem, Icon } from 'react-materialize';

import { Row, Col, Card, CardTitle, Button } from 'react-materialize';

import { inventory, Item } from 'services/inventory';
import { orderService } from 'services/order';
import { http } from 'services/net';

import { userService } from 'services/user';

import { ClickProxy, CheckoutModal } from 'components/modals.jsx';

import { Subject, Observable } from 'rxjs';

class Stack {
  constructor(item, qty) {
    this._item = item;
    this._qty = qty;
  }

  inc() {
    this._qty = this._qty + 1;
  }

  get item() {
    return this._item;
  }

  canStack(item) {
    return this.item == item;
  }

  get qty() {
    return this._qty;
  }

  get cost() {
    return this.qty * this.item.price;
  }

  get checkoutObject() {
    return {
      object_id: this.item.id,
      quantity: this.qty,
    };
  }
}


const LOGOUT_TIMER = 120;


export class ShopView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inventory: [],
      shoppingCart: [],
      checkoutStatus: 'await',
      exitTimer: props.time || LOGOUT_TIMER,
    };
    this.checkoutProxy = new Subject();
    this.closeProxy = new Subject();
    this.userSubscription = null;
  }


  get shoppingCart() {
    return this.state.shoppingCart;
  }

  set shoppingCart(a) {
    this.setState(Object.assign(this.state, {
      shoppingCart: a,
    }));
  }

  get subtotal() {
    let total = 0;
    for (const stack of this.shoppingCart) {
      total += stack.cost;
    }
    return total;
  }

  componentDidMount() {
    this.time = LOGOUT_TIMER;
    inventory.getInventory().subscribe((inv) => {
      inv.sort((a, b) => a.name.localeCompare(b.name));
      this.setState(Object.assign(this.state, {
        inventory: inv,
      }));
    });
    this.updateProps(this.props);
    this.exitInterval = Observable.interval(1000).subscribe(() => {
      this.setState(Object.assign(this.state, {
        exitTimer: this.state.exitTimer - 1,
      }));
      if (this.state.exitTimer <= 0) {
        $('.modal').modal('close');
        this.props.onExit();
      }else if(this.state.exitTimer <= 5){
        Materialize.toast(`Logger ut om ${this.state.exitTimer}`,600);
      }
    });
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

  componentWillUnmount() {
    if (this.userSubscription) { this.userSubscription.unsubscribe(); }
    if (this.exitInterval) { this.exitInterval.unsubscribe(); }
  }

  addToCart(item) {
    this.time = LOGOUT_TIMER;
    let existingStack = false;
    for (const stack of this.shoppingCart) {
      if (stack.canStack(item)) {
        stack.inc();
        existingStack = true;
        break;
      }
    }

    if (!existingStack) {
      this.shoppingCart.push(new Stack(item, 1));
    }

    this.forceUpdate();
  }
  set time(t) {
    this.setState(Object.assign(this.state, {
      exitTimer: t,
    }));
  }
  clearCart(stack) {
    this.time = LOGOUT_TIMER;
    if (stack) { this.shoppingCart = this.shoppingCart.filter(a => a != stack); } else { this.shoppingCart = []; }
  }

  cartCheckout() {
    // triggers modal to open
    this.setState(Object.assign(this.state, {
      checkoutStatus: 'await',
      exitTimer: 200,
    }));
    this.checkoutProxy.next();

    orderService.checkoutOrder(this.props.user, this.shoppingCart).subscribe((v) => {
      Materialize.toast("Handel fullført",1000);
      this.clearCart();
      this.setState(Object.assign(this.state, {
        checkoutStatus: 'success',
        exitTimer: 5,
      }));
    }, (msg) => {
      // It failed
      Materialize.toast("Handel feilet!",2000);
      this.setState(Object.assign(this.state, {
        checkoutStatus: 'fail',
        exitTimer: 5,
      }));
    });
  }

  checkoutClose(logout){
    if(logout && this.props.onExit){
      this.props.onExit();
    }else{
      this.time = LOGOUT_TIMER;
    }
  }

  render() {
    const checkoutModal =
      (<CheckoutModal
        orders={this.shoppingCart}
        balance={this.props.user.saldo}
        trigger={<ClickProxy proxy={this.checkoutProxy.asObservable()} />}
        status={this.state.checkoutStatus}
        onSubmit={(...a) => this.checkoutClose(...a)}
        time={this.state.exitTimer}
      />);

    const inv = [];
    let k = 0;
    for (const item of this.state.inventory) {
      const img = item.image;
      inv.push(
        <div className="catalogCard" key={k += 1} onClick={() => this.addToCart(item)}>
          <img className="catalogImage" src={item.image ? item.image.small : 'assets/images/symboler_utenTekst_Trikom.png'} alt={item.name} />
          <div className="catalogInformation">
            <p className="catalogName">{item.name}</p>
            <p className="catalogDesc">{item.description}</p>
            <p className="catalogPrice">{item.price}kr</p>
          </div>
          <div className="catalogButton">
            <a className="add waves-effect waves-blue btn btn-flat nibble-color lighter left-align">
              Legg til
            </a>
          </div>
        </div>,
      );
    }

    if (inv.length % 3 === 2) {
      inv.push(
        <div className="catalogCard catalogCardEmpty" key={k += 1} />,
      );
    }

    const cartContents = [];
    k = 0;
    for (const stack of this.shoppingCart) {
      cartContents.push(
        <tr className="item_box" key={k++}>
          <td>
            <span className="item_name">
              { stack.item.name }
            </span>

            <Button floating large className="right remove waves-red" onClick={() => this.clearCart(stack)} icon="clear" waves="light" />
            <a className="item-quantity right">
              { stack.qty } x { stack.item.price },-
            </a>
          </td>
        </tr>,
      );
    }


    return (
      <Row>
        <Col m={9} l={9}>
          <div className="catalog">
            {inv}
          </div>
        </Col>
        <Col m={3} l={3} className="side-nav fixed side-nav-custom">
          <table>
            <tbody>
              { cartContents }
            </tbody>
          </table>
          <div className="checkout">
            <div className="sum">Subtotal: <span className="right">{ this.subtotal },-</span></div>
            <div>
              <h5>
                <span>Balanse etter handel: <span className="right">{ this.props.user.saldo - this.subtotal },-</span></span>
              </h5>
            </div>
            <Button onClick={() => this.cartCheckout()} disabled={((this.props.user.saldo - this.subtotal) < 0) || (this.shoppingCart.length <= 0)} className="buy waves-effect waves-light nibble-color success" large>Kjøp</Button>
          </div>
        </Col>
        {checkoutModal}
      </Row>
    );
  }
}
