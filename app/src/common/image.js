import { BASE } from './constants';

export const jsonToImage = json => (
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
      json.photographer,
    )
  );

export class Image {
  constructor(id, name, description, thumb, original, wide, lg, md, sm, xs, tags, photographer) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._thumb = thumb;
    this._original = original;
    this._wide = wide;
    this._lg = lg;
    this._md = md;
    this._sm = sm;
    this._xs = xs;
    this._tags = tags;
    this._photographer = photographer;
  }
  get thumb() {
    return `${BASE}${this._thumb}`;
  }
  get large() {
    return `${BASE}${this._lg}`;
  }
  get medium() {
    return `${BASE}${this._md}`;
  }
  get small() {
    return `${BASE}${this._sm}`;
  }
  get wide() {
    return `${BASE}${this._wide}`;
  }
  get extraSmall() {
    return `${BASE}${this._xs}`;
  }
  get tags() {
    return this._tags;
  }
  get original() {
    return `${BASE}${this._original}`;
  }
  get description() {
    return this._description;
  }
  get name() {
    return this._name;
  }
}
