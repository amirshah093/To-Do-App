const express = require ('express');
const mongodb = require ('mongodb');
const sanatizeHTML = require ('sanitize-html')

const myApp = express();
let db
myApp.use(express.static("public"))

const connectionString ='mongodb+srv://amirshah:Amir2131@cluster0-rftja.mongodb.net/todo?retryWrites=true&w=majority'
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function ( err, client) {
    db = client.db()
    myApp.listen(3000)
});

myApp.use(express.json())
myApp.use(express.urlencoded({extended: false}))

const passwordProtected = (req, res, next) =>{
  res.set('www-Authenticate', 'Basic realm="Simple To Do App"') 
  console.log(req.headers.authorization)
  if(req.headers.authorization == "Basic U2hhaDpTaGFoMQ=="){
      next()
    } else {
      res.status(401).send('Authentication required')
    }
}

myApp.get('/', passwordProtected, (req, res) =>{
    db.collection('items').find().toArray((err, items) =>{
        res.send(`
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <div class="container">
          <h1 class="display-4 text-center py-1">To Do App</h1>
          
          <div class="jumbotron p-3 shadow-sm">
            <form id="create-form" action="create-item" method="POST">
              <div class="d-flex align-items-center">
                <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                <button class="btn btn-primary">Add New Item</button>
              </div>
            </form>
          </div>
          
          <ul id="item-list" class="list-group pb-5">

          </ul>
          <script>
             let items = ${JSON.stringify(items)}
          </script>
          <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
          <script src="browser.js"></script>
        </div>
  
      `)
    })
   
})

myApp.use(passwordProtected)

myApp.post('/create-item', (req, res) =>{
  let safeText = sanatizeHTML(req.body.text, {allowedTags: [], allowedAttributes:{}})  
    db.collection("items").insertOne({text: safeText}, function ( err, info) {
      res.json(info.ops[0]);
    })

})

myApp.post('/update-item', (req, res) =>{
  let safeText = sanatizeHTML(req.body.text, {allowedTags: [], allowedAttributes:{}})  
  db.collection('items').findOneAndUpdate({_id:new mongodb.ObjectID(req.body.id)}, {$set:{text: safeText}}, () =>{
    res.send("success")
  })
}) 

myApp.post('/delete-item', (req, res) =>{
  db.collection('items').deleteOne({_id:new mongodb.ObjectID(req.body.id)}, () =>{
    res.send("sucess")
  })
})

