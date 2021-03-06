package main

import (
	"fmt"
	"html/template"
	"net/http"
	"log"
	"tododatabase"
	"todoeventstream"
	"encoding/json"
	"todosecurity"
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

func getAllItems(w http.ResponseWriter, r *http.Request){
	response, err := getJsonResponse()
	if err != nil{
		panic(err)
	}

	fmt.Fprintf(w, string(response))
}

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

func getJsonResponse() ([]byte, error) {
	type PayLoad struct {
		Owners []tododatabase.Owner
	}

	jSon, error := json.Marshal(PayLoad{Owners:tododb.GetAllOwners(true)})
	//Send stream notification.
	stream.Notifier <- jSon

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
	tododb = tododatabase.New("db/ToDo.db")
	tododb.Ping()
	defer tododb.Close()

	salt, sPass := todosecurity.NewSaltedPassword("lokabrun4")
	//Try the salting.
	log.Printf("salt: %s, pass: %s", salt, sPass)

	//Declare the eventstream handle
	stream = todoeventstream.NewServer()

	//Register route handles
	http.HandleFunc("/", serveIndex)
	http.HandleFunc("/api/GetAllItems", getAllItems)
	http.HandleFunc("/api/UpdateItem", updateItem)
	http.HandleFunc("/api/AddItem", addItem)

	//Register the event stream handle
	http.HandleFunc("/event/UpdateStream", stream.ServeHTTP)

	http.Handle("/public/", http.StripPrefix("/public", http.FileServer(http.Dir("public"))))
	http.ListenAndServe("0.0.0.0:8080", nil)
}