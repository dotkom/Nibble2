import React from 'react';
import { Navbar, NavItem, Icon, Modal, Button, Row, Col, Input } from 'react-materialize';
import QRCode from 'qrcode.react';
import { Keyboard } from './Keyboard.jsx';

/* Proxy in order to fire click events*/
/**
 * props:
 *  proxy : callforward, an Observable
 */
export class ClickProxy extends React.Component {
  componentDidMount() {
    if (this.props.proxy) {
      this.sub = this.props.proxy.subscribe(() => {
        if (this.props.onClick) { this.props.onClick(new MouseEvent('PROXY_CLICK')); }
      });
    }
  }

  componentWillUnmount() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  render() {
    return null;
  }
}


/**
 * props:
 *  trigger
 */
export const HelpModal = ({ trigger }) => {
  return (
    <Modal header="Hjelp" trigger={trigger}>
      <div>
        <b>Hvordan legger jeg inn penger?</b>
        <p>
          Du kan legge inn penger manuelt på appen etter du har logget inn eller
          du kan legge til med ditt kredittkort på online.ntnu.no under min
          profil.
        </p>
        <b>Det er tomt for en vare, hva gjør jeg?</b>
        <p>
          Det er funksjonalitet for automatisk varsling under utvikling men
          foreløpig må du sende mail til trikom@online.ntnu.no.
        </p>
        <b>Jeg fant en feil, hva gjør jeg?</b>
        <p>
          Legg til en issue på
          <a href="https://github.com/dotkom/nibble2"> github.com/dotkom/nibble2/ </a>
          eller send en mail til
          <a href="mailto:dotkom@online.ntnu.no"> dotkom@online.ntnu.no</a>.
        </p>
      </div>
    </Modal>
  );
};

/**
 * props:
 *  trigger : node
 *  saldoList : [50,200,300]
 *  submit : callback
 */
