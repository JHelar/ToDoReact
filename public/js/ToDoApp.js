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

class Logout extends React.Component{
    render(){
        <section>
            <button onClick={this.props.onLogout}>Logout</button>
        </section>
    }
}

class Header extends React.Component {
    constructor(props){
        super(props);
        this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }
    handleLogout(){
        this.props.onLogout();
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
                {!this.props.isLogged && <Register onRegisterSubmit={this.handleRegisterSubmit} />}<br/>
                {!this.props.isLogged && <Login onLoginSubmit={this.handleLoginSubmit} />}
                {this.props.isLogged && <Logout onLogout={this.handleLogout}/>}
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

class AddItem extends React.Component {
    constructor(props){
        super(props);
        this.handleItemAdd = this.handleItemAdd.bind(this);
    }
    handleItemAdd(e){
        e.preventDefault();
        this.props.onAddItem(this.refs.itemNameField.value);
    }
    render(){
        return (
            <form>
                <input ref="itemNameField" type="text" placeholder="New item..."/>
                <button onClick={this.handleItemAdd}>Add</button>
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
        this.handleItemAdd = this.handleItemAdd.bind(this);
    }
    handleItemAdd(name){
        var data = {
            ListID: this.props.list.ID,
            Name:name
        };
        var _this = this;
        $.post('/api/AddItem', JSON.stringify(data), function (e) {
            if(e.Status){
                _this.setState({
                    list:e.Object
                });
            }
        }, 'json');
    }
    componentWillReceiveProps(nextProps){
        if(nextProps !== this.state){
            this.setState({
                list:nextProps.list
            });
        }
    }
    render(){
        var rows = [];
        if(this.state.list !== null){
            this.state.list.Items.forEach(function(item){
                rows.push(<ListItem key={item.ID} item={item} />);
            });
        }
        var name = this.state.list === null ? "" : this.state.list.Name;
        return (
            <section>
                <h1>{name}</h1>
                <ul>
                    {rows}
                </ul>
                <AddItem onAddItem={this.handleItemAdd}/>
            </section>
        );
    }
}

class ListChoice extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(){
        this.props.onChoice(this.props.list);
    }
    render(){
        return (
            <li style={{backgroundColor: this.props.isSelected ? "blue" : "white" }} onClick={this.handleClick}>{this.props.list.Name}</li>
        );
    }
}

class ListChoices extends React.Component {
    constructor(props){
        super(props);
        this.handleListChoice = this.handleListChoice.bind(this);
    }
    handleListChoice(list){
        this.props.onDisplayList(list);
    }
    render(){
        var rows = [];
        var _this = this;
        if(this.props.lists !== null) {
            this.props.lists.forEach(function (list) {
                if(_this.props.currentList !== null && list.ID === _this.props.currentList.ID){
                    rows.push(<ListChoice key={list.ID} list={list} onChoice={_this.handleListChoice} isSelected={true}/>);

                }else {
                    rows.push(<ListChoice key={list.ID} list={list} onChoice={_this.handleListChoice} isSelected={false}/>);
                }
            });
        }
        console.log("ListChoice Render");
        return(
            <ul>
                {rows}
            </ul>
        );
    }
}

class ListApp extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentList: null,
            lists:[]
        };
        this.ignoreRefresh = false;
        this.refreshLists = this.refreshLists.bind(this);
        this.handleAddList = this.handleAddList.bind(this);
        this.handleDisplayList = this.handleDisplayList.bind(this);

    }
    componentWillReceiveProps(a){
        if(!this.ignoreRefresh)
        {
            this.refreshLists();
        }else{
            this.ignoreRefresh = false;
        }
    }
    refreshLists(){
        var _this = this;
        this.post('/api/GetLists',null, function (e) {
            if(e.Status){
                _this.ignoreRefresh = true;
                _this.setState({
                    lists:e.Object
                });
            }
        });
    }
    handleAddList(name){
        var data = {
            Name: name
        };
        var _this = this;
        this.post('/api/AddList', JSON.stringify(data), function (e) {
            if(e.Status){
                _this.ignoreRefresh = true;
                _this.state.lists.push(e.Object);
                _this.setState({
                    currentList:e.Object
                });
            }else{
                document.getElementById('response').innerHTML = "Error: " + e.Object;
            }
        });
    }
    handleDisplayList(list) {
        var data = {
            ID: list.ID
        };
        var _this = this;
        this.post('/api/GetList', JSON.stringify(data), function (e) {
           if(e.Status){
               _this.ignoreRefresh = true;
               _this.setState({
                   currentList:e.Object
               });
           }
        });
    }

    post(url, data, callback){
        $.post(url, data, callback, 'json');
    }
    render(){
        console.log("ListApp Render");
        return(
            <section>
                <ListChoices onDisplayList={this.handleDisplayList} currentList={this.state.currentList} lists={this.state.lists}/>
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
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            user:null,
            isLogged:false
        };
        var _this = this;
        this.post('/api/TryLogin',null, function (e) {
            if(e.Status){
                _this.setState({
                    user:e.Object,
                    isLogged:true
                });
            }
        });
    }
    handleLogout(){
        deleteCookie("SessionKey");
        var _this = this;
        this.post('/api/Logout', null, function (e) {
            _this.setState({
                user:null,
                isLogged:false
            });

        });
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
        var _this = this;
        this.post('/api/Login', JSON.stringify(loginObj), function (e) {
            if(e.Status) {
                //TODO: Save Object as safe cookie!
                document.getElementById('response').innerHTML = "You are logged in!";
                createCookie("SessionKey", e.Object.SessionKey, 20);
                _this.setState({
                    user:e.Object,
                    isLogged:true
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

        return (
            <section>
                <Header isLogged={this.state.isLogged} onRegisterSubmit={this.handleRegisterSubmit} onLoginSubmit={this.handleLoginSubmit} onLogout={this.handleLogout}/>
                <h1>{this.state.isLogged ? "Welcome " + this.state.user.UserName : "Not logged in!"}</h1>
                {this.state.isLogged && <ListApp />}
            </section>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);