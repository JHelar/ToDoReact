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
    }
    handleClick(){
        this.props.item.Done = !this.props.item.Done;
        this.props.onUpdateItem(this.props.item);
    }
    render(){
        var className = this.props.item.Done ? "item done" : "item not-done";
        var icon = this.props.item.Done ? "fa fa-check-square" : "fa fa-square";
        return (
            <li onClick={this.handleClick} className={className}>
                <span className="name">{this.props.item.Name}</span>
                <span className="checkbox"><i className={icon}></i></span>
            </li>
        );
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
            showDone:false
        }
        this.handleToggleDone = this.handleToggleDone.bind(this);
    }
    handleToggleDone(){
        this.setState((prevState) => ({
           showDone:!prevState.showDone
        }));
    }
    render(){
        var rows = [];
        var _this = this;
        this.props.list.Items.forEach(function (item) {
            if(_this.state.showDone || !item.Done) {
                rows.push(<Item key={item.ID} item={item} onUpdateItem={_this.props.onUpdateItem}/>)
            }
        });
        var classname = this.state.showDone ? "show active" : "show";
        return (
            <section className="listPanel">
                <h1>{this.props.list.Name}</h1>
                <button onClick={this.handleToggleDone} className={classname}>{this.state.showDone ? "Hide completed" : "Show completed"}</button>
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

        this.refreshLists = this.refreshLists.bind(this);

        if(props.isLogged){
            this.refreshLists();
        }
    }
    componentWillReceiveProps(newProps){
        if(newProps.isLogged){
            this.refreshLists();
        }
    }
    refreshLists(){
        var _this = this;
        this.post('/api/GetLists',null, function (e) {
            if(e.Status){
                _this.setState({
                    selectedList:null,
                    lists:e.Object
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
               _this.forceUpdate();
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
        var data = {
          ID:list.ID
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
    post(url, data, callback){
        $.post(url, data, callback, 'json');
    }
    render(){
        return(
            <main className="ToDoList content">
                {this.props.isLogged && <ListsPanel onSelectList={this.handleSelectList} onAddList={this.handleAddList} selectedList={this.state.selectedList} lists={this.state.lists} />}
                {(this.state.selectedList !== null && this.props.isLogged) && <ListPanel onAddItem={this.handleAddItem} onUpdateItem={this.handleUpdateItem} list={this.state.selectedList}/>}
            </main>
        );
    }
}
export default ToDoList;
