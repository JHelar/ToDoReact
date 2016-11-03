/**
 * Created by johnla on 2016-11-03.
 */
class Register extends React.Component {
    constructor(props){
        super(props);
        this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    }
    handleRegisterSubmit(e){
        e.preventDefault();

        var obj = {
            Email: this.refs.emailField.value,
            UserName: this.refs.userNameField.value,
            Password: this.refs.passwordField.value
        };
        this.props.onRegisterSubmit(obj);
    }
    render(){
        return(
            <section>
                <h1>Register TEST</h1>
                <form>
                    <input ref="emailField" type="text" placeholder="Email" />
                    <input ref="userNameField" type="text" placeholder="UserName" />
                    <input ref="passwordField" type="password" placeholder="Password" />
                    <button onClick={this.handleRegisterSubmit}>Submit</button>
                </form>
            </section>
        );
    }
}

class Login extends React.Component {
    constructor(props){
        super(props);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    }
    handleLoginSubmit(e){
        e.preventDefault();

        var obj = {
            Email: this.refs.emailField.value,
            Password: this.refs.passwordField.value
        };
        this.props.onLoginSubmit(obj);
    }
    render(){
        return(
            <section>
                <h1>Login TEST</h1>
                <form>
                    <input ref="emailField" type="text" placeholder="Email" />
                    <input ref="passwordField" type="password" placeholder="Password" />
                    <button onClick={this.handleLoginSubmit}>Login</button>
                </form>
            </section>
        );
    }
}

class Header extends React.Component {
    constructor(props){
        super(props);
        this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    }
    handleRegisterSubmit(registerObj){
        this.props.onRegisterSubmit(registerObj);
    }
    handleLoginSubmit(loginObj){
        this.props.onLoginSubmit(loginObj);
    }
    render(){
        return (
            <header>
                <Register onRegisterSubmit={this.handleRegisterSubmit} /><br/>
                <Login onLoginSubmit={this.handleLoginSubmit} />
            </header>
        );
    }
}

class AddList extends React.Component {
    constructor(props){
        super(props);
        this.handleListAdd = this.handleListAdd.bind(this);
    }
    handleListAdd(e){
        e.preventDefault();
        this.props.onAddList(this.refs.listNameField.value);
    }
    render(){
        return(
            <form>
                <input ref="listNameField" type="text" placeholder="New list name"/>
                <button onClick={this.handleListAdd}>Add</button>
            </form>
        );
    }
}

class ListItem extends React.Component {
    render(){
        var className = this.props.item.Done ? "item done" : "item not-done";
        var icon = this.props.item.Done ? "fa fa-check-square" : "fa fa-square";
        return (
            <li className={className}>
                <td className="name">{this.props.item.Name}</td>
                <td className="checkbox"><i className={icon}></i></td>
            </li>
        );
    }
}

class ListDisplay extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            list:props.list
        };
    }
    render(){
        var rows = [];
        if(this.state.list !== null){
            this.state.list.items.forEach(function(item){
                rows.push(<ListItem item={item} />);
            });
        }
        var name = this.state.list === null ? "" : this.state.list.Name;
        return (
            <section>
                <h1>{name}</h1>
                <ul>
                    {rows}
                </ul>
            </section>
        );
    }
}

class ListApp extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentList: null
        };
        this.handleAddList = this.handleAddList.bind(this);
    }
    handleAddList(name){
        var data = {
            Key: getCookie('SessionKey'),
            Name: name
        };
        var _this = this;
        this.post('/api/AddList', data, function (e) {
            if(e.Status){
                _this.setState({
                    currentList:e.Object
                });
            }else{
                document.getElementById('response').innerHTML = "Error: " + e.Object;
            }
        });
    }
    post(url, data, callback){
        $.post(url, data, callback, 'json');
    }
    render(){
        return(
            <section>
                <AddList onAddList={this.handleAddList}/>
                <ListDisplay list={this.state.currentList}/>
            </section>
        );
    }

}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    }
    handleRegisterSubmit(registerObj){
        this.post('/api/Register', JSON.stringify(registerObj), function (e) {
            if(e.Status) {
                document.getElementById('response').innerHTML = JSON.stringify(e.Object);
            }else{
                document.getElementById('response').innerHTML = "Error: " + e.Object;
            }
        });
    }
    handleLoginSubmit(loginObj){
        this.post('/api/Login', JSON.stringify(loginObj), function (e) {
            if(e.Status) {
                //TODO: Save Object as safe cookie!
                document.getElementById('response').innerHTML = "You are logged in!";
                createCookie("SessionKey", e.Object.SessionKey, 20);
            }else{
                document.getElementById('response').innerHTML = "Error: " + e.Object;
            }
        });
    }
    post(url, data, callback){
        $.post(url, data, callback, 'json');
    }
    render(){
        return (
            <section>
                <Header onRegisterSubmit={this.handleRegisterSubmit} onLoginSubmit={this.handleLoginSubmit}/>
                <ListApp />
            </section>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);