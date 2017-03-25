import React from 'react';
import { render } from 'react-dom';
import { Navbar,NavItem,Icon } from 'react-materialize';
import { API_BASE } from 'common/constants'; 
import { http } from 'services/net';
//import { inventory } from 'services/inventory';
import { Navigation } from 'components/navigation.jsx';
import { Observable, Subject } from 'rxjs';
import { userService } from 'services/user';
import { LoginView, ShopView } from 'views/';




class App extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      user: null,
      loginState: 0
    }
  }
  
  submitLogin(rfid){
    let sub = new Subject();
    userService.getUser(rfid).subscribe(user => {
      sub.next(2);
      this.setState(Object.assign(this.state,{
        user: user
      }));
    },()=>{
      sub.next(3);
    },()=>{
      sub.complete();
    });
    return sub.asObservable();
  }
  
  submitLogout(){
    this.setState(Object.assign(this.state,{
      user: null
    }));
  }
  render () {
    const brand = <span><img className="logo" src="./assets/images/favicon.png"/>Nibble</span>
    const currentView = (this.state.user==null) ? 
      <LoginView 
        onSubmit={(rfid) => this.submitLogin(rfid)}
      ></LoginView> : 
      <ShopView 
        user={this.state.user}
        onExit={() => this.submitLogout()}
      ></ShopView>;
      
    return (
      <div>
        <div className="navbar-fixed">
          <Navbar brand={brand} right>
            <Navigation 
              user={this.state.user}
              onExit={() => this.submitLogout()}
              ></Navigation>
          </Navbar>
        </div>
        {currentView}
      </div>
    );
  }
}



render(<App />, document.getElementById('app'));