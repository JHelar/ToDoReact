(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ToDoList = require('./ToDoList');

var _ToDoList2 = _interopRequireDefault(_ToDoList);

var _ToDoHeader = require('./ToDoHeader');

var _ToDoHeader2 = _interopRequireDefault(_ToDoHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Johnh on 2016-11-05.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

//var ToDoHeader = require('../compiled/ToDoHeader.js').default;
//var ToDoList = require('../compiled/ToDoList.js').default;


var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this2 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this2.handleRegister = _this2.handleRegister.bind(_this2);
        _this2.handleLogin = _this2.handleLogin.bind(_this2);
        _this2.handleLogout = _this2.handleLogout.bind(_this2);

        _this2.post = _this2.post.bind(_this2);

        _this2.state = {
            isLogged: props.isLogged,
            user: props.user
        };
        return _this2;
    }

    _createClass(App, [{
        key: 'handleRegister',
        value: function handleRegister(regObj) {
            var _this = this;
            this.post('/api/Register', regObj, function (e) {
                if (e.Status) {
                    createCookie('SessionKey', e.Object.SessionKey);
                    document.getElementById('response').style.display = "none";
                    _this.setState({
                        isLogged: true,
                        user: e.Object
                    });
                } else {
                    document.getElementById('response').style.display = "block";
                    document.getElementById('response').innerHTML = JSON.stringify(e.Object);
                }
            });
        }
    }, {
        key: 'handleLogin',
        value: function handleLogin(logObj) {
            var _this = this;
            this.post('/api/Login', logObj, function (e) {
                if (e.Status) {
                    document.getElementById('response').style.display = "none";
                    createCookie('SessionKey', e.Object.SessionKey, 10);
                    _this.setState({
                        isLogged: true,
                        user: e.Object
                    });
                } else {
                    document.getElementById('response').style.display = "block";
                    document.getElementById('response').innerHTML = JSON.stringify(e.Object);
                }
            });
        }
    }, {
        key: 'handleLogout',
        value: function handleLogout() {
            deleteCookie('SessionKey');
            var _this = this;
            this.post('/api/Logout', null, function (e) {
                _this.setState({
                    isLogged: false,
                    user: null
                });
            });
        }
    }, {
        key: 'post',
        value: function post(url, data, callback) {
            $.post(url, JSON.stringify(data), callback, 'json');
        }
    }, {
        key: 'render',
        value: function render() {

            return React.createElement(
                'div',
                null,
                React.createElement(_ToDoHeader2.default, { user: this.state.user, isLogged: this.state.isLogged, onLogin: this.handleLogin, onRegister: this.handleRegister, onLogout: this.handleLogout }),
                React.createElement(_ToDoList2.default, { isLogged: this.state.isLogged })
            );
        }
    }]);

    return App;
}(React.Component);

$.post('/api/TryLogin', null, function (e) {
    if (e.Status) {
        ReactDOM.render(React.createElement(App, { user: e.Object, isLogged: true }), document.getElementById('app'));
    } else {
        deleteCookie('SessionKey');
        ReactDOM.render(React.createElement(App, { user: null, isLogged: false }), document.getElementById('app'));
    }
}, 'json');

},{"./ToDoHeader":2,"./ToDoList":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by Johnh on 2016-11-05.
 */
var Register = function (_React$Component) {
    _inherits(Register, _React$Component);

    function Register(props) {
        _classCallCheck(this, Register);

        var _this = _possibleConstructorReturn(this, (Register.__proto__ || Object.getPrototypeOf(Register)).call(this, props));

        _this.handleRegister = _this.handleRegister.bind(_this);
        _this.handleExpand = _this.handleExpand.bind(_this);
        _this.state = {
            expanded: false
        };
        return _this;
    }

    _createClass(Register, [{
        key: "handleExpand",
        value: function handleExpand() {
            this.setState(function (prevState) {
                return {
                    expanded: !prevState.expanded
                };
            });
        }
    }, {
        key: "handleRegister",
        value: function handleRegister(e) {
            e.preventDefault();

            var obj = {
                Email: this.refs.emailField.value,
                UserName: this.refs.userNameField.value,
                Password: this.refs.passwordField.value
            };
            this.props.onRegister(obj);
        }
    }, {
        key: "render",
        value: function render() {

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "button",
                    { className: "headerbtn", onClick: this.handleExpand },
                    "Register"
                ),
                this.state.expanded && React.createElement(
                    "form",
                    { className: "submitForm" },
                    React.createElement("input", { ref: "emailField", type: "text", placeholder: "Email" }),
                    React.createElement("input", { ref: "userNameField", type: "text", placeholder: "UserName" }),
                    React.createElement("input", { ref: "passwordField", type: "password", placeholder: "Password" }),
                    React.createElement(
                        "button",
                        { onClick: this.handleRegister },
                        "Submit"
                    )
                )
            );
        }
    }]);

    return Register;
}(React.Component);

