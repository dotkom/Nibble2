import React from 'react';

export function Tab({size, id, title, disabled}){
  return (
    <li className={`tab col s${size || 2} ${disabled ? "disabled" : ""}`}>
      <a href={`#${id}`}>{title}</a>
    </li>
  );
}