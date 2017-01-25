import { BASE } from './constants';

export const jsonToImage = (json) => {
  return (
    new Image(
      json.id,
      json.name,
      json.description,
      json.thumb,
      json.original,
      json.wide,
      json.lg,
      json.md,
      json.xs,
      json.tags,
      json.photographer
    )
  );
}

export class Image{
  constructor(id,name,description,thumb,original,wide,lg,md,sm,xs,tags,photographer){
    this._id = id;
    this._name = name;
    this._description = description;
    this._thumb = thumb;
    this._original = original;
    this._wide = wide;
    this._lg = lg;
    this._md = md;
    this._xs = xs;
    this._tags = tags;
    this._photographer = photographer;
  }
  get thumb(){
    return `${BASE}${this._thumb}`;
  }

}