
export const jsonToUser = (json) => {
  return(
    new User(
      json.pk,
      json.first_name,
      json.last_name,
      json.saldo
    )
  );
}



export class User{

  constructor(id,firstname,lastname,saldo){
    this._id = id;
    this._firstname = firstname;
    this._lastname = lastname;
    this._saldo = saldo;
  }

  get id(){
    return this._id;
  }

  get fullname(){
    return `${this._firstname} ${this._lastname}`;
  }

  get saldo(){
    return this._saldo;
  }

  updateSaldo(diff){
    this._saldo += diff;
  }
}