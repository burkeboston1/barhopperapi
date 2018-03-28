# BarHopper API

REST API that serves BarHopper web and mobile apps

The base URL for our API is `https://barhopperapi.herokuapp.com/api`

You should set `Content-Type` to `application/x-www-form-urlencoded`. 

## Endpoints

**[POST]** `/api/signup`

Sign up a user by sending a request with the body: 

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

---

**[POST]** `/api/authenticate`

Send the request with the body: 

```
{
  email: <user email>, 
  password: <plan-text password>
}
```

---

**[GET]** `/api/promotions/:location`

The location should be of the form `[<longitude>, <latitude>]`. Returns a JSON object called `results` with an array of promotions. 

Example response: 

```

```
