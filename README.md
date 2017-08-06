#RESTful API using hapi.js and MongoDB

This is the code for this blog-post: [Build a RESTful API using hapi.js and MongoDB](http://mph-web.de/build-a-restful-api-using-hapi-js-and-mongodb/)

##How to setup?

You should have a current version of node installed and a local MongoDB server running. Now just clone the repository and execute these two commands:

```
npm install
node server.js
```
Team Members:
Deepika Boparai
Ashwin Vishwanath
Pushpinder Singh Brar

How to test the API locally?

Folder structure:

--book_lending_api
     |
     |____________api
     |             |_______qury
     |               |_______routes
     |_______route  
     |      |
     |     |____model
     |
     |__book-sample.json
     |
     |__server.js
     |
     |__package.json

Note: Package.json includes all dependencies.

             eg)    {
  "name": "hapi-rest-mongo",
  "version": "1.0.0",
  "description": "Simple REST project with hapijs and mongodb.",
  "main": "server.js",
  "private": true,
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "boom": "^4.3.1",
    "glob": "^7.1.2",
    "hapi": "^16.5.0",
    "hapi-async-routes": "^1.1.0",
    "hapi-auth-jwt": "^4.0.0",
    "joi": "^10.6.0",
    "mongojs": "^2.4.0",
    "mongoose": "^4.11.4",
    "node-uuid": "^1.4.7"
  }
}

●	Book-sample.json includes example data of book details which can be used for to insert book into db.

              eg:-)    {
  "title":"welcome",
  "author":"jems",
    "genre":"mystery",
      "borrowed":{
        "staus":false,
        "dueDate":"12-14-2001"
       },
        "publication":{
          "publishedDate":"21-07-1993",
            "publisher":"mark",
              "other":{}
        }, 
          "availability":{"reserved":false,
                           "borrowed":"no",
                           "copies":{"copi":"adiot"},
                             "other":{"other":"detail"} 
          }
} 


●	Server.js file  includes port number ,  mongoose driver , server register.

Route include model it have sub folder where it have model of mongodb collections.

API consists of a query folder where we can write query methods. It also consists of  another folder named “routes”where our route methods can be written.

Testing of the API:-

●	 Go to the book_lending_api and start the server with node server.js
●	To add the book into “db” use Advance REST Client tool  or POSTMAN or Local Host. These tools are available in google and you can add it as an extension to your Google Chrome web  browser.
1.	 Add book
                     Select “POST” method and use /addBook url , header type is application/json 
 

          eg:-)   url    http://localhost:3000/addBook

                              Content-Type: application/json

                            Exaple data :   {
  "title":"welcome5",
  "author":"jems5",
    "genre":"mystery45",
      "borrowed":{
        "staus":false,
        "dueDate":"12-14-2001"
       },
        "publication":{
          "publishedDate":"21-07-1993",
            "publisher":"mark5",
              "other":{}
        }, 
          "availability":{"reserved":false,
                           "borrowed":"yes",
                           "copies":{"copi":"adiot5"},
                             "other":{"other":"detail5"} 
          }
} 

●	List of Books:
                The following below iis the link to be pasted in ARC or POSTMAN tool or local host
             
                Url:  http://localhost:3000/listOfBooks
                Method : GET

●	Query list of Books upto limit of 5 books:

                Url:  http://localhost:3000/qurylistOfBooks?author=JemsGoo
                Method: GET

●	Delete Book:
                Url : http://localhost:3000/delete/59820ecf15c28c65b9e14d43
                Method: DELETE  
               59820ecf15c28c65b9e14d43: This is unique db ID of the book.

●	Individual Book:
                   Url http://localhost:3000/individuals/59820cffd47c8564f52771e1
                    Method : GET

