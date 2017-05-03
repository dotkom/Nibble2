import { Observable, ReplaySubject } from 'rxjs';

import { API_BASE, API_INVENTORY } from 'common/constants';

import { http } from 'services/net';

import { Category } from './category';
import { Item, jsonToItem } from './item';


export class InventoryServiceProvider {

  constructor() {
    this._inventory = [];
    this._categories = {};
    this._inventorySubject = new ReplaySubject();
    this._reload();
  }
  _reload() {
    // Download inventory
    http.get(`${API_BASE}${API_INVENTORY}`)
      .subscribe((items) => {
        const inv = [];
        const cats = {};
        for (const item of items) {
          const cat = item.category;
          if (cat) {
            cats[cat.pk] = cats[cat.pk] || new Category(cat.pk, cat.name);
          }
          inv.push(jsonToItem(item, cats[cat.pk]));
        }
        this.inventory = inv;
      });
  }

  set inventory(inv) {
    this._inventory = inv;
    this._inventorySubject.next(inv);
  }

  getInventory() {
    return this._inventorySubject.asObservable().take(1);
  }

}
// Export single instance
export const inventory = new InventoryServiceProvider();
