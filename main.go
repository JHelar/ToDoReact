package main

import (
	"fmt"
	"html/template"
	"net/http"
	"log"
	"tododatabase"
	"todoeventstream"
	"encoding/json"
	"strings"
	"tododatabase/todouser"
	"tododatabase/todolist"
	"strconv"
	"tododatabase/todojson"
)

func serveIndex(w http.ResponseWriter, r *http.Request)  {
	//Use tpl variable for template execution in production!
	//This is for test only
	index, err := template.ParseFiles("templates/index.gohtml")
	if err != nil {
		panic(err)
	}
	index.Execute(w, nil)
}

func addUserList(w http.ResponseWriter, r *http.Request)  {
	decoder := json.NewDecoder(r.Body)

	var data struct{
		Key string
		Name string
	}
	err := decoder.Decode(&data)
	if err != nil {
		log.Print(err)
		response,_ := getJsonResponse(false, "Something went wrong try again later.")
		fmt.Fprintf(w, string(response))
		return
	}
	user, ok := todouser.GetUserBySessionKey(data.Key, tododb)
	if ok {
		ok = todolist.AddList(user.ID, data.Name, tododb)
		list := todolist.GetListByName(user.ID, data.Name, tododb)
		response,_ := getJsonResponse(true, todojson.ParseToDoList(list))
		fmt.Fprintf(w, string(response))
	}
}

func getUserLists(w http.ResponseWriter, r *http.Request){
	userId := strings.TrimPrefix(r.URL.Path, "/api/GetUserLists/")
	userIdInt,err := strconv.ParseInt(userId, 10, 0)
	if err != nil{
		panic(err)
	}
	user := todouser.GetUserById(int(userIdInt), tododb)
	user.Lists = todolist.GetListsByUserId(user.ID, tododb)


	response, err := getJsonResponse(true, user)
	if err != nil{
		panic(err)
	}

	fmt.Fprintf(w, string(response))
}

func registerUser(w http.ResponseWriter, r *http.Request)  {
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
		response,_ := getJsonResponse(true, "Success!")
		fmt.Fprintf(w, string(response))
	}else {
		response,_ := getJsonResponse(false, "Mail is allready in use.")
		fmt.Fprintf(w, string(response))
	}
}

func tryLoginUser(w http.ResponseWriter, r *http.Request){
	decoder := json.NewDecoder(r.Body)

	var session struct{
		Key string
	}
	err := decoder.Decode(&session)
	if err != nil {
		log.Print(err)
		response,_ := getJsonResponse(false, "Something went wrong try again later.")
		fmt.Fprintf(w, string(response))
		return
	}
	user, ok := todouser.GetUserBySessionKey(session.Key, tododb)
	if ok {
		//Convert to json user!
		response,_ := getJsonResponse(true, todojson.ParseToDoUser(user))
		fmt.Fprintf(w, string(response))
	}else {
		response,_ := getJsonResponse(false, "ForceLogin!")
		fmt.Fprintf(w, string(response))
	}
}

func loginUser(w http.ResponseWriter, r *http.Request) {
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

/*
func updateItem(w http.ResponseWriter, r *http.Request){
	decoder := json.NewDecoder(r.Body)

	var item tododatabase.Item
	err := decoder.Decode(&item)
	if err != nil {
		panic(err)
	}
	if success := tododb.UpdateItem(item); success {
		response, err := getJsonResponse()
		if err != nil {
			log.Printf("Error in get json for update")
		}
		fmt.Fprintf(w, string(response))
	}
}

func addItem(w http.ResponseWriter, r *http.Request)  {
	decoder := json.NewDecoder(r.Body)

	var item tododatabase.Item
	err := decoder.Decode(&item)
	if err != nil {
		panic(err)
	}
	if success := tododb.AddItem(item); success{
		response, err := getJsonResponse()
		if err != nil {
			log.Printf("Error in get json for add")
		}
		fmt.Fprintf(w, string(response))
	}
}
*/
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
	http.HandleFunc("/api/AddList", addUserList)
	http.HandleFunc("/api/GetLists/", getUserLists)
	http.HandleFunc("/api/Register", registerUser)
	http.HandleFunc("/api/Login", loginUser)
	http.HandleFunc("/api/TryLogin", tryLoginUser)

	//Register the event stream handle
	//http.HandleFunc("/event/UpdateStream", stream.ServeHTTP)

	http.Handle("/public/", http.StripPrefix("/public", http.FileServer(http.Dir("public"))))
	http.ListenAndServe("0.0.0.0:8080", nil)
}