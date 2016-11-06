package main

import (
	"fmt"
	"html/template"
	"net/http"
	"log"
	"todoeventstream"
	"encoding/json"
	"tododatabase/todolist"
	"tododatabase/todojson"
	"tododatabase/todoitem"
	"todosecurity"
	"tododatabase"
	"tododatabase/todouser"
	"tododatabase/todousersession"
)

func authenticateRequest(r *http.Request, db *tododatabase.ToDoDb) (*todouser.User, bool){
	sessionKey := todosecurity.GetSessionKeyFromHeader(r)
	return todouser.GetUserBySessionKey(sessionKey, db)
}

func serveIndex(w http.ResponseWriter, r *http.Request)  {
	//Use tpl variable for template execution in production!
	//This is for test only
	index, err := template.ParseFiles("templates/index.gohtml")
	if err != nil {
		panic(err)
	}
	index.Execute(w, nil)
}

func addList(w http.ResponseWriter, r *http.Request)  {
	user, ok := authenticateRequest(r, tododb)
	if ok {
		decoder := json.NewDecoder(r.Body)

		var data struct{
			Name string
		}

		err := decoder.Decode(&data)
		if err != nil {
			log.Print(err)
			response,_ := getJsonResponse(false, "Something went wrong try again later.")
			fmt.Fprintf(w, string(response))
			return
		}

		ok = todolist.AddList(user.ID, data.Name, tododb)
		list := todolist.GetListByName(user.ID, data.Name, tododb)
		response,_ := getJsonResponse(true, todojson.ParseToDoList(list))
		fmt.Fprintf(w, string(response))
	}else{
		response,_ := getJsonResponse(false, "Need to relog!")
		fmt.Fprintf(w, string(response))
	}
}

func getList(w http.ResponseWriter, r *http.Request)  {
	user, ok := authenticateRequest(r, tododb)
	if ok {
		decoder := json.NewDecoder(r.Body)
		var data struct{
			ID int
		}
		err := decoder.Decode(&data)

		if err != nil {
			log.Print(err)
			response,_ := getJsonResponse(false, "Something went wrong try again later.")
			fmt.Fprintf(w, string(response))
			return
		}

		list := todolist.GetListById(user.ID, data.ID, tododb)
		response,_ := getJsonResponse(true, todojson.ParseToDoList(list))
		fmt.Fprintf(w, string(response))
	}else{
		response,_ := getJsonResponse(false, "Need to relog!")
		fmt.Fprintf(w, string(response))
	}
}

func getLists(w http.ResponseWriter, r *http.Request){
	user, ok := authenticateRequest(r, tododb)
	if ok {
		lists := todolist.GetListsByUserId(user.ID, tododb)

		response,_ := getJsonResponse(true, todojson.ParseToDoLists(lists))
		fmt.Fprintf(w, string(response))
	}else{
		response,_ := getJsonResponse(false, "Need to relog!")
		fmt.Fprintf(w, string(response))
	}

}

func addItem(w http.ResponseWriter, r *http.Request){
	user, ok := authenticateRequest(r, tododb)
	if ok {
		var data struct{
			ListID int
			Name string
		}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&data)
		if err != nil {
			log.Print(err)
			response,_ := getJsonResponse(false, "Something went wrong try again later.")
			fmt.Fprintf(w, string(response))
			return
		}
		added := todoitem.AddItem(data.ListID, data.Name, tododb)
		if added {
			list := todolist.GetListById(user.ID, data.ListID, tododb)
			response,_ := getJsonResponse(true, todojson.ParseToDoList(list))
			fmt.Fprintf(w, string(response))
		}
	}else{
		response,_ := getJsonResponse(false, "Need to relog!")
		fmt.Fprintf(w, string(response))
	}
}

func updateItem(w http.ResponseWriter, r *http.Request){
	_, ok := authenticateRequest(r, tododb)
	if ok {
		var item todojson.Item
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&item)
		if err != nil {
			log.Print(err)
			response,_ := getJsonResponse(false, "Something went wrong try again later.")
			fmt.Fprintf(w, string(response))
			return
		}
		//UserID = ?, Name = ?, Count = ?, Done = ? WHERE ID = ?
		ok := todoitem.UpdateItem(tododb, item.UserID, item.Name, item.Count, item.Done, item.ID)
		response,_ := getJsonResponse(ok, "UpdateItem")
		fmt.Fprintf(w, string(response))

	}else{
		response,_ := getJsonResponse(false, "Need to relog!")
		fmt.Fprintf(w, string(response))
	}
}

