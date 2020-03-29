# Backend API SIH-2020
We have built an http server using express backend framework.The server processes the request and send response theough API.
Web and android application require server to provide data from the database and perform other authentication and authorization tasks.
The database is made on MongoDB which is a NoSQL database.
For better API communization , A GraphQL server is made to allow smooth and easy communiation between server and frontend application.

## Installation
          Run Command npm install
### Start Server
          Run Command npm start

#### Description
To send an api request open your browser and go to url
##### GraphQLI interface
       localhost:8000/graph
To create a new user 
mutation {
  addUser(name:"Ishan",password:"123",emailOrPhone:"ishan@456"){
    name
    emailOrPhone
  }
}
To create a new item  
mutation{  
  addItem(title:"Car",quantity:500,userId:"//id of user to which item belong"){  
    title  
    quantity  
  }  
}  
To fetch user information  
  {  
    user(id:"//User Id"){  
    name  
     id  
        items{  
        title  
       quantity  
      }  
    }    

To fetch all users  
{  
  users{  
    name  
    emailOrPhone  
    items{  
      title  
      quantity  
    }  
  }  
}   
