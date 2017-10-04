
import React, { Component } from 'react';


export class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.modal = null;
  }

  setModalRef(ref) {
    this.modal = ref;
    if (ref != null) {
      $(this.modal).modal({
        dismissible: false,
        opacity: 0.5,
        inDuration: 300,
        outDuration: 300,
        startTop: '4%',
        endingTop: '10%',
        ready: () => this.handleReady(),
        complete: () => this.handleComplete(),
      });
    }
  }

  handleReady() {

  }
  handleComplete() {

  }
  open() {
    $(this.modal).modal('open');
  }

  close() {
    $(this.modal).modal('close');
  }

  componentWillReceiveProps(props) {
    const openState = !!props.open;
    const fmap = {
      [true]: () => this.open(),
      [false]: () => this.close(),
    };

    if (openState != this.state.open) {
      fmap[openState]();
    }
  }

  renderModal() {
    return (
      <div ref={(...a) => this.setModalRef(...a)} className="modal">
        <div className="modal-content">
          <h4>{this.props.header || 'None'}</h4>
          {this.props.children || <p />}
        </div>
        <div className="modal-footer">
          {this.props.actions}
        </div>
      </div>
    );
  }
  render() {
    const trigger = React.cloneElement(this.props.trigger, {
      onClick: () => this.open(),
    });
    return (<div>
      {this.renderModal()}
      {trigger}
    </div>);
  }
}
