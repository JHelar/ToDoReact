package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
)

type Payload struct {
	Owners []Owner
}

type Owner struct {
	Name string
	Id int
	Items []Item
}

type Item struct {
	OwnerId int
	Id int
	Name string
	Done bool
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

func getAllItems(w http.ResponseWriter, r *http.Request){
	response, err := getJsonResponse()
	if err != nil{
		panic(err)
	}

	fmt.Fprintf(w, string(response))
}

func updateItem(w http.ResponseWriter, r *http.Request){
	decoder := json.NewDecoder(r.Body)

	var item Item
	err := decoder.Decode(&item)
	if err != nil {
		panic(err)
	}
	response, err := updateJsonResponse(item)
	if err != nil {
		panic(err)
	}
	fmt.Fprintf(w, string(response))
}

func addItem(w http.ResponseWriter, r *http.Request)  {
	decoder := json.NewDecoder(r.Body)

	var item Item
	err := decoder.Decode(&item)
	if err != nil {
		panic(err)
	}

	response, err := addJsonResponse(item)
	if err != nil {
		panic(err)
	}
	fmt.Fprintf(w, string(response))
}

var dummyResponse Payload
func init(){
	item1 := Item{
		OwnerId: 0,
		Name: "Fiskbulle",
		Id: 0,
		Done: false,
	}
	item2 := Item{
		OwnerId: 0,
		Name: "Hamster",
		Id: 1,
		Done: false,
	}
	item3 := Item{
		OwnerId: 0,
		Name: "En massa kött",
		Id: 2,
		Done: false,
	}
	items := make([]Item, 3)
	items[0] = item1
	items[1] = item2
	items[2] = item3

	owner := Owner{
		Name:"John",
		Id:0,
		Items:items,
	}
	owners := make([]Owner, 3)
	owners[0] = owner

	items = make([]Item, 3)
	item1.OwnerId = 1
	item2.OwnerId = 1
	item3.OwnerId = 1
	items[0] = item1
	items[1] = item2
	items[2] = item3
	owner.Name = "Kalle"
	owner.Id = 1
	owner.Items = items
	owners[1] = owner

	items = make([]Item, 3)
	item1.OwnerId = 2
	item2.OwnerId = 2
	item3.OwnerId = 2
	items[0] = item1
	items[1] = item2
	items[2] = item3
	owner.Name = "Anna"
	owner.Id = 2
	owner.Items = items
	owners[2] = owner

	dummyResponse = Payload{Owners:owners}
}
/*
Use in production!
var tpl *template.Template
func init(){
	tpl = template.Must(template.ParseGlob("templates/*.gohtml"))
}*/

func main()  {
	http.HandleFunc("/", serveIndex)
	http.HandleFunc("/api/GetAllItems", getAllItems)
	http.HandleFunc("/api/UpdateItem", updateItem)
	http.HandleFunc("/api/AddItem", addItem)
	http.Handle("/public/", http.StripPrefix("/public", http.FileServer(http.Dir("public"))))
	http.ListenAndServe("localhost:8080", nil)
}

func addJsonResponse(item Item) ([]byte, error) {
	for i, o := range dummyResponse.Owners {
		if o.Id == item.OwnerId {
			items := &dummyResponse.Owners[i].Items
			length := len(*items)

			lastItem := (*items)[length - 1]
			item.Id = lastItem.Id + 1
			*items = append(*items, item)
			break
		}
	}
	return getJsonResponse()
}

func updateJsonResponse(item Item) ([]byte, error){
	var owner *Owner

	for i, o := range dummyResponse.Owners {
		if o.Id == item.OwnerId {
			owner = &dummyResponse.Owners[i]
			break
		}
	}
	for i, itm := range owner.Items {
		if itm.Id == item.Id {
			owner.Items[i] = item
			break
		}
	}
	return getJsonResponse()
}

func getJsonResponse() ([]byte, error) {

	return json.MarshalIndent(dummyResponse, "", "  ")

}