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

**[GET]** `/api/promotions/loc/:location`

The location should be of the form `[<longitude>, <latitude>]`. Returns a JSON object called `results` with an array of promotions. 

Example response: 

```
{
    "success": true,
    "message": "Here's some promotions",
    "results": [
        {
            "location": {
                "coordinates": [
                    -80.41944889999999,
                    37.2346131
                ],
                "type": "Point"
            },
            "upvotes": 0,
            "_id": "5abc0c8114abf60d30b7b03b",
            "name": "Happy Hour",
            "description": "$2 off all doubles",
            "bar_id": "5abbf30dbc00c82e881b98cc",
            "barName": "622 North Main",
            "barAddress": "622 North Main Street, Blacksburg, VA 24060",
            "startDate": "2018-03-28T04:00:00.000Z",
            "endDate": "2018-03-30T04:00:00.000Z",
            "__v": 0
        },
        {
            "location": {
                "coordinates": [
                    -80.4138621,
                    37.2289497
                ],
                "type": "Point"
            },
            "upvotes": 0,
            "_id": "5abc14cf5589e64d84e3b02b",
            "name": "I like BOOZE",
            "description": "booze plz",
            "bar_id": "5abc14475589e64d84e3b02a",
            "barName": "UNDERGROUND BRAH",
            "barAddress": "120 North Main Street, Blacksburg, VA 24060",
            "startDate": "2018-03-28T04:00:00.000Z",
            "endDate": "2018-03-30T04:00:00.000Z",
            "__v": 0
        },
        {
            "location": {
                "coordinates": [
                    -80.4138621,
                    37.2289497
                ],
                "type": "Point"
            },
            "upvotes": 0,
            "_id": "5abc14e55589e64d84e3b02c",
            "name": "Some promotion",
            "description": "Spend money here",
            "bar_id": "5abc14475589e64d84e3b02a",
            "barName": "UNDERGROUND BRAH",
            "barAddress": "120 North Main Street, Blacksburg, VA 24060",
            "startDate": "2018-03-28T04:00:00.000Z",
            "endDate": "2018-03-30T04:00:00.000Z",
            "__v": 0
        }
    ]
}
```

---

**[GET]** `/api/promotions/bar/:location`

Returns a JSON object called `results` with an array of promotions associated with the given bar_id. 

Example response: 

```
{
    "success": true,
    "message": "Here's some promotions",
    "results": [
        {
            "location": {
                "coordinates": [
                    -80.41944889999999,
                    37.2346131
                ],
                "type": "Point"
            },
            "upvotes": 0,
            "_id": "5abc0c8114abf60d30b7b03b",
            "name": "Happy Hour",
            "description": "$2 off all doubles",
            "bar_id": "5abbf30dbc00c82e881b98cc",
            "barName": "622 North Main",
            "barAddress": "622 North Main Street, Blacksburg, VA 24060",
            "startDate": "2018-03-28T04:00:00.000Z",
            "endDate": "2018-03-30T04:00:00.000Z",
            "__v": 0
        }
    ]
}
```
---

**[GET]** `/api/promotions/bar/:location`

Returns a JSON object called `results` with an array of bars near the coordinates given. 

