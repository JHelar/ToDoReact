package todojson

import (
	"tododatabase/todouser"
	"tododatabase/todolist"
	"time"
	"tododatabase/todoitem"
)

//Package aimed to restructure todotables for safe transfer to clients.
type User struct {
	SessionKey string
	UserName string
	Email string
}

//Parses a todouser into a jsonUser object for safe transfer!
func ParseToDoUser(tableUser *todouser.User) *User {
	return &User{
		SessionKey:tableUser.SessionKey,
		UserName:tableUser.UserName,
		Email:tableUser.Email,
	}
}

type List struct {
	Name string
	ID int
	Items []Item
}

func ParseToDoList(tableList *todolist.List) *List {
	safeItems := make([]Item, 0)

	for _,item := range tableList.Items {
		safeItems = append(safeItems, ParseToDoItem(item))
	}

	return &List{
		Name:tableList.Name,
		ID:tableList.ID,
		Items:safeItems,
	}
}

func ParseToDoLists(tableLists []todolist.List) []*List {
	lists := make([]*List, 0)
	for _,tableList := range tableLists {
		lists = append(lists, ParseToDoList(&tableList))
	}
	return lists
}

type Item struct {
	ID int
	Name string
	Count int
	Done bool
	Created time.Time
}

func ParseToDoItem(tableItem todoitem.Item) Item {
	return Item{
		ID:tableItem.ID,
		Name:tableItem.Name,
		Count:tableItem.Count,
		Done:tableItem.Done,
		Created:tableItem.Created,
	}
}