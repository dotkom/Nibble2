import React from 'react';

import _ from 'lodash';


export class Keyboard extends React.Component{
  constructor(props){
    super(props);
    this.child = null;
  }
  
  handleChange(evt,keyboard,elm){
    if(this.props.onChange){
      this.props.onChange(elm.value);
    }
  }
  componentDidMount(){
    if(this.child)
      $(this.child).keyboard(
        _.assign(
          //Defaults
          {
            usePreview: false,
            autoAccept: true,
            layout: this.props.layout || 'qwerty-no',
            accepted: (...a) => this.handleChange(...a),
            canceled: (...a) => this.handleChange(...a) 
          },
          //Props
          _.omit(this.props,['onChange','children','accepted','canceled'])
        )
      );
  }
  childRef(element){
    this.child = element;
  }

  render(){
    return React.cloneElement(this.props.children,{
      ref: (...a) => {this.childRef(...a)},
      onChange: (evt) => {this.handleChange(evt,null,evt.target)}
    });
  }
}