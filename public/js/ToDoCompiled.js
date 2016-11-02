(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class ToDoOwnerRow extends React.Component {
    render() {
        return React.createElement(
            "tr",
            null,
            React.createElement(
                "th",
                { colSpan: "2" },
                this.props.owner.FirstName
            )
        );
    }
}

class ToDoItemRow extends React.Component {
    constructor(props) {
        super(props);
        this.handleUserInput = this.handleUserInput.bind(this);
    }
    handleUserInput() {
        //Insert ajax to change current item state. Call render on table.
        this.props.item.Done = !this.props.item.Done;
        this.props.onItemUpdate(this.props.item);
    }
    render() {
        var className = this.props.item.Done ? "item done" : "item not-done";
        var icon = this.props.item.Done ? "fa fa-check-square" : "fa fa-square";
        return React.createElement(
            "tr",
            { className: className },
            React.createElement(
                "td",
                { className: "name" },
                this.props.item.Name
            ),
            React.createElement(
                "td",
                { className: "checkbox", onClick: this.handleUserInput },
                React.createElement("i", { className: icon })
            )
        );
    }
}

class ToDoTable extends React.Component {
    render() {
        var rows = [];
        var _this = this;
        this.props.owners.forEach(function (owner) {
            rows.push(React.createElement(ToDoOwnerRow, { owner: owner, key: owner.ItemID }));
            owner.Items.forEach(function (item) {
                if (item.Name.toUpperCase().indexOf(_this.props.filterText.toUpperCase()) !== -1 && !(item.Done && !_this.props.onlyNotDone)) {
                    rows.push(React.createElement(ToDoItemRow, { item: item, onItemUpdate: _this.props.onItemUpdate, key: item.OwnerID + "_" + item.ItemID }));
                }
            });
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
        this.props.onUserInput(this.refs.filterTextInput.value, this.refs.onlyNotDone.checked);
    }
    render() {
        return React.createElement(
            "form",
            null,
            React.createElement("input", { onChange: this.handleChange, ref: "filterTextInput", type: "text", placeholder: "Search...", value: this.props.filterText }),
            React.createElement(
                "p",
                null,
                React.createElement("input", { onChange: this.handleChange, ref: "onlyNotDone", type: "checkbox", checked: this.props.onlyNotDone }),
                ' ',
                "Show done"
            )
        );
    }
}

class OwnerSelect extends React.Component {
    constructor(props) {
        super(props);
        this.handleUserChange = this.handleUserChange.bind(this);
    }
    handleUserChange() {
        this.props.onUserSelect(this.refs.ownerSelect.value);
    }
    render() {
        var rows = [];
        this.props.owners.forEach(function (owner) {
            rows.push(React.createElement(
                "option",
                { value: owner.OwnerID },
                owner.FirstName
            ));
        });
        return React.createElement(
            "select",
            { ref: "ownerSelect", onChange: this.handleUserChange },
            rows
        );
    }
}
class AddItemBar extends React.Component {
    constructor(props) {
        super(props);

        this.handleAdd = this.handleAdd.bind(this);
    }
    handleAdd(e) {
        e.preventDefault();
        this.props.onAddItem(this.refs.ownerSelect.value, this.refs.itemName.value);
    }
    render() {
        var rows = [];
        this.props.owners.forEach(function (owner) {
            rows.push(React.createElement(
                "option",
                { value: owner.OwnerID },
                owner.FirstName
            ));
        });

        return React.createElement(
            "form",
            null,
            React.createElement(
                "select",
                { ref: "ownerSelect" },
                rows
            ),
            React.createElement("input", { ref: "itemName", type: "text", placeholder: "item..." }),
            React.createElement(
                "button",
                { onClick: this.handleAdd },
                "Add"
            )
        );
    }
}

class ToDoListTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterText: '',
            onlyNotDone: false,
            owners: props.owners
        };
        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleItemUpdate = this.handleItemUpdate.bind(this);
        this.handleItemAdd = this.handleItemAdd.bind(this);

        //Register eventlistner
        this.handleUpdateStream = this.handleUpdateStream.bind(this);
        this.updateStream = new EventSource("/event/UpdateStream");
        this.updateStream.onmessage = this.handleUpdateStream;
    }
    handleUpdateStream(e) {
        var data = JSON.parse(e.data);
        this.setState({
            owners: data.Owners
        });
    }
    handleUserInput(filterText, onlyNotDone) {
        this.setState({
            filterText: filterText,
            onlyNotDone: onlyNotDone
        });
    }
    handleItemUpdate(item) {
        var _this = this;
        this.post('api/UpdateItem', JSON.stringify(item), function (data) {
            _this.setState({
                owners: data.Owners
            });
        });
    }
    handleItemAdd(ownerId, itemName) {
        var _this = this;
        var item = {
            OwnerID: parseInt(ownerId),
            ItemID: 0,
            Name: itemName,
            Done: false
        };
        this.post('api/AddItem', JSON.stringify(item), function (data) {
            _this.setState({
                owners: data.Owners
            });
        });
    }
    post(url, data, callback) {
        $.post(url, data, callback, 'json');
    }
    render() {
        return React.createElement(
            "div",
            null,
            React.createElement(SearchBar, { onUserInput: this.handleUserInput, filterText: this.state.filterText, onlyNotDone: this.state.onlyNotDone }),
            React.createElement(ToDoTable, { onItemUpdate: this.handleItemUpdate, owners: this.state.owners, onlyNotDone: this.state.onlyNotDone, filterText: this.state.filterText }),
            React.createElement(AddItemBar, { onAddItem: this.handleItemAdd, owners: this.state.owners })
        );
    }
}

$.getJSON('/api/GetAllItems', function (data) {
    ReactDOM.render(React.createElement(ToDoListTable, { owners: data.Owners }), document.getElementById('list'));
});

//Setup the event stream.

},{}]},{},[1]);