export class AdjustSaldoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inval: 0,
      indisable: true,
    };
  }

  setValue(amount, disable) {
    this.setState(Object.assign(this.state, {
      inval: Math.max(amount == null ? this.state.inval : amount, 0),
      indisable: disable == null ? this.state.indisable : disable,
    }));
  }

  inputChange(event) {
    this.setValue(event.target.value);
  }

  diffValue(amount) {
    this.setState(Object.assign(this.state, {
      inval: Math.max((this.state.inval == null ? 0 : this.state.inval) + amount, 0),
    }));
  }

  render() {
    const labels = [1, 5, 10, 25, 50, 100, 200, 500];
    const incButtons = [];

    for (const i in labels) {
      const label = labels[i];

      incButtons.push(
        <Button key={i} large waves="light" className={`money-${label}`} onClick={() => this.diffValue(label)}>
          {`+ ${label}`} kr
        </Button>
      );
    }

    const inField = (
      <input
        placeholder=""
        name="asaldo"
        value={this.state.inval}
        disabled={this.state.indisable}
        onChange={a => this.inputChange(a)}
        type="number"
      />
    );

    return (
      <Modal
        key={'cash_modal'}
        header="Juster saldo"
        trigger={this.props.trigger}
        modalOptions={{
          ready: () => this.setValue(0, true),
        }}
        actions={[
          <Button waves="light" modal="close" flat>Avbryt</Button>,
          <Button
            className="adjust-button"
            waves="light"
            onClick={
              () => { this.props.onSubmit(parseInt(this.state.inval)); }
            }
            modal="close"
          >
            Sett inn
          </Button>,
          <Button
            className="adjust-button"
            waves="light"
            onClick={
              () => { this.props.onSubmit(-1 * parseInt(this.state.inval)); }
            }
            modal="close"
          >
            Ta ut
          </Button>,
        ]}
      >
        <div className="modalCash">
          <p className="modalCashDesc">
            Legg til/ta ut penger for å manuelt justere saldo. Dette skal kun
            brukes i spesielle tilfeller etter fjerningen av det røde
            pengeskrinet.
          </p>
          <br />
          <div className="radio-group">
            {incButtons.slice(0, 4)}
          </div>
          <br />
          <div className="radio-group">
            {incButtons.slice(4)}
          </div>
          <br />
          <div className="col input-field">
            {inField}
            <label htmlFor="asaldo" className="active">Velg beløp med knappene over</label>
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
export class CheckoutModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current_status: props.status || 'await',
    };

    this.c_interval = null;
    this.closeState = true;
  }

  componentWillReceiveProps(props) {
    this.setState(Object.assign(this.state, {
      current_status: props.status || 'await',
    }));

    clearInterval(this.c_interval);
    if (props.status === 'success') {
      this.c_interval = setTimeout(() => {
        this.setState(Object.assign(this.state, {
          current_status: 'complete',
        }));
      }, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.c_interval);
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
          <Button
            waves="light"
            onClick={
              () => { this.closeState = false; }
            }
            modal="close"
          >
            Ny handel
          </Button>,
          <Button
            waves="light"
            onClick={
              () => { this.closeState = true; }
            }
            modal="close"
            flat
          >
            Logg ut nå ({this.props.time || 0})
          </Button>,
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


/**
 * props:
 *  trigger : node
 *  onSubmit : callback
 */
export class RegModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      showQR: false,
      setRfidUrl: '',
    };
  }

  onOpen() {
    this.setState(Object.assign(this.state, {
      username: '',
      password: '',
      showQR: false,
      setRfidUrl: '',
    }));
    if (this.props.onOpen) {
      this.props.onOpen();
    }
  }

  onClose() {
    this.setState(Object.assign(this.state, {
      username: '',
      password: '',
      showQR: false,
      setRfidUrl: '',
    }));

    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  handleSubmit(e) {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.username, this.state.password);
    }
    if (e) { e.preventDefault(); }
  }

  handleGetQr(e) {
    if (e) { e.preventDefault(); }

    // Only try to submit if we haven't already.
    if (!this.state.setRfidUrl) {
      this.handleMagicLink({
        magic_link: true,
        send_email: false,
      });
    }
    // Toggle visibility of QR code no matter if we fetched or not.
    this.setState({ showQR: !this.state.showQR });
  }

  handleSendEmail(e) {
    if (e) e.preventDefault();
    this.handleMagicLink({
      magic_link: true,
      send_email: true,
    });
  }

  handleMagicLink(options) {
    this.props.handleMagicLink(this.state.username, options).subscribe((res) => {
      if (options.send_email) {
        Materialize.toast('E-post sendt.', 3000);
      } else {
        this.setState({ setRfidUrl: res.url });
      }
    }, (/* err */) => {
      Materialize.toast(
        'Noe gikk galt under forespørselen. Vennligst prøv igjen, eller kontakt dotkom.',
        5000,
      );
    });
  }

  set username(username) {
    this.setState(Object.assign(this.state, {
      username,
    }));
  }

  set password(password) {
    this.setState(Object.assign(this.state, {
      password,
    }));
  }

  render() {
    return (
      <Modal
        modalOptions={{
          complete: () => this.onClose(),
          ready: () => this.onOpen(),
        }}
        header="Registrer - Nibble"
        trigger={this.props.trigger}
        actions={[
          <Button
            waves="light"
            modal="close"
            disabled={!!this.state.setRfidUrl}
            onClick={() => this.handleSubmit()}
          >Registrer</Button>,
          <Button waves="light" modal="close" flat>Avbryt</Button>,
        ]}
      >
        <h5>
          Fyll inn ditt brukernavn og passord for å knytte RFID-kortet opp mot
          din online.ntnu.no bruker
        </h5>

        {!this.state.setRfidUrl && <div className="col input-field">
          <Keyboard onChange={(v) => { this.username = v; }}>
            <input value={this.state.username} type="text" />
          </Keyboard>
          <label>Brukernavn</label>
        </div>}
        {(!this.state.setRfidUrl && !this.state.showQR) && <div className="col input-field">
          <Keyboard onChange={(v) => { this.password = v; }}>
            <input value={this.state.password} type="password" />
          </Keyboard>
          <label>Passord</label>
        </div>}

        <Row>
          <p>
            Du kan skrive inn kun brukernavn for å generere en QR kode som du
            kan scanne for å koble sammen RFID-kortet ditt med
            Online.ntnu.no-brukeren din.
          </p>
          <Col>
            <Button
              disabled={!this.state.username || this.state.username.length === 0}
              onClick={() => this.handleGetQr()}
            >{this.state.showQR ? 'Skjul QR kode' : 'Hent QR kode så jeg slipper å logge inn!'}</Button>
            {this.state.showQR &&
              <Row>
                <Col className="qr-code">
                  {this.state.setRfidUrl && this.state.setRfidUrl.length > 0 &&
                    <QRCode
                      value={this.state.setRfidUrl}
                      size={256}
                    />
                  }
                </Col>
              </Row>
            }
          </Col>
          <Col>
            <Button
              disabled={!this.state.username || this.state.username.length === 0}
              onClick={() => this.handleSendEmail()}
            >Send linken på e-post til brukeren min</Button>
          </Col>
        </Row>
      </Modal>
    );
  }
}
