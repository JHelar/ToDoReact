(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by johnla on 2016-10-26.
 */
/**
 * Created by johnla on 2016-10-26.
 */
/**
 * Created by johnla on 2016-10-26.
 */
/**
 * ToDoListTable
 *      SearchBar
 *      ToDoTable
 *          ToDoOwnerRow
 *          ToDoItemRow
 *              ToDoRemove
 *      AddBar
 *
 * */
var master = 'John';
class ToDoOwnerRow extends React.Component {
    render() {
        return React.createElement(
            "tr",
            null,
            React.createElement(
                "th",
                { colSpan: "2" },
                this.props.owner
            )
        );
    }
}

class ToDoItemRow extends React.Component {
    constructor(props) {
        super(props);

        this.handleUserChange = this.handleUserChange.bind(this);
    }
    handleUserChange() {
        this.props.onUserChange(this.props.item.id, !this.props.item.done);
    }

    render() {
        var className = this.props.item.done ? "item done" : "item not-done";
        var icon = this.props.item.done ? "fa fa-check-square" : "fa fa-square";
        return React.createElement(
            "tr",
            { className: className },
            React.createElement(
                "td",
                { className: "name" },
                this.props.item.name
            ),
            React.createElement(
                "td",
                { className: "checkbox", onClick: this.handleUserChange },
                React.createElement("i", { className: icon })
            )
        );
    }
}

class ToDoTable extends React.Component {
    constructor(props) {
        super(props);

        this.handleUserChange = this.handleUserChange.bind(this);
    }
    handleUserChange(id, done) {
        this.props.onUserChange(id, done);
    }
    render() {
        var rows = [];
        var lastOwner = null;
        var _this = this;
        this.props.items.forEach(function (item) {
            /*if(item.owner !== lastOwner && ((_this.props.onlyMe && item.owner === master) || !_this.props.onlyMe)){
                rows.push(
                    <ToDoOwnerRow owner={item.owner} key={item.owner}/>
                );
            }*/
            if (item.name.toUpperCase().indexOf(_this.props.filterText.toUpperCase()) !== -1 && (_this.props.onlyMe && item.owner === master || !_this.props.onlyMe) && !(item.done && _this.props.onlyNotDone)) {
                rows.push(React.createElement(ToDoItemRow, { onUserChange: _this.handleUserChange, item: item, key: item.id + item.owner + item.name }));
            }
            lastOwner = item.owner;
        });
        return React.createElement(
            "table",
            null,
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "th",
                        null,
                        "Item"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Remove"
                    )
                )
            ),
            React.createElement(
                "tbody",
                null,
                rows
            )
        );
    }
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange() {
        this.props.onUserInput(this.refs.filterTextInput.value, this.refs.onlyMe.checked, this.refs.onlyNotDone.checked);
    }
    render() {
        return React.createElement(
            "form",
            null,
            React.createElement("input", { onChange: this.handleChange, ref: "filterTextInput", type: "text", placeholder: "Search...", value: this.props.filterText }),
            React.createElement(
                "p",
                null,
                React.createElement("input", { onChange: this.handleChange, ref: "onlyMe", type: "checkbox", checked: this.props.onlyMe }),
                ' ',
                "Only show my stuff"
            ),
            React.createElement(
                "p",
                null,
                React.createElement("input", { onChange: this.handleChange, ref: "onlyNotDone", type: "checkbox", checked: this.props.onlyNotDone }),
                ' ',
                "Only show not done"
            )
        );
    }
}

class AddBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleUserClick = this.handleUserClick.bind(this);
    }
    handleUserClick(e) {
        e.preventDefault();
        this.props.onHandleUserClick(this.refs.ownerInput.value, this.refs.itemInput.value);
    }
    render() {
        return React.createElement(
            "form",
            null,
            React.createElement("input", { ref: "ownerInput", type: "text", placeholder: "owner.." }),
            React.createElement("input", { ref: "itemInput", type: "text", placeholder: "item.." }),
            React.createElement(
                "button",
                { onClick: this.handleUserClick },
                "Submit"
            )
        );
    }
}

class ToDoListTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterText: '',
            onlyMe: false,
            onlyNotDone: false,
            items: props.items
        };
        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleUserItemsAdd = this.handleUserItemsAdd.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
    }
    handleUserInput(filterText, onlyMe, onlyNotDone) {
        this.setState({
            filterText: filterText,
            onlyMe: onlyMe,
            onlyNotDone: onlyNotDone
        });
    }
    handleUserChange(id, done) {
        this.state.items[id].done = done;
        this.setState({
            items: this.state.items
        });
    }
    handleUserItemsAdd(owner, item) {
        var id = this.state.items[this.state.items.length - 1].id + 1;
        this.state.items.push({ id: id, owner: owner, name: item, done: false });
        this.setState({
            items: this.state.items
        });
    }
    render() {
        return React.createElement(
            "div",
            null,
            React.createElement(SearchBar, { onUserInput: this.handleUserInput, filterText: this.state.filterText, onlyMe: this.state.onlyMe }),
            React.createElement(ToDoTable, { onUserChange: this.handleUserChange, items: this.state.items, filterText: this.state.filterText, onlyMe: this.state.onlyMe, onlyNotDone: this.state.onlyNotDone }),
            React.createElement(AddBar, { onHandleUserClick: this.handleUserItemsAdd })
        );
    }
}

var ITEMS = [{ id: 0, owner: 'John', name: 'Ost', done: false }, { id: 1, owner: 'John', name: 'Banan', done: false }, { id: 2, owner: 'John', name: 'Päron', done: false }, { id: 3, owner: 'Özgün', name: 'Potatis', done: true }, { id: 4, owner: 'Özgün', name: 'Kött', done: false }, { id: 5, owner: 'Özgün', name: 'En massa kött', done: true }, { id: 6, owner: 'Özgün', name: 'En massa Ost', done: true }];

ReactDOM.render(React.createElement(ToDoListTable, { items: ITEMS }), document.getElementById('list'));

},{}]},{},[1]);