var Login = function (_React$Component2) {
    _inherits(Login, _React$Component2);

    function Login(props) {
        _classCallCheck(this, Login);

        var _this2 = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this, props));

        _this2.handleLogin = _this2.handleLogin.bind(_this2);
        _this2.handleExpand = _this2.handleExpand.bind(_this2);
        _this2.state = {
            expanded: false
        };
        return _this2;
    }

    _createClass(Login, [{
        key: "handleExpand",
        value: function handleExpand() {
            this.setState(function (prevState) {
                return {
                    expanded: !prevState.expanded
                };
            });
        }
    }, {
        key: "handleLogin",
        value: function handleLogin(e) {
            e.preventDefault();

            var obj = {
                Email: this.refs.emailField.value,
                Password: this.refs.passwordField.value
            };
            this.props.onLogin(obj);
        }
    }, {
        key: "render",
        value: function render() {

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "button",
                    { className: "headerbtn", onClick: this.handleExpand },
                    "Login"
                ),
                this.state.expanded && React.createElement(
                    "form",
                    { className: "submitForm" },
                    React.createElement("input", { ref: "emailField", type: "text", placeholder: "Email" }),
                    React.createElement("input", { ref: "passwordField", type: "password", placeholder: "Password" }),
                    React.createElement(
                        "button",
                        { onClick: this.handleLogin },
                        "Submit"
                    )
                )
            );
        }
    }]);

    return Login;
}(React.Component);

var Logout = function (_React$Component3) {
    _inherits(Logout, _React$Component3);

    function Logout(props) {
        _classCallCheck(this, Logout);

        return _possibleConstructorReturn(this, (Logout.__proto__ || Object.getPrototypeOf(Logout)).call(this, props));
    }

    _createClass(Logout, [{
        key: "render",
        value: function render() {

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "button",
                    { className: "headerbtn", onClick: this.props.onLogout },
                    "Logout"
                )
            );
        }
    }]);

    return Logout;
}(React.Component);

var LoginPanel = function (_React$Component4) {
    _inherits(LoginPanel, _React$Component4);

    function LoginPanel() {
        _classCallCheck(this, LoginPanel);

        return _possibleConstructorReturn(this, (LoginPanel.__proto__ || Object.getPrototypeOf(LoginPanel)).apply(this, arguments));
    }

    _createClass(LoginPanel, [{
        key: "render",
        value: function render() {

            return React.createElement(
                "div",
                { className: "loginPanel" },
                React.createElement(Register, { onRegister: this.props.onRegister }),
                this.props.isLogged ? React.createElement(Logout, { onLogout: this.props.onLogout }) : React.createElement(Login, { onLogin: this.props.onLogin })
            );
        }
    }]);

    return LoginPanel;
}(React.Component);

var ToDoHeader = function (_React$Component5) {
    _inherits(ToDoHeader, _React$Component5);

    function ToDoHeader() {
        _classCallCheck(this, ToDoHeader);

        return _possibleConstructorReturn(this, (ToDoHeader.__proto__ || Object.getPrototypeOf(ToDoHeader)).apply(this, arguments));
    }

    _createClass(ToDoHeader, [{
        key: "render",
        value: function render() {

            return React.createElement(
                "header",
                { className: "mainHeader" },
                React.createElement(
                    "div",
                    { className: "content" },
                    this.props.isLogged ? React.createElement(
                        "h1",
                        null,
                        "ToDoReact, " + this.props.user.UserName
                    ) : React.createElement(
                        "h1",
                        null,
                        "ToDoReact"
                    ),
                    React.createElement(LoginPanel, { isLogged: this.props.isLogged, onLogin: this.props.onLogin, onLogout: this.props.onLogout, onRegister: this.props.onRegister })
                )
            );
        }
    }]);

    return ToDoHeader;
}(React.Component);

exports.default = ToDoHeader;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by Johnh on 2016-11-05.
 */
//TODO: Handle e.Status == false

