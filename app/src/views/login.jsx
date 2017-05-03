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

  handleKeyPress(event) {
    if (this.logKeys) {
      if (event.keyCode == 13) { // Enter
        this.submitState = 1;
        userService.getUser(this.currentRfid).subscribe((user) => {
          this.currentRfid = '';
          this.submitState = 1;
          this.props.onSubmit(user);
        }, (err) => {
          this.submitState = 2;
          this.intervals.push(setTimeout(() => {
            this.submitState = 0;
          }, 500));

          if (err.type == 1) {
            this.regProxy.next();
          } else {
            this.currentRfid = '';
            // Show toast that it is invalid
          }
        });
      } else {
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
  disableKeyLogger() {
    $(document).off('keypress');
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
  handleRegSubmit(username, password) {
    userService.bindRfid(username, password, this.currentRfid).subscribe((u) => {
      console.log(u);
    }, () => {}, () => {
      this.currentRfid = '';
    });
  }
  render() {
    const tableContent = [];
    let k = 0;
    for (const item of this.state.inventory) {
      tableContent.push(
        <tr className="item_box" key={++k}>
          <td className="item_name inventory-list">{item.name}</td>
          <td className="item-count inventory-list">{item.price}</td>
        </tr>,
      );
    }
    const tables = [];
    const colCount = 3;
    for (let i = 0; i < colCount; i++) {
      tables.push(
        <Col key={i} m={4} l={4}>
          <table>
            <tbody>
              {tableContent.slice(Math.ceil(k / colCount) * i, Math.ceil(k / colCount) * (i + 1))}
            </tbody>
          </table>
        </Col>,
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
              {tables}
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}
