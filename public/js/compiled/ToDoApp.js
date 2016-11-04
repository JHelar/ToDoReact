(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by johnla on 2016-11-03.
 */
class Register extends React.Component {
    constructor(props) {
        super(props);
        this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    }
    handleRegisterSubmit(e) {
        e.preventDefault();

        var obj = {
            Email: this.refs.emailField.value,
            UserName: this.refs.userNameField.value,
            Password: this.refs.passwordField.value
        };
        this.props.onRegisterSubmit(obj);
    }
    render() {
        return React.createElement(
            "section",
            null,
            React.createElement(
                "h1",
                null,
                "Register TEST"
            ),
            React.createElement(
                "form",
                null,
                React.createElement("input", { ref: "emailField", type: "text", placeholder: "Email" }),
                React.createElement("input", { ref: "userNameField", type: "text", placeholder: "UserName" }),
                React.createElement("input", { ref: "passwordField", type: "password", placeholder: "Password" }),
                React.createElement(
                    "button",
                    { onClick: this.handleRegisterSubmit },
                    "Submit"
                )
            )
        );
    }
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    }
    handleLoginSubmit(e) {
        e.preventDefault();

        var obj = {
            Email: this.refs.emailField.value,
            Password: this.refs.passwordField.value
        };
        this.props.onLoginSubmit(obj);
    }
    render() {
        return React.createElement(
            "section",
            null,
            React.createElement(
                "h1",
                null,
                "Login TEST"
            ),
            React.createElement(
                "form",
                null,
                React.createElement("input", { ref: "emailField", type: "text", placeholder: "Email" }),
                React.createElement("input", { ref: "passwordField", type: "password", placeholder: "Password" }),
                React.createElement(
                    "button",
                    { onClick: this.handleLoginSubmit },
                    "Login"
                )
            )
        );
    }
}

class Logout extends React.Component {
    render() {
        React.createElement(
            "section",
            null,
            React.createElement(
                "button",
                { onClick: this.props.onLogout },
                "Logout"
            )
        );
    }
}

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }
    handleLogout() {
        this.props.onLogout();
    }
    handleRegisterSubmit(registerObj) {
        this.props.onRegisterSubmit(registerObj);
    }
    handleLoginSubmit(loginObj) {
        this.props.onLoginSubmit(loginObj);
    }
    render() {
        return React.createElement(
            "header",
            null,
            !this.props.isLogged && React.createElement(Register, { onRegisterSubmit: this.handleRegisterSubmit }),
            React.createElement("br", null),
            !this.props.isLogged && React.createElement(Login, { onLoginSubmit: this.handleLoginSubmit }),
            this.props.isLogged && React.createElement(Logout, { onLogout: this.handleLogout })
        );
    }
}

class AddList extends React.Component {
    constructor(props) {
        super(props);
        this.handleListAdd = this.handleListAdd.bind(this);
    }
    handleListAdd(e) {
        e.preventDefault();
        this.props.onAddList(this.refs.listNameField.value);
    }
    render() {
        return React.createElement(
            "form",
            null,
            React.createElement("input", { ref: "listNameField", type: "text", placeholder: "New list name" }),
            React.createElement(
                "button",
                { onClick: this.handleListAdd },
                "Add"
            )
        );
    }
}

class AddItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleItemAdd = this.handleItemAdd.bind(this);
    }
    handleItemAdd(e) {
        e.preventDefault();
        this.props.onAddItem(this.refs.itemNameField.value);
    }
    render() {
        return React.createElement(
            "form",
            null,
            React.createElement("input", { ref: "itemNameField", type: "text", placeholder: "New item..." }),
            React.createElement(
                "button",
                { onClick: this.handleItemAdd },
                "Add"
            )
        );
    }
}

class ListItem extends React.Component {
    render() {
        var className = this.props.item.Done ? "item done" : "item not-done";
        var icon = this.props.item.Done ? "fa fa-check-square" : "fa fa-square";
        return React.createElement(
            "li",
            { className: className },
            React.createElement(
                "td",
                { className: "name" },
                this.props.item.Name
            ),
            React.createElement(
                "td",
                { className: "checkbox" },
                React.createElement("i", { className: icon })
            )
        );
    }
}

class ListDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list
        };
        this.handleItemAdd = this.handleItemAdd.bind(this);
    }
    handleItemAdd(name) {
        var data = {
            ListID: this.props.list.ID,
            Name: name
        };
        var _this = this;
        $.post('/api/AddItem', JSON.stringify(data), function (e) {
            if (e.Status) {
                _this.setState({
                    list: e.Object
                });
            }
        }, 'json');
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.state) {
            this.setState({
                list: nextProps.list
            });
        }
    }
    render() {
        var rows = [];
        if (this.state.list !== null) {
            this.state.list.Items.forEach(function (item) {
                rows.push(React.createElement(ListItem, { key: item.ID, item: item }));
            });
        }
        var name = this.state.list === null ? "" : this.state.list.Name;
        return React.createElement(
            "section",
            null,
            React.createElement(
                "h1",
                null,
                name
            ),
            React.createElement(
                "ul",
                null,
                rows
            ),
            React.createElement(AddItem, { onAddItem: this.handleItemAdd })
        );
    }
}

