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
var master = 'John'
class ToDoOwnerRow extends React.Component{
    render(){
        return (
            <tr>
                <th colSpan="2">{this.props.owner}</th>
            </tr>
        );
    }
}

class ToDoItemRow extends React.Component{
    constructor(props){
        super(props);

        this.handleUserChange = this.handleUserChange.bind(this);
    }
    handleUserChange(){
        this.props.onUserChange(this.props.item.id, !this.props.item.done);
    }

    render() {
        var className = this.props.item.done ? "item done" : "item not-done";
        var icon = this.props.item.done ? "fa fa-check-square" : "fa fa-square";
        return (
            <tr className={className}>
                <td className="name">{this.props.item.name}</td>
                <td className="checkbox" onClick={this.handleUserChange}><i className={icon}></i></td>
            </tr>
        );
    }
}

class ToDoTable extends React.Component{
    constructor(props){
        super(props);

        this.handleUserChange = this.handleUserChange.bind(this);
    }
    handleUserChange(id, done){
        this.props.onUserChange(id, done);
    }
    render() {
        var rows = [];
        var lastOwner = null;
        var _this = this;
        this.props.items.forEach(function(item){
            /*if(item.owner !== lastOwner && ((_this.props.onlyMe && item.owner === master) || !_this.props.onlyMe)){
                rows.push(
                    <ToDoOwnerRow owner={item.owner} key={item.owner}/>
                );
            }*/
            if(item.name.toUpperCase().indexOf(_this.props.filterText.toUpperCase()) !== -1 &&
                ((_this.props.onlyMe && item.owner === master) || !_this.props.onlyMe) &&
                (!(item.done && _this.props.onlyNotDone))) {
                    rows.push(
                        <ToDoItemRow onUserChange={_this.handleUserChange} item={item} key={item.id + item.owner + item.name}/>
                );
            }
            lastOwner = item.owner;
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
            this.refs.onlyMe.checked,
            this.refs.onlyNotDone.checked
        );
    }
    render(){
        return (
            <form>
                <input onChange={this.handleChange} ref="filterTextInput" type="text" placeholder="Search..." value={this.props.filterText} />
                <p>
                    <input onChange={this.handleChange} ref="onlyMe" type="checkbox" checked={this.props.onlyMe}/>
                    {' '}
                    Only show my stuff
                </p>
                <p>
                    <input onChange={this.handleChange} ref="onlyNotDone" type="checkbox" checked={this.props.onlyNotDone}/>
                    {' '}
                    Only show not done
                </p>
        </form>
    )
    }
}

class AddBar extends React.Component {
    constructor(props){
        super(props);
        this.handleUserClick = this.handleUserClick.bind(this);
    }
    handleUserClick(e){
        e.preventDefault();
        this.props.onHandleUserClick(
            this.refs.ownerInput.value,
            this.refs.itemInput.value
        );
    }
    render(){
        return (
            <form>
                <input ref="ownerInput" type="text" placeholder="owner.."/>
                <input ref="itemInput" type="text" placeholder="item.." />
                <button onClick={this.handleUserClick}>Submit</button>
            </form>
        );
    }
}

class ToDoListTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            filterText: '',
            onlyMe: false,
            onlyNotDone : false,
            items : props.items
        };
        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleUserItemsAdd = this.handleUserItemsAdd.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
    }
    handleUserInput(filterText, onlyMe, onlyNotDone){
        this.setState({
            filterText:filterText,
            onlyMe:onlyMe,
            onlyNotDone: onlyNotDone
        });
    }
    handleUserChange(id, done){
        this.state.items[id].done = done;
        this.setState({
            items:this.state.items
        });
    }
    handleUserItemsAdd(owner, item){
        var id = this.state.items[this.state.items.length - 1].id + 1;
        this.state.items.push({id: id, owner: owner, name: item, done: false});
        this.setState({
            items: this.state.items
        });
    }
    render(){
        return (
            <div>
                <SearchBar onUserInput={this.handleUserInput} filterText={this.state.filterText} onlyMe={this.state.onlyMe} />
                <ToDoTable onUserChange={this.handleUserChange} items={this.state.items} filterText={this.state.filterText} onlyMe={this.state.onlyMe} onlyNotDone={this.state.onlyNotDone}/>
                <AddBar onHandleUserClick={this.handleUserItemsAdd}/>
            </div>
        );
    }
}

var ITEMS = [
    {id: 0, owner: 'John', name:'Ost', done: false},
    {id: 1, owner: 'John', name:'Banan', done: false},
    {id: 2, owner: 'John', name:'Päron', done: false},
    {id: 3, owner: 'Özgün', name:'Potatis', done: true},
    {id: 4, owner: 'Özgün', name:'Kött', done: false},
    {id: 5, owner: 'Özgün', name:'En massa kött', done: true},
    {id: 6, owner: 'Özgün', name:'En massa Ost', done: true},

];

ReactDOM.render(
<ToDoListTable items={ITEMS}/>,
    document.getElementById('list')
);