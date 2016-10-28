class ToDoOwnerRow extends  React.Component{
    render(){
        return (
            <tr>
                <th colSpan="2">{this.props.owner.Name}</th>
            </tr>
        );
    }
}

class ToDoItemRow extends React.Component{
    constructor(props){
        super(props);
        this.handleUserInput = this.handleUserInput.bind(this);
    }
    handleUserInput(){
        //Insert ajax to change current item state. Call render on table.
        this.props.item.Done = !this.props.item.Done;
        this.props.onItemUpdate(this.props.item);
    }
    render(){
        var className = this.props.item.Done ? "item done" : "item not-done";
        var icon = this.props.item.Done ? "fa fa-check-square" : "fa fa-square";
        return (
            <tr className={className}>
                <td className="name">{this.props.item.Name}</td>
                <td className="checkbox" onClick={this.handleUserInput}><i className={icon}></i></td>
            </tr>
        );
    }
}

class ToDoTable extends React.Component{
    render(){
        var rows = [];
        var _this = this;
        this.props.owners.forEach(function(owner){
            rows.push(<ToDoOwnerRow owner={owner} key={owner.Id}/>);
            owner.Items.forEach(function(item){
                if((item.Name.toUpperCase().indexOf(_this.props.filterText.toUpperCase()) !== -1) &&
                    !(item.Done && _this.props.onlyNotDone)) {
                    rows.push(<ToDoItemRow item={item} onItemUpdate={_this.props.onItemUpdate} key={item.OwnerId +  "_" + item.Id}/>);
                }
            });
        });
        return (
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

class SearchBar extends React.Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(){
        this.props.onUserInput(
            this.refs.filterTextInput.value,
            this.refs.onlyNotDone.checked
        );
    }
    render(){
        return (
            <form>
                <input onChange={this.handleChange} ref="filterTextInput" type="text" placeholder="Search..." value={this.props.filterText} />
                <p>
                    <input onChange={this.handleChange} ref="onlyNotDone" type="checkbox" checked={this.props.onlyNotDone}/>
                    {' '}
                    Only show not done
                </p>
            </form>
        )
    }
}

class OwnerSelect extends React.Component{
    constructor(props){
        super(props);
        this.handleUserChange = this.handleUserChange.bind(this);
    }
    handleUserChange(){
        this.props.onUserSelect(
            this.refs.ownerSelect.value
        );
    }
    render(){
        var rows = [];
        this.props.owners.forEach(function(owner){
           rows.push(
             <option value={owner.Id}>{owner.Name}</option>
           );
        });
        return (
            <select ref="ownerSelect" onChange={this.handleUserChange}>
                {rows}
            </select>
        );
    }
}
class AddItemBar extends React.Component{
    constructor(props){
        super(props);

        this.handleAdd = this.handleAdd.bind(this);
    }
    handleAdd(e){
        e.preventDefault();
        this.props.onAddItem(
            this.refs.ownerSelect.value,
            this.refs.itemName.value
        );
    }
    render(){
        var rows = [];
        this.props.owners.forEach(function(owner){
            rows.push(
                <option value={owner.Id}>{owner.Name}</option>
            );
        });

        return(
            <form>
                <select ref="ownerSelect">
                    {rows}
                </select>
                <input ref="itemName" type = "text" placeholder="item..." />
                <button onClick={this.handleAdd}>Add</button>
            </form>
        )
    }
}

class ToDoListTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            filterText: '',
            onlyNotDone: false,
            owners: props.owners
        };
        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleItemUpdate = this.handleItemUpdate.bind(this);
        this.handleItemAdd = this.handleItemAdd.bind(this);
    }
    handleUserInput(filterText, onlyNotDone){
        this.setState({
            filterText:filterText,
            onlyNotDone:onlyNotDone
        });
    }
    handleItemUpdate(item){
        var _this = this;
        this.post('api/UpdateItem', JSON.stringify(item), function (data) {
            _this.setState({
                owners: data.Owners
            });
        });
    }
    handleItemAdd(ownerId, itemName){
        var _this = this;
        var item = {
            OwnerId:parseInt(ownerId),
            Id:0,
            Name:itemName,
            Done:false,
        };
        this.post('api/AddItem', JSON.stringify(item), function (data) {
            _this.setState({
                owners: data.Owners
            });
        });
    }
    post(url, data, callback){
        $.post(url, data, callback, 'json');
    }
    render(){
        return (
            <div>
                <SearchBar onUserInput={this.handleUserInput} filterText={this.state.filterText} onlyNotDone={this.state.onlyNotDone}/>
                <ToDoTable onItemUpdate={this.handleItemUpdate} owners={this.state.owners} onlyNotDone={this.state.onlyNotDone} filterText={this.state.filterText}/>
                <AddItemBar onAddItem={this.handleItemAdd} owners={this.state.owners}/>
            </div>
        );
    }
}

$.getJSON(
    '/api/GetAllItems',
    function(data){
        ReactDOM.render(
            <ToDoListTable owners={data.Owners}/>,
            document.getElementById('list')
        );
    }
);