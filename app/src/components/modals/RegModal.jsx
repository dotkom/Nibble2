import React from 'react';
import { Keyboard } from 'components/Keyboard';

import { Modal, Button } from 'react-materialize';
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
    };
  }

  handleSubmit(e) {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.username, this.state.password);
    }
    if (e) { e.preventDefault(); }
  }
  onClose() {
    this.setState(Object.assign(this.state, {
      username: '',
      password: '',
    }));
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
  onOpen() {
    this.setState(Object.assign(this.state, {
      username: '',
      password: '',
    }));
    if (this.props.onOpen) {
      this.props.onOpen();
    }
  }
  set username(u) {
    this.setState(Object.assign(this.state, {
      username: u,
    }));
  }
  set password(u) {
    this.setState(Object.assign(this.state, {
      password: u,
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
          <Button waves="light" modal="close" onClick={() => this.handleSubmit()}>Registrer</Button>,
          <Button waves="light" modal="close" flat>Avbryt</Button>,
        ]}
      >
        Fyll inn ditt brukernavn og passord for å knytte rfidekortet opp mot din online bruker
        <div className="col input-field">
          <Keyboard onChange={(v)=> this.username = v}>
            <input value={this.state.username} type="text" />
          </Keyboard>
          <label>Brukernavn</label>
        </div>
        <div className="col input-field">
          <Keyboard onChange={(v) => this.password = v}>
            <input value={this.state.password} type="password" />
          </Keyboard>
          <label>Passord</label>
        </div>

      </Modal>
    );
  }
}