var AddList = function (_React$Component) {
    _inherits(AddList, _React$Component);

    function AddList(props) {
        _classCallCheck(this, AddList);

        var _this2 = _possibleConstructorReturn(this, (AddList.__proto__ || Object.getPrototypeOf(AddList)).call(this, props));

        _this2.handleClick = _this2.handleClick.bind(_this2);
        return _this2;
    }

    _createClass(AddList, [{
        key: "handleClick",
        value: function handleClick(e) {
            e.preventDefault();
            this.props.onAddList(this.refs.listNameField.value);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "form",
                { className: "listAppForm" },
                React.createElement("input", { ref: "listNameField", type: "text", placeholder: "New list name" }),
                React.createElement(
                    "button",
                    { onClick: this.handleClick },
                    "Add"
                )
            );
        }
    }]);

    return AddList;
}(React.Component);

var List = function (_React$Component2) {
    _inherits(List, _React$Component2);

    function List(props) {
        _classCallCheck(this, List);

        var _this3 = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

        _this3.handleClick = _this3.handleClick.bind(_this3);
        return _this3;
    }

    _createClass(List, [{
        key: "handleClick",
        value: function handleClick() {
            this.props.onSelectList(this.props.list);
        }
    }, {
        key: "render",
        value: function render() {
            var selectedClass = this.props.isSelected ? "selected" : "";
            return React.createElement(
                "span",
                { className: "listName " + selectedClass, onClick: this.handleClick },
                this.props.list.Name
            );
        }
    }]);

    return List;
}(React.Component);

var ListsPanel = function (_React$Component3) {
    _inherits(ListsPanel, _React$Component3);

    function ListsPanel(props) {
        _classCallCheck(this, ListsPanel);

        return _possibleConstructorReturn(this, (ListsPanel.__proto__ || Object.getPrototypeOf(ListsPanel)).call(this, props));
    }

    _createClass(ListsPanel, [{
        key: "render",
        value: function render() {
            var rows = [];
            var _this = this;

            this.props.lists.forEach(function (list) {
                var selected = _this.props.selectedList !== null && list.ID === _this.props.selectedList.ID;
                rows.push(React.createElement(List, { key: list.ID, list: list, isSelected: selected, onSelectList: _this.props.onSelectList }));
            });

            return React.createElement(
                "aside",
                { className: "listsPanel" },
                React.createElement(
                    "section",
                    null,
                    rows,
                    React.createElement(AddList, { onAddList: this.props.onAddList })
                )
            );
        }
    }]);

    return ListsPanel;
}(React.Component);

var Item = function (_React$Component4) {
    _inherits(Item, _React$Component4);

    function Item(props) {
        _classCallCheck(this, Item);

        var _this5 = _possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).call(this, props));

        _this5.handleClick = _this5.handleClick.bind(_this5);
        return _this5;
    }

    _createClass(Item, [{
        key: "handleClick",
        value: function handleClick() {
            this.props.item.Done = !this.props.item.Done;
            this.props.onUpdateItem(this.props.item);
        }
    }, {
        key: "render",
        value: function render() {
            var className = this.props.item.Done ? "item done" : "item not-done";
            var icon = this.props.item.Done ? "fa fa-check-square" : "fa fa-square";
            return React.createElement(
                "li",
                { onClick: this.handleClick, className: className },
                React.createElement(
                    "span",
                    { className: "name" },
                    this.props.item.Name
                ),
                React.createElement(
                    "span",
                    { className: "checkbox" },
                    React.createElement("i", { className: icon })
                )
            );
        }
    }]);

    return Item;
}(React.Component);

var AddItem = function (_React$Component5) {
    _inherits(AddItem, _React$Component5);

    function AddItem(props) {
        _classCallCheck(this, AddItem);

        var _this6 = _possibleConstructorReturn(this, (AddItem.__proto__ || Object.getPrototypeOf(AddItem)).call(this, props));

        _this6.handleClick = _this6.handleClick.bind(_this6);
        return _this6;
    }

    _createClass(AddItem, [{
        key: "handleClick",
        value: function handleClick(e) {
            e.preventDefault();
            this.props.onAddItem(this.refs.itemNameField.value);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "form",
                { className: "listAppForm" },
                React.createElement("input", { ref: "itemNameField", type: "text", placeholder: "New item..." }),
                React.createElement(
                    "button",
                    { onClick: this.handleClick },
                    "Add"
                )
            );
        }
    }]);

    return AddItem;
}(React.Component);

