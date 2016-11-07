package todolist

import (
	"tododatabase"
	"database/sql"
	"log"
	"tododatabase/todoitem"
	"time"
)

type List struct {
	ID int
	UserID int
	Name string
	Created time.Time
	Items []todoitem.Item
}


func GetListById(userID int, listID int, db *tododatabase.ToDoDb) *List {
	row := db.QueryRow("SELECT Name, Created FROM Lists WHERE UserID = ? AND ID = ?", userID, listID)

	var name string
	var created time.Time

	err := row.Scan(&name, &created)
	switch {
	case err == sql.ErrNoRows:
		log.Printf("No Lists found with userID: %d and id: %d", userID, listID)
		return nil
	case err != nil:
		log.Print(err)
		return nil
	default:
		items := todoitem.GetItemsByListID(listID, db)
		return &List{ID: listID, UserID:userID, Name:name, Created:created, Items:items}
	}
}


func GetListByName(userID int, listName string, db *tododatabase.ToDoDb) *List {
	row := db.QueryRow("SELECT ID, Created FROM Lists WHERE UserID = ? AND Name = ?", userID, listName)

	var id int
	var created time.Time

	err := row.Scan(&id, &created)
	switch {
	case err == sql.ErrNoRows:
		log.Printf("No Lists found with userID: %d and name: ", userID, listName)
		return nil
	case err != nil:
		log.Print(err)
		return nil
	default:
		items := todoitem.GetItemsByListID(id, db)
		return &List{ID: id, UserID:userID, Name:listName, Created:created, Items:items}
	}
}

//Retrieve all lists that a user owns
func GetListsByUserId(userID int, db *tododatabase.ToDoDb) []List {
	rows := db.Query("SELECT ID, Name, Created FROM Lists WHERE UserID = ?", userID)
	defer rows.Close()

	var lists []List
	for rows.Next() {
		var id int
		var name string
		var created time.Time

		err := rows.Scan(&id, &name, &created)
		switch {
		case err == sql.ErrNoRows:
			log.Printf("No Lists found with userID: %d", userID)
		case err != nil:
			log.Fatal(err)
		default:
			items := todoitem.GetItemsByListID(id, db)
			lists = append(lists, List{ID: id, UserID:userID, Name:name, Created:created, Items:items})
		}
	}
	return lists
}

func AddList(userID int, name string, db *tododatabase.ToDoDb) bool {

	stmt := db.Prepare("INSERT INTO Lists(UserID, Name) VALUES (?, ?)")
	defer stmt.Close()

	_,err := stmt.Exec(userID, name)

	if err != nil {
		log.Print(err)
		return false
	}
	return true
}

func DeleteList(listID int, db *tododatabase.ToDoDb) bool {
	stmt := db.Prepare("DELETE FROM Lists WHERE ID = ?")
	defer stmt.Close()

	_, err := stmt.Exec(listID)
	if err != nil {
		log.Print("Cant delete list!")
		return false
	}

	//Delete the items!
	items := todoitem.GetItemsByListID(listID, db)
	for _,item := range items {
		todoitem.DeleteItem(item.ID, db)
	}
	return true
}