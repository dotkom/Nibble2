import React from 'react';
import { Navbar, NavItem, Icon, Modal } from 'react-materialize';

import { AddSaldoModal, HelpModal, RemoveSaldoModal, CheckoutModal } from './modals.jsx';
import { saldoList } from 'common/constants';
import { serviceManager } from 'services';

import classNames from 'classnames';

export class RadioGroup extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      selectedValue: props.defaultValue
    }
  }
  handleSelection(child){
    this.setState(Object.assign({},this.state,{
      selectedValue: child.props.value
    }));
  }
  render() {
    let children = React.Children.map(this.props.children,(child) => React.cloneElement(child,{
      onClick: () => this.handleSelection(child),
      className: classNames(child.props.className,{
        selected: this.state.selectedValue == child.props.value 
      })
    }));
    return (
      <span>
        {children}
      </span>
    );
  }
}
