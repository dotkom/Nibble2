import { Observable, ReplaySubject } from 'rxjs';

import { API_BASE, API_INVENTORY } from 'common/constants';

import { http } from 'services/net';

export class InventoryServiceProvider {

  constructor(){
    this.inventory = {};
    this.inventorySubject = new ReplaySubject();
    this._reload();
  }

  _reload(){
    //Download inventory
    http.get(`${API_BASE}${API_INVENTORY}`).subscribe((data)=>{
      console.log(data);
    });
  }

  getInventory(){
    return this.inventorySubject.asObservable();
  }

}
// Export single instance
export const inventory = new InventoryServiceProvider();
