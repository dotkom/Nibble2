import React from 'react';
import { Button } from 'react-materialize';

export function StackItem({ stack, onRemove }) {
  return (
    <li className="cart-item">
      <span className="item-name">
        { stack.item.name }
      </span>
      <div>
        <span className="item-count">
          { stack.qty } x { stack.item.price },-
        </span>
        <Button
          floating
          large
          className="right remove waves-red"
          onClick={() => onRemove(stack)}
          icon="clear"
          waves="light"
        />
      </div>
    </li>
  );
}
