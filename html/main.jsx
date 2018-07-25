const Router = window.ReactRouter.Router;
const Route = window.ReactRouter.Route;
const hashHistory = window.ReactRouter.hashHistory;
const Link = window.ReactRouter.Link;

class Signin extends React.Component {
    constructor(props) {
      super(props);
      this.signIn = this.signIn.bind(this);
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handlePasswordChange = this.handlePasswordChange.bind(this);
      this.state = {
        name:'',
        password:''
      };
    }
    signIn(){
      axios.post('/signin', {
        name: this.state.name,
        password: this.state.password
      })
      .then(function (response) {
        if(response.data == 'Success'){
          window.location.assign('http://localhost:3000/home');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    handleNameChange(e){
      this.setState({name:e.target.value})
    }
    handlePasswordChange(e){
      this.setState({password:e.target.value})
    }
    render() {
      return (
        <div>
          <form className="form-signin">
            <h2 className="form-signin-heading">Вход в систему</h2>
            <div className="form-group">
              <label for="inputName" className="sr-only">Name</label>
              <input type="name" onChange={this.handleNameChange} id="inputName" className="form-control" placeholder="Name" required autofocus />
            </div>
            <div className="form-group">
              <label for="inputPassword" className="sr-only">Password</label>
              <input type="password" onChange={this.handlePasswordChange} id="inputPassword" className="form-control" placeholder="Password" required />
            </div>
            
            <button className="btn btn-lg btn-primary btn-block" onClick={this.signIn} type="button">Войти</button>
          </form>
          <div>
            <Link to="/signup">{'Signup'}</Link>
          </div>
        </div>

      )
    }
}

class Signup extends React.Component{
  constructor(props) {
    super(props);
    this.signUp = this.signUp.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.state = {
      name:'',
      email:'',
      password:'',
      succesText: ''
    };
  }
  
 
  updateText(){
    return !this.state.succesText ? "" :  (
      <div className="hidden-on">
        <div className="col-xs-12">
          <span className="visible-lg" style={{color: "green"}}>{this.state.succesText}</span>
        </div>
      </div>
    );
  }

  handleNameChange(e){
    this.setState({name:e.target.value})
  }

  handleEmailChange(e){
    this.setState({email:e.target.value})
  }

  handlePasswordChange(e){
    this.setState({password:e.target.value})
  }

  signUp(){
    this.setState({
      succesText:'✔ Спасибо за регистрацию, теперь вы можете войти в систему'
   });

    axios.post('/signup', {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
    })
    .then(function (response) {
      console.log(response);
      response ? hashHistory.push('/') : undefined;
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  render() {
      return (
        <div>
          <form className="form-signin">
            <h2 className="form-signin-heading">Регистрация</h2>
            <div className="form-group">
              <label for="inputName" className="sr-only">Name</label>
              <input type="name" onChange={this.handleNameChange} id="inputName" className="form-control" placeholder="Name" required autofocus />
            </div>
            <div className="form-group">
              <label for="inputEmail" className="sr-only">Email address</label>
              <input type="email" onChange={this.handleEmailChange} id="inputEmail" className="form-control" placeholder="Email address" required autofocus />
            </div>
            <div className="form-group">
              <label for="inputPassword" className="sr-only">Password</label>
              <input type="password" onChange={this.handlePasswordChange} id="inputPassword" className="form-control" placeholder="Password" required />
            </div>
            <div onClick={this.popUp}>
            <button className="btn btn-lg btn-primary btn-block" onClick={this.signUp} type="button">Зарегистрироваться</button></div>
          </form>
          {this.updateText()}
          <div>
            <Link to="/">{'Signin'}</Link>
          </div>
        </div>
        
      )
  }
}


ReactDOM.render(
    <Router history={hashHistory}>
        <Route component={Signin} path="/"></Route>
        <Route component={Signup} path="/signup"></Route>
    </Router>,
document.getElementById('app'));