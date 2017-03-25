import { API_BASE, API_RFID, API_USERS } from 'common/constants';
import { isRfid } from 'common/utils';
import { http } from 'services/net';
import { User, jsonToUser } from './user';
import { Observable } from 'rxjs';




export class UserServiceProvider{
  constructor(){
  }

  getUser(rfid){
    if(isRfid(rfid)){
      return http.get(`${API_BASE}${API_USERS}`,{
        rfid: rfid
      }).flatMap(ret => {
        if(ret.count == 1){
          let userData = ret.results[0];
          return Observable.of(jsonToUser(userData));
        }
        return Observable.throw("Validering feilet!");
      });
    }
    return Observable.throw("Invalid RFID");
  }

  updateSaldo(user,diff){
    if(!(diff + user.saldo < 0)){
      return http.post(`${API_BASE}${API_TRANSACTIONS}`,{
        user: user.id,
        amount: diff
      }).map(() => {
        user.updateSaldo(diff);
      });
    }
    return Observable.throw("");
  }

  bindRfid(username,password,rfid){
    if(isRfid(rfid)){
      return http.post(`${API_BASE}${API_RFID}`,{
        username: username,
        password: password,
        rfid: rfid
      });
    }
    
    return Observable.throw("Invalid RFID");
  }
}

class DevUserServiceProvider extends UserServiceProvider{
  getUser(rfid){
    return Observable.of(new User(-1,"Dev","User",699));
  }
}



export const userService = new DevUserServiceProvider();