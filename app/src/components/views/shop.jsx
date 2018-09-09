import { LOGOUT_TIMER } from 'common/constants';
import { CatalogItem } from 'components/CatalogItem.jsx';
import { CheckoutModal, ClickProxy } from 'components/modals.jsx';
import { StackItem } from 'components/StackItem.jsx';
import { Tab, Tabs } from 'components/Tabs';
import React from 'react';
import { Button, Col, Row } from 'react-materialize';
import { Observable, Subject } from 'rxjs';
import { serviceManager } from 'services';

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

    // Services
    this.inventory = serviceManager.getService('inventory');
    this.orderService = serviceManager.getService('order');
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
    return this.shoppingCart.reduce((total, stack) => (total + stack.cost), 0);
  }

  componentDidMount() {
    this.time = LOGOUT_TIMER;
    this.inventory.getInventory().subscribe((inv) => {
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
      } else if (this.state.exitTimer <= 5) {
        Materialize.toast(`Logger ut om ${this.state.exitTimer}`, 600);
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

    if (stack) {
      this.shoppingCart = this.shoppingCart.filter(a => a != stack);
    } else {
      this.shoppingCart = [];
    }
  }

  cartCheckout() {
    // triggers modal to open
    this.setState(Object.assign(this.state, {
      checkoutStatus: 'await',
      exitTimer: 200,
    }));

    this.checkoutProxy.next();

    this.orderService.checkoutOrder(this.props.user, this.shoppingCart).subscribe(() => {
      Materialize.toast('Handel fullført', 1000);

      this.clearCart();
      this.setState(Object.assign(this.state, {
        checkoutStatus: 'success',
        exitTimer: 5,
      }));
    }, () => {
      // It failed
      Materialize.toast('Handel feilet!', 2000);
      this.setState(Object.assign(this.state, {
        checkoutStatus: 'fail',
        exitTimer: 5,
      }));
    });
  }

  checkoutClose(logout) {
    if (logout && this.props.onExit) {
      this.props.onExit();
    } else {
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

    const defaultCategory = -1;

    const categories = {
      [-1]: {
        name: 'Alt',
        inv: [],
      },
    };

    let k = 0;

    this.state.inventory.forEach((item) => {
      const catalogItem = (
        <CatalogItem key={k += 1} item={item} onAdd={(...a) => this.addToCart(...a)} />
      );

      const category = item.category;

      if (category) {
        categories[category.id] = categories[category.id] || {
          inv: [],
          name: category.name,
        };

        categories[category.id].inv.push(catalogItem);
      }

      categories[defaultCategory].inv.push(catalogItem);
    });

    const tabs = Object.values(categories).map((category, i) => {
      if (category.inv.length % 3 === 2) {
        category.inv.push(
          <div className="catalogCard catalogCardEmpty" key={k += 1} />,
        );
      }

      return (
        <Tab
          active={defaultCategory === i}
          key={category.name}
          title={category.name}
          // Defines tab size by finding out how many of the 12 MD columns
          // can be used and then floor that value.
          size={Math.floor(12 / Object.keys(categories).length)}
        >
          <div className="catalog">
            {category.inv}
          </div>
        </Tab>
      );
    });

    const cartContents = this.shoppingCart.map(stack => (
      <StackItem key={stack.item.id} stack={stack} onRemove={(...a) => this.clearCart(...a)} />
    ));

    return (
      <Row>
        <Col m={9} l={9}>
          <Tabs>
            {tabs}
          </Tabs>
        </Col>
        <Col m={3} l={3} className="side-nav fixed side-nav-custom">
          <ul>
            { cartContents }
          </ul>
          <div className="checkout">
            <div className="sum">Subtotal: <span className="right">{ this.subtotal },-</span></div>
            <div>
              <h5>
                <span>Balanse etter handel: <span className="right">{
                  this.props.user.saldo - this.subtotal
                },-</span></span>
              </h5>
            </div>
            <Button
              onClick={() => this.cartCheckout()}
              disabled={((this.props.user.saldo - this.subtotal) < 0) ||
                (this.shoppingCart.length <= 0)}
              className="buy waves-effect waves-light nibble-color success"
              large
            >
              Kjøp
            </Button>
          </div>
        </Col>

        {checkoutModal}
      </Row>
    );
  }
}