●	Update Book:
               Url : http://localhost:3000/update/5982063c29703862d791974e
               Method : PUT , PATCH

                 Example data: 
                               {
                             "title":"wehh",
                             "author":"",
                             "genre":"mystery45",
                             "borrowed":{
                             "staus":false,
                             "dueDate":"12-14-2001"
                             },
        "publication":{
          "publishedDate":"21-07-1993",
            "publisher":"mark5",
              "other":{}
        }, 
          "availability":{"reserved":false,
                           "borrowed":"yes",
                           "copies":{"copi":"adiot5"},
                             "other":{"other":"detail5"} 
          }
} 

 Additional Functionality:

 Two types:functionality
1.	Users
2.	Authentication

1.	Users:
●	  Registration: 
                   Url: http://localhost:3000/register
                   Method : POST
                  Content-Type: application/json

                   Example data :
                                          {
  
        "Username":" ashwin",
        "password":"ashwin1232",
          "email":"ashwin@gmail.com",
         "mobileNumber":"9892008737"
} 
●	Login:
             Url:  http://localhost:3000/login
             Method : POST 

              Content-Type: application/json
              Example data :

                     {
        "Password": “ashwin123",
          "email":"ashwin@gmail.com"
} 

●	User Book borrowing:    
          
             Url: http://localhost:3000/userborrowsBook/5982066e29703862d7919752

            Path : /userborrowsBook/{uid}
           
             5982066e29703862d7919752 : this is unique user id from database.

            Method : POST
            Content-Type: application/json
 
            Example data:  
                                    {
  "title":"welcome",
  "author":"jems",
    "genre":"mystery",
      "borrowed":{
        "staus":true,
        "dueDate":"12-14-2001"
       },
         "latefees":true,
        "publication":{
          "publishedDate":"21-07-1993",
            "publisher":"mark",
              "other":{}
        }, 
          "availability":{"reserved":true,
                           "borrowed":"yes",
                           "copies":{"copi":"adiot"},
                             "other":{"other":"detail"} 
          }
} 


●	User updating the borrowed book details:

           Url :  http://localhost:3000/update/59820cffd47c8564f52771e1/5982108315c28c65b9e14d46

           Path:  http://localhost:3000/update/{uid}/{bid}
            Uid can be unique user id 
            Bid can be unique book id

            Example 59820cffd47c8564f52771e1 uid 
                           5982108315c28c65b9e14d46 bid

          We use Uid and Bid for the particular user to update the borrowed particular book.
             
          Content-Type: application/json
●	
Method: PUT ,PATCH
Example data :

                       {
  "title":"welcome",
  "author":"jems",
    "genre":"mystery",
      "borrowed":{
        "staus":false,
        "dueDate":"12-14-2001"
       },
         "latefees":true,
        "publication":{
          "publishedDate":"21-07-1993",
            "publisher":"mark",
              "other":{}
        }, 
          "availability":{"reserved":true,
                           "borrowed":"yes",
                           "copies":{"copi":"adiot"},
                             "other":{"other":"detail"} 
          }
} 

●	Get individual User:

             Url: http://localhost:3000/individual/5982057f29703862d791974c
             Method:GET
             PATH : /individuals/{uid}

●	Delete User:

             Url: http://localhost:3000/deleteBooks/598204ff29703862d791974a
             Method : DELETE
             PATH : /delete/{uid}

●	Late fees listing using query:
             
             Url : http://localhost:3000/late_fees?latefees=true
             Path : /late_fees
             Method : GET 
             




2.  AUTHENTICATION:

●	Adding the user with the authentication:

             Url: http://localhost:3000/adminvalid/users
             Method : POST 
             Content-Type: application/json
             Path : /adminvalid/users
            
            example Data:
                                    {
  "username":"ashwin",
    "email":"ashwin@gmail.com",
      "password":"ashwin"
} 

●	Results or Response:
             
             {
"id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU5ODIzMzEzNTNiMTNkNzFlYjFlNTViOSIsInVzZXJuYW1lIjoiYXNod2lucyIsImlhdCI6MTUwMTcwNDk3OSwiZXhwIjoxNTAxNzA4NTc5fQ.fJGk3-jaflL4m9BdYD3RxUFOikOq0c0XVhQspydRLoM"
}

