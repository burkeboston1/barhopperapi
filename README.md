# BarHopper API

REST API that serves BarHopper web and mobile apps

The base URL for our API is `https://barhopperapi.herokuapp.com/api`

## Features

*Signup & Login*

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
}
```
