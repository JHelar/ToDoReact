/**
 * Created by Johnh on 2016-11-05.
 */
//TODO: Handle e.Status == false

class AddList extends React.Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e){
        e.preventDefault();
        this.props.onAddList(this.refs.listNameField.value);
    }
    render(){
        return(
            <form className="listAppForm">
                <input ref="listNameField" type="text" placeholder="New list name"/>
                <button onClick={this.handleClick}>Add</button>
            </form>
        );
    }
}

class List extends React.Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(){
        this.props.onSelectList(this.props.list);
    }
    render(){
        var selectedClass = this.props.isSelected ? "selected" : "";
        return (
            <span className={"listName " + selectedClass} onClick={this.handleClick}>{this.props.list.Name}</span>
        );
    }
}

class ListsPanel extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        var rows = [];
        var _this = this;

        this.props.lists.forEach(function(list){
            var selected = _this.props.selectedList !== null && list.ID === _this.props.selectedList.ID;
            rows.push(<List key={list.ID} list={list} isSelected={selected} onSelectList={_this.props.onSelectList}/>)
        });

        return (
            <aside className="listsPanel">
                <section>
                    {rows}
                    <AddList onAddList={this.props.onAddList}/>
                </section>
            </aside>
        );
    }
}

class Item extends React.Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }
    handleUpdate(e){
        e.preventDefault();
        this.props.item.Name = this.refs.nameField.value;
        this.props.onUpdate(this.props.item);
    }
    handleDelete(){
        this.props.onDelete(this.props.item);
    }
    handleClick(){
        this.props.item.Done = !this.props.item.Done;
        this.props.onUpdate(this.props.item);
    }
    render(){
        var className = this.props.item.Done ? "item done" : "item not-done";
        var icon = this.props.item.Done ? "fa fa-check-square" : "fa fa-square";
        if(this.props.isEdit){
            return(
                <li className={"editing " + className}>
                    <button onClick={this.handleDelete} className="delete">Delete</button>
                    <form>
                        <input type="text" ref="nameField" defaultValue={this.props.item.Name}/>
                        <button onClick={this.handleUpdate}>Update</button>
                    </form>
                    <span className="checkbox"><i className={icon}></i></span>
                </li>
            );
        }else{
            return (
                <li onClick={this.handleClick} className={className}>
                    <span className="name">{this.props.item.Name}</span>
                    <span className="checkbox"><i className={icon}></i></span>
                </li>
            );
        }
    }
}

class AddItem extends React.Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e){
        e.preventDefault();
        this.props.onAddItem(this.refs.itemNameField.value);
    }
    render(){
        return (
            <form className="listAppForm">
                <input ref="itemNameField" type="text" placeholder="New item..."/>
                <button onClick={this.handleClick}>Add</button>
            </form>
        );
    }
}

class ListPanel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showDone:false,
            showEdit:false
        };
        this.handleToggleDone = this.handleToggleDone.bind(this);
        this.handleToggleEdit = this.handleToggleEdit.bind(this);
    }
    handleToggleDone(){
        this.setState((prevState) => ({
           showDone:!prevState.showDone
        }));
    }
    handleToggleEdit(){
        this.setState((prevState) => ({
            showEdit:!prevState.showEdit
        }));
    }
    render(){
        var rows = [];
        var _this = this;
        this.props.list.Items.forEach(function (item) {
            if(_this.state.showDone || !item.Done) {
                rows.push(<Item key={item.ID} isEdit={_this.state.showEdit} item={item} onUpdate={_this.props.onUpdateItem} onDelete={_this.props.onDeleteItem}/>)
            }
        });
        var classname = this.state.showDone ? "active" : "";
        return (
            <section className="listPanel">
                <h1>{this.props.list.Name}</h1>
                <button onClick={this.handleToggleEdit} className={"edit " + classname}>{this.state.showEdit ? "Stop edit" : "Edit"}</button>
                <button onClick={this.handleToggleDone} className={"show " + classname}>{this.state.showDone ? "Hide completed" : "Show completed"}</button>
                <ul>
                    {rows}
                </ul>
                <AddItem onAddItem={this.props.onAddItem}/>
            </section>
        );
    }
}

class ToDoList extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            selectedList: null,
            lists:[]
        };

        this.handleSelectList = this.handleSelectList.bind(this);
        this.handleAddList = this.handleAddList.bind(this);

        this.handleAddItem = this.handleAddItem.bind(this);
        this.handleUpdateItem = this.handleUpdateItem.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);

        this.refreshLists = this.refreshLists.bind(this);
        this.refreshList = this.refreshList.bind(this);

        if(props.isLogged){
            this.refreshLists();
        }
    }
    componentWillReceiveProps(newProps){
        if(newProps.isLogged){
            console.log("New props");
            this.state.selectedList = null;
            this.refreshLists();
        }
    }
    refreshLists(){
        var _this = this;
        this.post('/api/GetLists',null, function (e) {
            if(e.Status){
                _this.setState({
                    lists:e.Object
                });
            }
        });
    }
    refreshList(id){
        var data = {
            ID: id
        };
        var _this = this;
        this.post('/api/GetList', JSON.stringify(data), function (e) {
            if(e.Status){
                _this.setState({
                    selectedList:e.Object
                });
            }
        });
    }
    handleAddItem(name){
        var data = {
            ListID: this.state.selectedList.ID,
            Name: name
        };
        var _this = this;
        this.post('/api/AddItem', JSON.stringify(data), function(e){
            if(e.Status){
                _this.setState({
                    selectedList:e.Object
                });
            }
        });
    }
    handleUpdateItem(item){
        var _this = this;
        this.post('/api/UpdateItem', JSON.stringify(item), function (e) {
           if(e.Status){
               _this.refreshList(_this.state.selectedList.ID);
           }
        });
    }
    handleDeleteItem(item){
        var _this = this;
        this.post('/api/DeleteItem', JSON.stringify(item), function(e){
            if(e.Status){
                _this.refreshList(_this.state.selectedList.ID);
            }
        })
    }
    handleAddList(name){
        var data = {
            Name: name
        };
        var _this = this;
        this.post('/api/AddList', JSON.stringify(data), function (e) {
            if(e.Status){
                _this.state.lists.push(e.Object);
                _this.setState({
                    selectedList:e.Object
                });
            }else{
                document.getElementById('response').innerHTML = "Error: " + e.Object;
            }
        });
    }
    handleSelectList(list){
        this.refreshList(list.ID)
    }
    post(url, data, callback){
        $.post(url, data, callback, 'json');
    }
    render(){
        return(
            <main className="ToDoList content">
                {this.props.isLogged && <ListsPanel onSelectList={this.handleSelectList} onAddList={this.handleAddList} selectedList={this.state.selectedList} lists={this.state.lists} />}
                {(this.state.selectedList !== null && this.props.isLogged) && <ListPanel onAddItem={this.handleAddItem} onUpdateItem={this.handleUpdateItem} onDeleteItem={this.handleDeleteItem} list={this.state.selectedList}/>}
            </main>
        );
    }
}
export default ToDoList;
