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
    
    return http.post(`${API_BASE}${API_ORDER}`,{
      user: user.id,
      orders: orders
    }).map((ret) => {
      console.log(ret)
      user.updateSaldo(-totalPrice);
    });
  }
  
}
// Export single instance
export const orderService = new OrderServiceProvider();
