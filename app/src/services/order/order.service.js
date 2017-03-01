import { Observable, ReplaySubject } from 'rxjs';

import { API_BASE, API_ORDER } from 'common/constants';
import { http } from 'services/net';


export class OrderServiceProvider {

  constructor(){
  }
  checkoutOrder(user,orders){
    return http.post(`${API_BASE}${API_ORDER}`,{
      user: user.id,
      orders: orders
    });
  }
  
}
// Export single instance
export const orderService = new OrderServiceProvider();
