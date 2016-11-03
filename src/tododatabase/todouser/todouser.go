package todouser

import (
	"tododatabase"
	"database/sql"
	"log"
	"todosecurity"
	"tododatabase/todolist"
	"tododatabase/todousersession"
	"time"
)


type User struct {
	ID int
	Email string
	UserName string
	Salt string
	Password string
	Created string
	IsDisabled bool
	SessionKey string
	Lists []todolist.List
}

func GetUserById(userID int, db *tododatabase.ToDoDb) *User {
	row := db.QueryRow("SELECT * FROM Users WHERE ID = ?", userID)

	var id int
	var email, username, salt, password, created string
	var isDisabled bool

	err := row.Scan(&id, &email, &username, &salt, &password, &created, &isDisabled)
	switch {
	case err == sql.ErrNoRows:
		log.Printf("No user found with id: %d", userID)
	case err != nil:
		log.Fatal(err)
	default:
		break
	}
	return &User{
		ID:id,
		Email:email,
		UserName:username,
		Created:created,
		IsDisabled:isDisabled,
	}
}

func GetUserBySessionKey(sessionKey string, db *tododatabase.ToDoDb) (*User, bool)  {
	session, ok := todousersession.GetUserSessionByKey(sessionKey, db)
	if ok {
		if duration := session.LastSeenTime.Sub(time.Now()); duration.Minutes() > 15 {
			//Delete record, force login.
			todousersession.DeleteUserSession(session, db)
			return nil, false
		}else{
			//Update record time.
			session.LastSeenTime = time.Now()
			ok := todousersession.UpdateUserSession(session, db)
			if !ok{
				//Delete record, force login.
				log.Print("Could not update usersession...Delete!")
				todousersession.DeleteUserSession(session, db)
				return nil, false

			}else{
				user := GetUserById(session.UserID, db)
				user.SessionKey = sessionKey
				return user, true
			}
		}
	}else{
		return nil, false
	}
}

func GetUserByLogin(email, password string, db *tododatabase.ToDoDb) (*User, bool) {
	row := db.QueryRow("SELECT * FROM Users WHERE Email = ?", email)
	var id int
	var rowEmail, username, salt, saltedPassword, created string
	var isDisabled bool

	err := row.Scan(&id, &rowEmail, &username, &salt, &saltedPassword, &created, &isDisabled)
	switch {
	case err == sql.ErrNoRows:
		log.Printf("No user found with email: %d", email)
		return &User{}, false
	case err != nil:
		log.Fatal(err)
	default:
		break
	}

	//Salt the given password and check equality
	if todosecurity.CheckIfEqual(salt, saltedPassword, password) {
		//Retrive a new sessionKey.
		skey, _ := todousersession.NewUserSession(id, db)
		return &User{
			ID:id,
			Email:email,
			UserName:username,
			Created:created,
			IsDisabled:isDisabled,
			SessionKey:skey,
		}, true
	}else {
		return &User{}, false
	}
}

func AddUser(email, username, password string, db *tododatabase.ToDoDb) bool {
	//Find user with same email.
	row := db.QueryRow("SELECT ID FROM Users WHERE Email = ?", email)

	var id int
	err := row.Scan(&id)
	if err == sql.ErrNoRows {

		//Get salt and hashed password
		salt, saltedPass := todosecurity.NewSaltedPassword(password)

		stmt := db.Prepare("INSERT INTO Users(Email, Username, Salt, Password) VALUES (?, ?, ?, ?)")
		_, err := stmt.Exec(email, username, salt, saltedPass)
		if err != nil {
			log.Print(err)
			return false
		}
		return true
	}else{
		log.Printf("Mail is allready in use: %s", email)
		return false
	}
}