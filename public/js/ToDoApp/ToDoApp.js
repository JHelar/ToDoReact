/**
 * Created by Johnh on 2016-11-05.
 */

//var ToDoHeader = require('../compiled/ToDoHeader.js').default;
//var ToDoList = require('../compiled/ToDoList.js').default;


import ToDoList from './ToDoList'
import ToDoHeader from './ToDoHeader'


class App extends React.Component {
    constructor(props){
        super(props);


        this.handleRegister = this.handleRegister.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        this.post = this.post.bind(this);

        this.state = {
            isLogged:props.isLogged,
            user:props.user
        }
    }
    handleRegister(regObj){
        var _this = this;
        this.post('/api/Register', regObj, function (e) {
           if(e.Status){
                createCookie('SessionKey', e.Object.SessionKey);
               document.getElementById('response').style.display = "none";
                _this.setState({
                    isLogged:true,
                    user:e.Object
                });
           }else{
               document.getElementById('response').style.display = "block";
               document.getElementById('response').innerHTML = JSON.stringify(e.Object)
           }
        });
    }
    handleLogin(logObj){
        var _this = this;
        this.post('/api/Login', logObj, function (e) {
            if(e.Status){
                document.getElementById('response').style.display = "none";
                createCookie('SessionKey', e.Object.SessionKey, 10);
                _this.setState({
                    isLogged:true,
                    user:e.Object
                });
            }else{
                document.getElementById('response').style.display = "block";
                document.getElementById('response').innerHTML = JSON.stringify(e.Object)
            }
        });
    }
    handleLogout(){
        deleteCookie('SessionKey');
        var _this = this;
        this.post('/api/Logout', null, function (e) {
            _this.setState({
                isLogged:false,
                user:null
            });
        });
    }
    post(url, data, callback){
        $.post(url, JSON.stringify(data), callback, 'json');
    }
    render(){

        return (
            <div>
                <ToDoHeader user={this.state.user} isLogged={this.state.isLogged} onLogin={this.handleLogin} onRegister={this.handleRegister} onLogout={this.handleLogout}/>
                <ToDoList isLogged={this.state.isLogged}/>
            </div>
        );
    }
}

$.post('/api/TryLogin', null, function (e) {
    if(e.Status){
        ReactDOM.render(
            <App user={e.Object} isLogged={true} />,
            document.getElementById('app')
        );
    }else{
        deleteCookie('SessionKey');
        ReactDOM.render(
            <App user={null} isLogged={false} />,
            document.getElementById('app')
        );
    }
}, 'json');
