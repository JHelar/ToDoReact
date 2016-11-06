(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
            console.log("Render in Register");
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
            console.log("Render in Login");
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

    function Logout() {
        _classCallCheck(this, Logout);

        return _possibleConstructorReturn(this, (Logout.__proto__ || Object.getPrototypeOf(Logout)).apply(this, arguments));
    }

    _createClass(Logout, [{
        key: "render",
        value: function render() {
            console.log("Render in Logout");
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "button",
                    { ClassName: "headerbtn", onClick: this.props.onLogout },
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
            console.log("Render in LoginPanel");
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
            console.log("Render in ToDoHeader");
            return React.createElement(
                "header",
                null,
                React.createElement(LoginPanel, { isLogged: this.props.isLogged, onLogin: this.props.onLogin, onLogout: this.props.onLogout, onRegister: this.props.onRegister })
            );
        }
    }]);

    return ToDoHeader;
}(React.Component);

exports.default = ToDoHeader;

},{}]},{},[1]);
