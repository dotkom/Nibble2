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
      user: null
    }
  }
  
  submitLogin(rfid){
    userService.getUser(rfid).subscribe(user => {
      this.setState(Object.assign(this.state,{
        user: user
      }));
    });
  }
  
  render () {
    const brand = <span><img className="logo" src="./assets/images/favicon.png"/>Nibble</span>
    const currentView = (this.state.user==null) ? <LoginView onSubmit={(rfid) => this.submitLogin(rfid)}></LoginView> : <ShopView></ShopView>;
      
    return (
      <div>
        <Navbar brand={brand} right>
          <Navigation user={this.state.user}></Navigation>
        </Navbar>
        {currentView}
      </div>
    );
  }
}



render(<App />, document.getElementById('app'));