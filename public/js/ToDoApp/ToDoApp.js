/**
 * Created by Johnh on 2016-11-05.
 */
class App extends React.Component {
    constructor(props){
        super(props);


        this.handleRegister = this.handleRegister.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            isLogged:false
        }
    }
    handleRegister(regObj){

    }
    handleLogin(logObj){

    }
    handleLogout(){

    }
    render(){
        return (
            <div>
                <ToDoHeader isLogged={this.props.isLogged} onLogin={this.handleLogin} onRegister={this.handleRegister} onLogout={this.handleLogout}/>
                <main></main>
            </div>
        );
    }
}