import React from 'react';

import { Modal, Button } from 'react-materialize';
/**
 * props:
 *  trigger : node
 *  onSubmit : callback
 *  saldoList : list of selectable saldos
 */
export class RemoveSaldoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inval: 0,
      indisable: true,
    };
  }

  inputChange(event) {
    this.setValue(event.target.value);
  }

  setValue(amount, disable) {
    this.setState(Object.assign(this.state, {
      inval: amount == null ? this.state.inval : amount,
      indisable: disable == null ? this.state.indisable : disable,
    }));
  }
  diffValue(amount) {
    this.setState(Object.assign(this.state, {
      inval: Math.max((this.state.inval == null ? 0 : this.state.inval) + amount, 0),
    }));
  }
  render() {
    const moneyButtons = [];
    const v = [1, 5, 10, 25];
    const incButtons = [];
    const decButtons = [];
    for (const i in v) {
      const amount = v[i];
      decButtons.push(<Button key={i + 10} large waves="light" className={`money-${amount}`} onClick={() => this.diffValue(-amount)}>{`-${amount}`} kr</Button>);
    }
    for (const i in v) {
      const amount = v[i];
      incButtons.push(<Button key={i + 20} large waves="light" className={`money-${amount}`} onClick={() => this.diffValue(amount)}>{`+${amount}`} kr</Button>);
    }

    for (const i in this.props.saldoList) {
      const amount = this.props.saldoList[i];
      moneyButtons.push(<Button key={i} large waves="light" className={`money-${amount}`} onClick={() => this.setValue(amount, true)}>{amount} kr</Button>);
    }


    let inputAmount = 0;
    const inField = <input placeholder="" name="rsaldo" value={this.state.inval} disabled={this.state.indisable} onChange={a => this.inputChange(a)} type="number" />;
    const changeInput = (amount) => {
      inputAmount = amount;
    };

    return (
      <Modal
        key={'cash_modal'}
        header="Ta Ut Penger"
        trigger={this.props.trigger}
        modalOptions = {{
          ready: () => this.setValue(0,true)
        }}
        actions={[
          <Button waves="light" modal="close" flat>Avbryt</Button>,
          <Button waves="light" onClick={() => this.props.onSubmit(-parseInt(this.state.inval))} modal="close">Ta ut</Button>,
        ]}
      >
        <div className="modalCash">
          <p className="modalCashDesc">Velg beløpet du ønsker å ta ut, så ta pengene fra pengekassa i kjøleskapet!</p>
          <div className="radio-group">
            { moneyButtons }
          </div>
          <br />
          <div className="radio-group">
            {incButtons}
          </div>
          <br />
          <div className="radio-group">
            {decButtons}
          </div>
          <br />
          <div className="col input-field">
            { inField }
            <label htmlFor="rsaldo" className="active">Velg beløp med knappene over</label>
          </div>
        </div>
      </Modal>
    );
  }
}