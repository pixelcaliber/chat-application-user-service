# chat-application-user-service

User mirco-service: Part of chat application, it enables secure login, signin and registration of users using JWT, also additionally provides efficient search mechanism for any user based on its username

tech-stack: Postgres, Python, flask


### User Service:

1. User is registered and the credentials are stored in the Postgres.
2. Registered user are able to login to use the chat application.
3. This service uses JWT for secure authentication and authorisation.
4. User database is postgres that stores all the user details and credentials.
5. Additionally, the User Service facilitates user searches by username, returning the corresponding username and user ID upon finding an exact match.



### API Contracts:

User Service:
```
POST: /register

req:
{
    username: String,
    password: String,
    email: String
}

response:
{
    access_token: String
    username: String,
    user_id: UUIDv4
}

POST: /login
req:
{
    username: String,
    password: String,
}
response:
{
    access_token: String
    username: String,
    user_id: UUIDv4
}

GET: /users/show

response:
{
    "users" = [
    {
        "username": String,
        "user_id": UUIDv4
    }, 
    {
        "username": String,
        "user_id": UUIDv4
    },..]
}

GET: /users/show?username={username}

response:
{
   "username": String,
   "user_id": UUIDv4
}

This api is returning the user with the given username 
by querying the postgres User table with the matching records.
```
Websocket endpoints:

```
@socketio.on('connect', namespace='/chat')
- to connect the user to the messaging service

@socketio.on('disconnect', namespace='/chat')
- to disconnect user from the messaging service

@socketio.on('start_private_chat', namespace='/chat')
- checks if there exists a history of chat btw user1 and user2
- if exists then retrieve the chat_id
- if not then generate a new chat_id and insert it into the user_chat table along with
   user_id and timestamp
- creates a room for 2 users with room_id = chat_id
- users can connect to this room and exchange messages

@socketio.on('send_message', namespace='/chat')
- push the message into the database with the message_id chat_id, sender_id, etc (see the model schema for details)
- emit a receive_message event so that users can receive messages 
    whoever are listening to this event in the same room

@socketio.on('receive_message', namespace='/chat')
- sends an acknowledment to the users
```
