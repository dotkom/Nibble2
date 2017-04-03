import { Observable, ReplaySubject } from 'rxjs';

import { API_BASE, API_ORDER } from 'common/constants';
import { http } from 'services/net';


export class OrderServiceProvider {

  constructor(){
  }
  checkoutOrder(user,cart){
    let orders = [];
    let totalPrice = 0;
    for(let o of cart) {
      totalPrice += o.cost;
      orders.push(o.checkoutObject);
    }
    user.updateSaldo(-totalPrice);
    return http.post(`${API_BASE}${API_ORDER}`,{
      user: user.id,
      orders: orders
    }).catch((ret) => {
      //Error, add saldo back
      user.updateSaldo(totalPrice);
      return Observable.throw("Something went wrong.");
    });
  }

}
// Export single instance
export const orderService = new OrderServiceProvider();
