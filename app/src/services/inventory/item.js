import { jsonToImage } from 'common/image';
import { category } from './category';

export class Item {
  constructor(id, name, price, description, image, category) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._description = description;
    this._image = image;
    this._category = category;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get price() {
    return this._price;
  }

  get image() {
    return this._image;
  }

  get category() {
    return this._category;
  }
}

export const jsonToItem = (json, category) => (
    new Item(
      json.pk,
      json.name,
      json.price,
      json.description,
      json.image && jsonToImage(json.image),
      category || (json.category && new category(json.category.pk, json.category.name)),
    )
  );

