const express = require ('express');
const mongodb = require ('mongodb');

const myApp = express();
let db
myApp.use(express.static("public"))

const connectionString ='mongodb+srv://amirshah:Amir2131@cluster0-rftja.mongodb.net/todo?retryWrites=true&w=majority'
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function ( err, client) {
    db = client.db()
    myApp.listen(3000)
});

myApp.use(express.urlencoded({extended: false}))

myApp.get('/', (req, res) =>{
    db.collection('items').find().toArray((err, items) =>{
        res.send(`
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <div class="container">
          <h1 class="display-4 text-center py-1">To Do App</h1>
          
          <div class="jumbotron p-3 shadow-sm">
            <form action="create-item" method="POST">
              <div class="d-flex align-items-center">
                <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                <button class="btn btn-primary">Add New Item</button>
              </div>
            </form>
          </div>
          
          <ul class="list-group pb-5">
             ${items.map((item)=>{
                return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                <span class="item-text">${item.text}</span>
                <div>
                  <button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                  <button class="delete-me btn btn-danger btn-sm">Delete</button>
                </div>
              </li>
  `
             }).join('')}
          </ul>
          <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
          <script src="browser.js"></script>
        </div>
  
      `)
    })
   
})

myApp.post('/create-item', (req, res) =>{
    db.collection("items").insertOne({text: req.body.item}, function () {
        res.redirect("/")
    })

})