class ListChoice extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.props.onChoice(this.props.list);
    }
    render() {
        return React.createElement(
            "li",
            { style: { backgroundColor: this.props.isSelected ? "blue" : "white" }, onClick: this.handleClick },
            this.props.list.Name
        );
    }
}

class ListChoices extends React.Component {
    constructor(props) {
        super(props);
        this.handleListChoice = this.handleListChoice.bind(this);
    }
    handleListChoice(list) {
        this.props.onDisplayList(list);
    }
    render() {
        var rows = [];
        var _this = this;
        if (this.props.lists !== null) {
            this.props.lists.forEach(function (list) {
                if (_this.props.currentList !== null && list.ID === _this.props.currentList.ID) {
                    rows.push(React.createElement(ListChoice, { key: list.ID, list: list, onChoice: _this.handleListChoice, isSelected: true }));
                } else {
                    rows.push(React.createElement(ListChoice, { key: list.ID, list: list, onChoice: _this.handleListChoice, isSelected: false }));
                }
            });
        }
        console.log("ListChoice Render");
        return React.createElement(
            "ul",
            null,
            rows
        );
    }
}

class ListApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentList: null,
            lists: []
        };
        this.ignoreRefresh = false;

        this.handleAddList = this.handleAddList.bind(this);
        this.handleDisplayList = this.handleDisplayList.bind(this);
    }

    handleAddList(name) {
        var data = {
            Name: name
        };
        var _this = this;
        this.post('/api/AddList', JSON.stringify(data), function (e) {
            if (e.Status) {
                _this.ignoreRefresh = true;
                _this.state.lists.push(e.Object);
                _this.setState({
                    currentList: e.Object
                });
            } else {
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
            if (e.Status) {
                _this.ignoreRefresh = true;
                _this.setState({
                    currentList: e.Object
                });
            }
        });
    }

    post(url, data, callback) {
        $.post(url, data, callback, 'json');
    }
    render() {
        console.log("ListApp Render");
        return React.createElement(
            "section",
            null,
            React.createElement(ListChoices, { onDisplayList: this.handleDisplayList, currentList: this.state.currentList, lists: this.state.lists }),
            React.createElement(AddList, { onAddList: this.handleAddList }),
            React.createElement(ListDisplay, { list: this.state.currentList })
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
            user: null,
            isLogged: false
        };
        var _this = this;
        this.post('/api/TryLogin', null, function (e) {
            if (e.Status) {
                _this.setState({
                    user: e.Object,
                    isLogged: true
                });
            }
        });
    }
    handleLogout() {
        deleteCookie("SessionKey");
        var _this = this;
        this.post('/api/Logout', null, function (e) {
            _this.setState({
                user: null,
                isLogged: false
            });
        });
    }
    handleRegisterSubmit(registerObj) {
        this.post('/api/Register', JSON.stringify(registerObj), function (e) {
            if (e.Status) {
                document.getElementById('response').innerHTML = JSON.stringify(e.Object);
            } else {
                document.getElementById('response').innerHTML = "Error: " + e.Object;
            }
        });
    }
    handleLoginSubmit(loginObj) {
        var _this = this;
        this.post('/api/Login', JSON.stringify(loginObj), function (e) {
            if (e.Status) {
                //TODO: Save Object as safe cookie!
                document.getElementById('response').innerHTML = "You are logged in!";
                createCookie("SessionKey", e.Object.SessionKey, 20);
                _this.setState({
                    user: e.Object,
                    isLogged: true
                });
            } else {
                document.getElementById('response').innerHTML = "Error: " + e.Object;
            }
        });
    }
    post(url, data, callback) {
        $.post(url, data, callback, 'json');
    }
    render() {

        return React.createElement(
            "section",
            null,
            React.createElement(Header, { isLogged: this.state.isLogged, onRegisterSubmit: this.handleRegisterSubmit, onLoginSubmit: this.handleLoginSubmit, onLogout: this.handleLogout }),
            React.createElement(
                "h1",
                null,
                this.state.isLogged ? "Welcome " + this.state.user.UserName : "Not logged in!"
            ),
            this.state.isLogged && React.createElement(ListApp, null)
        );
    }
}

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));

},{}]},{},[1]);
