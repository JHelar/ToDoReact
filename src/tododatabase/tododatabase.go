package tododatabase

import (
	"database/sql"
	"log"
	_"github.com/mattn/go-sqlite3"
	"todosecurity"
)

//Object to interface with the database.
type ToDoDb struct {
	db     *sql.DB
}

type Item struct {
	ItemID int
	OwnerID int
	Name string
	Count int
	Created string
	Done bool
}

type Owner struct {
	OwnerID int
	FirstName string
	LastName string
	Created string
	Items []Item
}

type OwnerLogins struct {
	ID int
	OwnerID int
	Salt string
	Password string
	Created string
	Email string
	IsDiabled string
}

func (todb ToDoDb) AddItem(item Item) bool {
	stmt, err := todb.db.Prepare("INSERT INTO Items (OwnerID, Name) VALUES (?, ?)")
	defer stmt.Close()

	if err != nil {
		log.Printf("Error in AddItem, for prepare statement")
		return false
	}
	_, err = stmt.Exec(item.OwnerID, item.Name)
	if err != nil {
		log.Printf("Error in AddItem, for execute statement")
		return false
	}
	return true
}

func (todb ToDoDb) UpdateItem(item Item) bool {
	stmt, err := todb.db.Prepare("UPDATE Items SET Name = ?, Done = ?, Count = ? WHERE ItemID = ?")
	defer stmt.Close()

	if err != nil {
		log.Printf("Error in UpdateItem, for prepare statement")
		return false
	}
	_, err = stmt.Exec(item.Name, item.Done, item.Count, item.ItemID)
	if err != nil {
		log.Printf("Error in UpdateItem, for execute statement")
		return false
	}
	return true
}

//Sets all the items for the given owner
func (todb ToDoDb) SetAllItems(owner *Owner) {
	rows, err := todb.db.Query("SELECT ItemID, Name, Count, Created, Done FROM Items WHERE OwnerID = ?", owner.OwnerID)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var items []Item
	for rows.Next() {
		var itemID, count int
		var name, created string
		var done bool
		err := rows.Scan(&itemID, &name, &count, &created, &done)

		if err != nil {
			log.Fatal(err)
		}
		items = append(items, Item{
			ItemID:itemID,
			OwnerID:owner.OwnerID,
			Name:name,
			Created:created,
			Count:count,
			Done:done,
		})
	}
	err = rows.Err()
	if err != nil {
		log.Fatal(err)
	}
	owner.Items = items
}

func (todb ToDoDb) GetAllOwners(includeItems bool) []Owner {
	rows := todb.Query("SELECT * FROM Owners")
	defer  rows.Close()

	var owners []Owner
	for rows.Next() {
		var ownerID int
		var firstName, lastName, created string
		err := rows.Scan(&ownerID, &firstName, &lastName, &created)

		if err != nil {
			log.Fatal(err)
		}
		owner := Owner{
			OwnerID:ownerID,
			FirstName:firstName,
			LastName:lastName,
			Created:created,}
		if includeItems {
			todb.SetAllItems(&owner)
		}
		owners = append(owners, owner)
	}
	err := rows.Err()
	if err != nil {
		log.Fatal(err)
	}

	return owners
}

func (todb ToDoDb) GetOwner(id int) Owner {
	row := todb.QueryRow("SELECT * FROM Owners WHERE OwnerID = ?", id)

	var ownerID int
	var firstName, lastName, created string

	err := row.Scan(&ownerID, &firstName, &lastName, &created)
	switch {
	case err == sql.ErrNoRows:
		log.Printf("No rows where found")
	case err != nil:
		log.Fatal(err)
	default:
		break
	}
	return Owner{OwnerID:ownerID, FirstName:firstName, LastName:lastName, Created:created}
}

//Tries to get an owner. Based on login details.
func (todb ToDoDb) TryGetOwner(sessionKey, email, password string) (Owner, bool){
	//Try get from session key
	//TODO: Implement session support
	if sessionKey != nil{
		//row := todb.QueryRow("SELECT OwnerID FROM OwnerSessions WHERE SessionKey = ?", sessionKey)

	}
	row := todb.QueryRow("SELECT OwnerID, Salt, Password FROM OwnerLogins WHERE Email = ?", email)

	var OwnerID int
	var Salt, Password string
	err := row.Scan(&OwnerID, &Salt, &Password)
	switch {
	case err == sql.ErrNoRows:
		log.Printf("No user with email: %s", email)
		return Owner{}, false
	case err != nil:
		log.Print("Something went terribly wrong in TryGetOwner")
		return Owner{}, false
	default:
		break
	}

	//With the matching owner found, see if it is the correct password.
	if todosecurity.CheckIfEqual(Salt, Password, password){
		//We can log in! Get the Complete Owner Object
		return todb.GetOwner(OwnerID), true
	}else{
		return Owner{}, false
	}
}

func (todb ToDoDb) AddOwner(firstName, lastName, email, password string) bool{
	stmt, err := todb.db.Prepare("INSERT INTO Owners (FirstName, LastName) VALUES(?, ?)")

	if err != nil {
		log.Print("Error in AddOwner, for prepare statement")
		return false
	}
	res, err := stmt.Exec(firstName, lastName)
	if err != nil {
		log.Print("Error in AddOwner, for execute statement")
		return false
	}
	OwnerID, err := res.LastInsertId()

	//Create OwnerLogin object
	salt, saltPass := todosecurity.NewSaltedPassword(password)

	stmt.Close()
	stmt, err = todb.db.Prepare("INSERT INTO OwnerLogins (OwnerID, Salt, Password, Email) VALUES (?, ?, ?, ?)")
	if err != nil {
		log.Print("Error in AddOwner, for prepare OwnerLogins statement")
		return false
	}
	_, err = stmt.Exec(OwnerID, salt, saltPass, email)
	if err != nil {
		log.Print("Error in AddOwner, for OwnerLogins execute statement")
		return false
	}

	return true
}

func (todb ToDoDb) Query(queryStr string, args ...interface{}) *sql.Rows {
	var rows * sql.Rows
	var err error
	if len(args) > 0 {
		rows, err = todb.db.Query(queryStr, args)
	}else{
		rows, err = todb.db.Query(queryStr)
	}
	if err != nil {
		log.Fatal(err)
	}
	return rows
}

func (todb ToDoDb) QueryRow(queryStr string, args ...interface{}) *sql.Row {
	row := todb.db.QueryRow(queryStr, args)
	return row
}
func (todb ToDoDb) Close() {
	todb.db.Close()
}
func (todb ToDoDb) Ping() {
	err := todb.db.Ping()
	if err != nil {
		log.Fatal(err)
	}
}
func (todb ToDoDb) Begin() (*sql.Tx) {
	tx, err := todb.db.Begin()
	if err != nil {
		log.Fatal(err)
	}
	return tx
}

func New(dbSource string) *ToDoDb {
	database, err := sql.Open("sqlite3", dbSource)
	if err != nil {
		log.Fatal(err)
	}
	return &ToDoDb{db:database}
}