var ListPanel = function (_React$Component6) {
    _inherits(ListPanel, _React$Component6);

    function ListPanel(props) {
        _classCallCheck(this, ListPanel);

        var _this7 = _possibleConstructorReturn(this, (ListPanel.__proto__ || Object.getPrototypeOf(ListPanel)).call(this, props));

        _this7.state = {
            showDone: false
        };
        _this7.handleToggleDone = _this7.handleToggleDone.bind(_this7);
        return _this7;
    }

    _createClass(ListPanel, [{
        key: "handleToggleDone",
        value: function handleToggleDone() {
            this.setState(function (prevState) {
                return {
                    showDone: !prevState.showDone
                };
            });
        }
    }, {
        key: "render",
        value: function render() {
            var rows = [];
            var _this = this;
            this.props.list.Items.forEach(function (item) {
                if (_this.state.showDone || !item.Done) {
                    rows.push(React.createElement(Item, { key: item.ID, item: item, onUpdateItem: _this.props.onUpdateItem }));
                }
            });
            var classname = this.state.showDone ? "show active" : "show";
            return React.createElement(
                "section",
                { className: "listPanel" },
                React.createElement(
                    "h1",
                    null,
                    this.props.list.Name
                ),
                React.createElement(
                    "button",
                    { onClick: this.handleToggleDone, className: classname },
                    this.state.showDone ? "Hide completed" : "Show completed"
                ),
                React.createElement(
                    "ul",
                    null,
                    rows
                ),
                React.createElement(AddItem, { onAddItem: this.props.onAddItem })
            );
        }
    }]);

    return ListPanel;
}(React.Component);

var ToDoList = function (_React$Component7) {
    _inherits(ToDoList, _React$Component7);

    function ToDoList(props) {
        _classCallCheck(this, ToDoList);

        var _this8 = _possibleConstructorReturn(this, (ToDoList.__proto__ || Object.getPrototypeOf(ToDoList)).call(this, props));

        _this8.state = {
            selectedList: null,
            lists: []
        };

        _this8.handleSelectList = _this8.handleSelectList.bind(_this8);
        _this8.handleAddList = _this8.handleAddList.bind(_this8);

        _this8.handleAddItem = _this8.handleAddItem.bind(_this8);
        _this8.handleUpdateItem = _this8.handleUpdateItem.bind(_this8);

        _this8.refreshLists = _this8.refreshLists.bind(_this8);

        if (props.isLogged) {
            _this8.refreshLists();
        }
        return _this8;
    }

    _createClass(ToDoList, [{
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(newProps) {
            if (newProps.isLogged) {
                this.refreshLists();
            }
        }
    }, {
        key: "refreshLists",
        value: function refreshLists() {
            var _this = this;
            this.post('/api/GetLists', null, function (e) {
                if (e.Status) {
                    _this.setState({
                        selectedList: null,
                        lists: e.Object
                    });
                }
            });
        }
    }, {
        key: "handleAddItem",
        value: function handleAddItem(name) {
            var data = {
                ListID: this.state.selectedList.ID,
                Name: name
            };
            var _this = this;
            this.post('/api/AddItem', JSON.stringify(data), function (e) {
                if (e.Status) {
                    _this.setState({
                        selectedList: e.Object
                    });
                }
            });
        }
    }, {
        key: "handleUpdateItem",
        value: function handleUpdateItem(item) {
            var _this = this;
            this.post('/api/UpdateItem', JSON.stringify(item), function (e) {
                if (e.Status) {
                    _this.forceUpdate();
                }
            });
        }
    }, {
        key: "handleAddList",
        value: function handleAddList(name) {
            var data = {
                Name: name
            };
            var _this = this;
            this.post('/api/AddList', JSON.stringify(data), function (e) {
                if (e.Status) {
                    _this.state.lists.push(e.Object);
                    _this.setState({
                        selectedList: e.Object
                    });
                } else {
                    document.getElementById('response').innerHTML = "Error: " + e.Object;
                }
            });
        }
    }, {
        key: "handleSelectList",
        value: function handleSelectList(list) {
            var data = {
                ID: list.ID
            };
            var _this = this;
            this.post('/api/GetList', JSON.stringify(data), function (e) {
                if (e.Status) {
                    _this.setState({
                        selectedList: e.Object
                    });
                }
            });
        }
    }, {
        key: "post",
        value: function post(url, data, callback) {
            $.post(url, data, callback, 'json');
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "main",
                { className: "ToDoList content" },
                this.props.isLogged && React.createElement(ListsPanel, { onSelectList: this.handleSelectList, onAddList: this.handleAddList, selectedList: this.state.selectedList, lists: this.state.lists }),
                this.state.selectedList !== null && this.props.isLogged && React.createElement(ListPanel, { onAddItem: this.handleAddItem, onUpdateItem: this.handleUpdateItem, list: this.state.selectedList })
            );
        }
    }]);

    return ToDoList;
}(React.Component);

exports.default = ToDoList;

},{}]},{},[1]);
