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
          inv.push(jsonToItem(item, cat && cats[cat.pk]));
        }
        this.inventory = inv;
      });
  }

  set inventory(inv) {
    this._inventory = inv;
    this._inventorySubject.next(inv.slice());
  }

  getInventory() {
    return this._inventorySubject.asObservable().take(1);
  }
}

export class DevInventoryServiceProvider {
  constructor() {
    this._categories = {};
    this._inventorySubject = new ReplaySubject();
    let categories = [
      new Category(1,"Snacks"),
      new Category(2,"Foods"),
      new Category(3,"Drinks")
    ];
    this.inventory = [
      new Item(1,"Mr. Lee Chicken",10,"Chicken 65g",null,categories[1]),
      new Item(2,"Soda",20,"Sugar Free!",null,categories[2]),
      new Item(3,"Chocolate Bar",16,"25g",null,categories[0])
    ];
  }
  
  set inventory(inv) {
    this._inventory = inv;
    this._inventorySubject.next(inv.slice());
  }

  getInventory() {
    return this._inventorySubject.asObservable().take(1);
  }
}


// Export single instance
export const inventory = new InventoryServiceProvider();