Testing the authentication: Open new terminal paste the result of id_token generated in the terminal .
                                      
 Example:curl -v -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU5ODIzMzEzNTNiMTNkNzFlYjFlNTViOSIsInVzZXJuYW1lIjoiYXNod2lucyIsImlhdCI6MTUwMTcwNDk3OSwiZXhwIjoxNTAxNzA4NTc5fQ.fJGk3-jaflL4m9BdYD3RxUFOikOq0c0XVhQspydRLoM" http://localhost:3000/admin/users.

Note: This was the token id generated during our test conducted in local environment.


●	To authenticate the user from admin 
              Url : http://localhost:3000/admin/users/authenticate
              Method : POST 

              Response is 

                           {
"id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU5ODIxNjI0MTVjMjhjNjViOWUxNGQ0NyIsInVzZXJuYW1lIjoiYXNod2luIiwiaWF0IjoxNTAxNzA1Nzg4LCJleHAiOjE1MDE3MDkzODh9.RD9X7F4ml5xuxLobq7229CWppmeWRt2XqkapfDc5sLw"
}


The above token can be used to authenticate the users from the admin.

             
●	Get Individual User Id with authentication:
   
             URL :   http://localhost:3000/admin/individuals/59820eed15c28c65b9e14d44
             Method : GET 

            Testing : Open new terminal paste the result of id_token generated by the url of  http://localhost:3000/admin/users/authenticate  and test it.

Eg : ) curl -v -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU5ODIxNjI0MTVjMjhjNjViOWUxNGQ0NyIsInVzZXJuYW1lIjoiYXNod2luIiwiaWF0IjoxNTAxNzA1Nzg4LCJleHAiOjE1MDE3MDkzODh9.RD9X7F4ml5xuxLobq7229CWppmeWRt2XqkapfDc5sLw" http://localhost:3000/admin/individuals/59820eed15c28c65b9e14d44



●	Get all list of authenticated users.
 
             Url :  http://localhost:3000/admin/users
             Method : GET 

               Testing : Open new terminal paste the result of id_token generated by the url of  http://localhost:3000/admin/users/authenticate  and test it.


Eg : ) curl -v -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU5ODIxNjI0MTVjMjhjNjViOWUxNGQ0NyIsInVzZXJuYW1lIjoiYXNod2luIiwiaWF0IjoxNTAxNzA1Nzg4LCJleHAiOjE1MDE3MDkzODh9.RD9X7F4ml5xuxLobq7229CWppmeWRt2XqkapfDc5sLw" http://localhost:3000/admin/users


●	Get all list of authenticated users of late fee using query .

         Url :  http://localhost:3000/admin/late_fees?latefees=true
             Method : GET 

 Testing : Open new terminal paste the result of id_token generated by the url of  http://localhost:3000/admin/users/authenticate  and test it.


   Eg : ) curl -v -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU5ODIxNjI0MTVjMjhjNjViOWUxNGQ0NyIsInVzZXJuYW1lIjoiYXNod2luIiwiaWF0IjoxNTAxNzA1Nzg4LCJleHAiOjE1MDE3MDkzODh9.RD9X7F4ml5xuxLobq7229CWppmeWRt2XqkapfDc5sLw" http://localhost:3000/admin/late_fees?latefees=true



●	Delete the authenticated user 

            Url :  http://localhost:3000/admin/delete/59820eed15c28c65b9e14d44
             Method : DELETE 

               Testing : Open new terminal paste the result of id_token generated by the url of  http://localhost:3000/admin/users/authenticate  and test it.


Eg : ) curl -v -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU5ODIxNjI0MTVjMjhjNjViOWUxNGQ0NyIsInVzZXJuYW1lIjoiYXNod2luIiwiaWF0IjoxNTAxNzA1Nzg4LCJleHAiOjE1MDE3MDkzODh9.RD9X7F4ml5xuxLobq7229CWppmeWRt2XqkapfDc5sLw" http://localhost:3000/admin/delete/59820eed15c28c65b9e14d44








            




                             
                             
                         

