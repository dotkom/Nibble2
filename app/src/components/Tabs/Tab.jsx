import React from 'react';
import classNames from 'classnames';
export function Tab({size, id, title, disabled}){
  return (
    <li className={
      classNames("tab col",{
        [`s${size || 2}`]: true,
        disabled: disabled
      })}
    >
      <a href={`#${id}`}>{title}</a>
    </li>
  );
}