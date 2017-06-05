import React from 'react';

import { Modal, Button, Row, Col } from 'react-materialize';
/**
 * props:
 *  trigger : node
 *  onSubmit : callback
 *  orders : list of orders
 *  balance : money left after purchase
 */
export class CheckoutModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_status: props.status || 'await',
    };
    this.c_interval = null;
    this.closeState = true;
  }

  componentWillUnmount() {
    clearInterval(this.c_interval);
  }
  componentWillReceiveProps(props) {
    this.setState(Object.assign(this.state, {
      current_status: props.status || 'await',
    }));
    clearInterval(this.c_interval);
    if (props.status == 'success') {
      this.c_interval = setTimeout(() => {
        this.setState(Object.assign(this.state, {
          current_status: 'complete',
        }));
      }, 1000);
    }
  }
  render() {
    const svgClass = ({
      await: ['', '', ''],
      fail: ['', '', ''],
      success: ['', ' fill-complete success', ' check-complete success'],
      complete: ['path-complete', ' fill-complete success', ' check-complete success'],
    })[this.state.current_status];

    const svgStroke = ({
      await: '#7DB0D5',
      success: '7DB0D5',
      fail: '#F44336',
      complete: '7DB0D5',
    })[this.state.current_status];

    const statusMessage = ({
      await: 'Din ordre behandles...',
      fail: 'Handel feilet!',
      success: 'Handel fullført',
      complete: 'Handel fullført',
    })[this.state.current_status];

    const orderList = [];
    for (const o of this.props.orders) {
      orderList.push(
        <div key={o.item.id}>
          <Col s={6} className="right-align padd">
            { o.item.name }
          </Col>
          <Col s={6} className="left-align padd">
            { o.qty } x { o.item.price },-
          </Col>
        </div>,
      );
    }
    return (
      <Modal
        header={statusMessage}
        trigger={this.props.trigger}
        modalOptions={{
          complete: () => this.props.onSubmit(this.closeState)
        }}
        actions={[
          <Button waves="light" onClick={() => this.closeState = false} modal="close">Ny handel</Button>,
          <Button waves="light" onClick={() => this.closeState = true} modal="close" flat>Logg ut nå ({this.props.time || 0})</Button>,
          this.props.extraClose,
        ]}
      >
        <Row>
          <Col s={12} className="align center-align">
            <div className="checkmark">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve" x="0px" y="0px" viewBox="0, 0, 100, 100" id="checkmark">
                <g transform="">
                  <circle className={`path${svgClass[0]}`} fill="none" stroke={svgStroke} strokeWidth="4" strokeMiterlimit="10" cx="50" cy="50" r="44" />
                  <circle className={`fill${svgClass[1]}`} fill="none" stroke={svgStroke} strokeWidth="4" strokeMiterlimit="10" cx="50" cy="50" r="44" />
                  <polyline className={`check${svgClass[2]}`} fill="none" stroke="#7DB0D5" strokeWidth="8" strokeLinecap="square" strokeMiterlimit="10" points="70,35 45,65 30,52  " />
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