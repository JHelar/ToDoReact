package tododatabase

import (
	"database/sql"
	"log"
	_"github.com/mattn/go-sqlite3"
)

//Object to interface with the database.
type ToDoDb struct {
	db     *sql.DB
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

func (todb ToDoDb) Prepare(query  string) *sql.Stmt {
	stmt, err := todb.db.Prepare(query)
	if err != nil {
		log.Fatal(err)
	}
	return stmt
}

func (todb ToDoDb) Query(query string, args ...interface{}) *sql.Rows{
	var rows *sql.Rows
	var err error
	if len(args) > 0 {
		rows, err = todb.db.Query(query, args...)
	}else{
		rows, err = todb.db.Query(query)
	}
	if err != nil {
		log.Fatal(err)
	}
	return rows
}

func (todb ToDoDb) QueryRow(query string, args ...interface{}) *sql.Row {
	var row *sql.Row
	if len(args) > 0{
		row = todb.db.QueryRow(query, args...)
	}else{
		row = todb.db.QueryRow(query)
	}
	return row
}

func New(dbSource string) *ToDoDb {
	database, err := sql.Open("sqlite3", dbSource)
	if err != nil {
		log.Fatal(err)
	}
	return &ToDoDb{db:database}
}

