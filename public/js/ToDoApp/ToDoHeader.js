/**
 * Created by Johnh on 2016-11-05.
 */
class Register extends React.Component {
    constructor(props){
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
        this.state = {
            expanded:false
        }
    }
    handleExpand(){
        this.setState((prevState) => ({
            expanded:!prevState.expanded
        }));
    }
    handleRegister(e){
        e.preventDefault();

        var obj = {
            Email: this.refs.emailField.value,
            UserName: this.refs.userNameField.value,
            Password: this.refs.passwordField.value
        };
        this.props.onRegister(obj);
    }
    render(){

        return(
            <div>
                <button className="headerbtn" onClick={this.handleExpand}>Register</button>
                {this.state.expanded && <form className="submitForm">
                    <input ref="emailField" type="text" placeholder="Email" />
                    <input ref="userNameField" type="text" placeholder="UserName" />
                    <input ref="passwordField" type="password" placeholder="Password" />
                    <button onClick={this.handleRegister}>Submit</button>
                </form>}
            </div>
        );
    }
}

class Login extends React.Component {
    constructor(props){
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
        this.state = {
            expanded:false
        }
    }
    handleExpand(){
        this.setState((prevState) => ({
            expanded:!prevState.expanded
        }));
    }
    handleLogin(e){
        e.preventDefault();

        var obj = {
            Email: this.refs.emailField.value,
            Password: this.refs.passwordField.value
        };
        this.props.onLogin(obj);
    }
    render(){

        return  (
            <div>
                <button className="headerbtn" onClick={this.handleExpand}>Login</button>
                {this.state.expanded && <form className="submitForm">
                    <input ref="emailField" type="text" placeholder="Email" />
                    <input ref="passwordField" type="password" placeholder="Password" />
                    <button onClick={this.handleLogin}>Submit</button>
                </form>}
            </div>
        );

    }
}

class Logout extends React.Component {
    constructor(props){
        super(props);

    }
    render(){

        return (
            <div>
                <button className="headerbtn" onClick={this.props.onLogout}>Logout</button>
            </div>
        );
    }
}

class LoginPanel extends React.Component {
    render(){

        return(
            <div className="loginPanel">
                <Register onRegister={this.props.onRegister}/>
                {this.props.isLogged ? <Logout onLogout={this.props.onLogout}/> : <Login onLogin={this.props.onLogin}/>}
            </div>
        );
    }
}

class ToDoHeader extends React.Component {
    render() {

        return(
            <header className="mainHeader">
                <div className="content">
                    {this.props.isLogged ? <h1>{"ToDoReact, " + this.props.user.UserName}</h1> : <h1>ToDoReact</h1>}
                    <LoginPanel isLogged={this.props.isLogged} onLogin={this.props.onLogin} onLogout={this.props.onLogout} onRegister={this.props.onRegister}/>
                </div>
            </header>
        );
    }
}
export default ToDoHeader;