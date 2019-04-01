const express = require('express')
const mustacheExpress = require('mustache-express')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')()
const app = express()
const connectionString = "postgres://localhost:5432/stephencattanach"

const db = pgp(connectionString)

app.use(bodyParser.urlencoded({ extended: false }))
app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')
const myPlaintextPassword = 'bubba123'
const saltRounds = 10;

const someOtherPlaintextPassword = 'not_bacon';

let hash= bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    console.log(hash)
  });
  

   bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
    
});



app.post("/addpost", (req,res)=>{
    let title = req.body.title
    let body = req.body.body

    db.one('INSERT INTO monblogs(title,posts) VALUES($1,$2) RETURNING postid',[title,body])
    .then((data)=>{
        
    })
res.redirect("/blog")
})


app.post("/update-post", (req,res)=>{
    let postid = req.body.updateID
    let previousPost= req.body.previousPost
    let updatePost = req.body.body
    let body = previousPost+"  "+updatePost
    
    

    db.none('UPDATE monblogs SET posts = $1  WHERE postid = $2',[body,postid])
    .then(()=>{
        
        res.redirect("/blog")
    })

})

app.get('/blog',(req,res)=>{
    db.any('SELECT postid,title,posts FROM monblogs')
    .then ((blogs)=>{
       
        res.render('blog',{blogs:blogs})
       
    })
    
})

app.post('/delete-post', (req,res)=>{
    let postid = parseInt(req.body.postId)
   

    db.none('DELETE FROM monblogs WHERE postid = $1',[postid])
    .then(()=>{
        res.redirect('/blog')
    })
})


app.listen(3000,() => {
    console.log("At your service...")
  })