package todousersession

import (
	"time"
	"tododatabase"
	"database/sql"
	"log"
	"todosecurity"
)
type UserSession struct {
	SesssionKey string
	UserID int
	LoginTime time.Time
	LastSeenTime time.Time
}

func NewUserSession(userID int, db *tododatabase.ToDoDb) (string, bool){
	//First check for existing session!
	row := db.QueryRow("SELECT SessionKey FROM UserSessions WHERE UserID = ?", userID)

	var sessionKey string
	err := row.Scan(&sessionKey)
	if err != sql.ErrNoRows {
		//We found session key. Update it and return!
		_= UpdateUserSession(&UserSession{LastSeenTime:time.Now(), LoginTime:time.Now(), SesssionKey:sessionKey}, db)
		return sessionKey, true
	}

	stmt := db.Prepare("INSERT INTO UserSessions (SessionKey, UserID, LoginTime, LastSeenTime) VALUES (?, ?, ?, ?)")
	defer stmt.Close()

	sKey := todosecurity.GenerateSessionKey()
	//sKey := "Hej"
	loginTime := time.Now()
	lastSeenTime := time.Now()

	_, err = stmt.Exec(sKey, userID, loginTime, lastSeenTime)
	if err != nil {
		log.Print(err)
		return "", false
	}
	return sKey, true

}

func GetUserSessionByKey(sessionKey string, db *tododatabase.ToDoDb) (*UserSession, bool){
	row := db.QueryRow("SELECT UserID, LoginTime, LastSeenTime FROM UserSessions WHERE SessionKey = ?", sessionKey)

	var loginTime, lastSeenTime time.Time
	var userID int

	err := row.Scan(&userID, &loginTime, &lastSeenTime)
	switch {
	case err == sql.ErrNoRows:
		log.Printf("No session with key: %s", sessionKey)
		return nil, false
	case err != nil:
		log.Print("Something went wrong in GetUserSessionByKey")
		return nil, false
	default:
		break
	}
	return &UserSession{SesssionKey:sessionKey, UserID:userID, LoginTime:loginTime, LastSeenTime:lastSeenTime}, true
}

func UpdateUserSession(userSession *UserSession, db *tododatabase.ToDoDb) bool {
	stmt := db.Prepare("UPDATE UserSessions  SET LastSeenTime = ? WHERE SessionKey = ?")
	defer stmt.Close()

	_, err := stmt.Exec(userSession.LastSeenTime, userSession.SesssionKey)
	if err != nil {
		log.Print(err)
		return false
	}
	return true
}

func DeleteUserSession(userSession *UserSession, db *tododatabase.ToDoDb) bool {
	stmt := db.Prepare("DELETE FROM UserSessions WHERE SessionKey = ?")
	defer stmt.Close()
	_, err := stmt.Exec(userSession.SesssionKey)
	if err != nil {
		log.Print("Cant delete usersession!")
		return false
	}
	return true
}
