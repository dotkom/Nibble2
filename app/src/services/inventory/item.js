import { jsonToImage } from 'common/image';
import { category } from './category';


export const jsonToItem = (json,category) => {
  return (
    new Item(
      json.pk,
      json.name,
      json.price,
      json.description,
      json.image && jsonToImage(json.image),
      category || (json.category && new category(json.category.pk,json.category.name))
    )
  );
}

export class Item{
  constructor(id,name,price,description,image,category){
    this._id = id;
    this._name = name;
    this._price = price;
    this._description = description;
    this._image = image;
    this._category = category;
  }


}