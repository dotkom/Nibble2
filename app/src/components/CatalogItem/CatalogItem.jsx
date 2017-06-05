import React from 'react';

export function CatalogItem({item, onAdd}){
  return (
    <div className="catalogCard" onClick={() => onAdd(item)}>
      <img className="catalogImage" src={item.image ? item.image.small : 'assets/images/trikom.png'} alt={item.name} />
      <div className="catalogInformation">
        <p className="catalogName">{item.name}</p>
        <p className="catalogDesc">{item.description}</p>
        <p className="catalogPrice">{item.price}kr</p>
      </div>
      <div className="catalogButton">
        <a className="add waves-effect waves-blue btn btn-flat nibble-color lighter left-align">
          Legg til
        </a>
      </div>
    </div>
  );
}