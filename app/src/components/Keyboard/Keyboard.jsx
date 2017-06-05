
import React, {Component} from 'react';



export class Keyboard extends React.Component{
  constructor(props){
    super(props);
  }
  
  handleChange(evt,keyboard,elm){
    if(this.props.onChange){
      this.props.onChange(elm.value);
    }
  }

  childRef(element){
    //Default element
    $(element).keyboard({
      accepted: (...a) => this.handleChange(...a),
      canceled: (...a) => this.handleChange(...a),
      usePreview: false,
      autoAccept: true,
      layout: this.props.layout || 'qwerty-no' 
    });
  }

  render(){
    return React.cloneElement(this.props.children,{
      ref: (...a) => {this.childRef(...a)},
      onChange: (evt) => {this.handleChange(evt,null,evt.target)}
    });
  }
}