func register(w http.ResponseWriter, r *http.Request)  {
	decoder := json.NewDecoder(r.Body)

	var user struct{
		Email string
		UserName string
		Password string
	}

	err := decoder.Decode(&user)
	if err != nil {
		log.Print(err)
		response,_ := getJsonResponse(false, "Something went wrong try again later.")
		fmt.Fprintf(w, string(response))
		return
	}
	if success := todouser.AddUser(user.Email, user.UserName, user.Password, tododb); success {
		user, ok := todouser.GetUserByLogin(user.Email, user.Password, tododb)

		response,_ := getJsonResponse(ok, todojson.ParseToDoUser(user));
		fmt.Fprintf(w, string(response))
	}else {
		response,_ := getJsonResponse(false, "Mail is allready in use.")
		fmt.Fprintf(w, string(response))
	}
}

func tryLogin(w http.ResponseWriter, r *http.Request){
	user, ok := authenticateRequest(r, tododb)
	if ok {
		//Convert to json user!
		response,_ := getJsonResponse(true, todojson.ParseToDoUser(user))
		fmt.Fprintf(w, string(response))
	}else {
		response,_ := getJsonResponse(false, "ForceLogin!")
		fmt.Fprintf(w, string(response))
	}
}

func login(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	var login struct{
		Email string
		Password string
	}
	err := decoder.Decode(&login)
	if err != nil {
		log.Print(err)
		response,_ := getJsonResponse(false, "Something went wrong try again later.")
		fmt.Fprintf(w, string(response))
		return
	}
	//Do not return user object, convert to jsonUser!
	user, ok := todouser.GetUserByLogin(login.Email, login.Password, tododb)

	if ok {
		//Convert to json user.
		response,_ := getJsonResponse(true, todojson.ParseToDoUser(user))
		fmt.Fprintf(w, string(response))
	}else {
		response,_ := getJsonResponse(false, "Wrong username or password.")
		fmt.Fprintf(w, string(response))
	}
}

func logout(w http.ResponseWriter, r *http.Request)  {
	user, ok := authenticateRequest(r, tododb)
	var response []byte
	if ok {
		ok = todousersession.DeleteUserSessionByKey(user.SessionKey, tododb)
		response,_ = getJsonResponse(ok, "You were logged out.")
	}
	response,_ = getJsonResponse(ok, "You were logged out.")
	fmt.Fprintf(w, string(response))
}

func getJsonResponse(status bool, object interface{}) ([]byte, error) {
	type PayLoad struct {
		Status bool
		Object interface{}
	}

	jSon, error := json.Marshal(PayLoad{Object:object, Status:status})

	//Send stream notification.
	//stream.Notifier <- jSon

	return jSon, error
}

var tododb *tododatabase.ToDoDb
var stream *todoeventstream.Broker
/*
Use in production!
var tpl *template.Template
func init(){
	tpl = template.Must(template.ParseGlob("templates/*.gohtml"))
}*/

func main()  {
	log.Print("Server started")
	tododb = tododatabase.New("db/ToDoReact.db")
	tododb.Ping()
	defer tododb.Close()

	//Declare the eventstream handle
	stream = todoeventstream.NewServer()


	//Register route handles
	http.HandleFunc("/", serveIndex)
	http.HandleFunc("/api/AddList", addList)
	http.HandleFunc("/api/GetLists", getLists)
	http.HandleFunc("/api/GetList", getList)
	http.HandleFunc("/api/AddItem", addItem)
	http.HandleFunc("/api/UpdateItem", updateItem)
	http.HandleFunc("/api/Register", register)
	http.HandleFunc("/api/Login", login)
	http.HandleFunc("/api/Logout", logout)
	http.HandleFunc("/api/TryLogin", tryLogin)

	//Register the event stream handle
	//http.HandleFunc("/event/UpdateStream", stream.ServeHTTP)

	http.Handle("/public/", http.StripPrefix("/public", http.FileServer(http.Dir("public"))))
	http.ListenAndServe("localhost:8080", nil)
}