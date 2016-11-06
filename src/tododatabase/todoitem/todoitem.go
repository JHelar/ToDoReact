package todoitem

import (
	"tododatabase"
	"database/sql"
	"log"
	"time"
)

type Item struct {
	ID int
	ListID int
	UserID int
	Name string
	Count int
	Created time.Time
	Done bool
}


//Retrieves all Items based on listID
func GetItemsByListID(listID int, db *tododatabase.ToDoDb) []Item {
	rows := db.Query("SELECT ID, Name, Count, Created, Done FROM Items WHERE ListID = ?", listID)
	defer rows.Close()

	var items []Item
	for rows.Next() {
		var id, count int
		var name string
		var created time.Time
		var done bool

		err := rows.Scan(&id, &name, &count, &created, &done)
		switch {
		case err == sql.ErrNoRows:
			log.Printf("No Items found with ListID: %d", listID)
		case err != nil:
			log.Fatal(err)
		default:
			items = append(items, Item {
				ID:id,
				ListID:listID,
				UserID:-1,
				Name:name,
				Count:count,
				Created:created,
				Done:done,
			})
		}

	}
	return items
}

func UpdateItem(db *tododatabase.ToDoDb, args ...interface{},) bool {
	stmt := db.Prepare("UPDATE Items SET UserID = ?, Name = ?, Count = ?, Done = ? WHERE ID = ?")
	defer stmt.Close()

	_, err := stmt.Exec(args...)
	if err != nil {
		log.Print(err)
		return false
	}
	return true
}



func AddItem(listID int, name string, db *tododatabase.ToDoDb) bool {
	stmt := db.Prepare("INSERT INTO Items(ListID, Name) VALUES (?, ?)")
	defer stmt.Close()

	_,err := stmt.Exec(listID, name)

	if err != nil {
		log.Print(err)
		return false
	}
	return true
}
