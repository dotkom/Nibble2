



export class Stack {
  constructor(item, qty) {
    this._item = item;
    this._qty = qty;
  }

  inc() {
    this._qty = this._qty + 1;
  }
  
  get item() {
    return this._item;
  }

  canStack(item) {
    return this.item.id === item.id;
  }

  get qty() {
    return this._qty;
  }

  get cost() {
    return this.qty * this.item.price;
  }

  get checkoutObject() {
    return {
      object_id: this.item.id,
      quantity: this.qty,
    };
  }
}
