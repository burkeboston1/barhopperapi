# BarHopper API

REST API that serves BarHopper web and mobile apps

The base URL for our API is `https://barhopperapi.herokuapp.com/api`

## Features

*Signup*

Sign users up by sending a POST request to `https://barhopperapi.herokuapp.com/api/signup`.

You should set `Content-Type` to `application/x-www-form-urlencoded`. 

The body of this request should contain the following key-value pairs: 

```
{
  email: <email address>, 
  password: <plain-text password>, 
  name: <user's name>, 
  admin: <true if user is a bar manager (false for patrons)>
}
```

On success, the API will return the following: 

```
{
    "success": true,
    "message": "User created. Here's a token.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWFiNmM5OGMyNGNhN2MxNDUwNzVhMTEyIiwiYWRtaW4iOnRydWUsImlhdCI6MTUyMTkyODU4OCwiZXhwIjoxNTIxOTMwMDI4fQ.FywqmGeS6hiXIUrC9i0fDHSBNDqLUd3gordPT9uTRYs"
    "desc_id": <foreign key to patron or bar description>
}
```

User apps will need to save this token for as long as the user is signed-in. For any protected routes you hit, you will need to set the `x-access-token` field in the header to this token. 

When the user signs out, simply delete the token from memeory on the client-side. 


*Login*

To implement user login, send a POST request `https://barhopperapi.herokuapp.com/api/authenticate` with the email and password in the request body. You'll get the same response from the API as sign up but with the message `User signed in. Here's a token.`. 


