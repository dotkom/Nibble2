import React from 'react';

/* Proxy in order to fire click events*/
/**
 * props:
 *  proxy : callforward, an Observable
 */
export class ClickProxy extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.proxy) {
      this.sub = this.props.proxy.subscribe((a) => {
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