// Carregando módulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    const admin = require('./routes/admin');
    const usuarios = require('./routes/usuario')
    const path = require('path');
    const mongoose = require('mongoose');
    const session = require("express-session");
    const flash = require("connect-flash");
    const moment = require('moment');
    const router = require('./routes/admin');
    const passport = require('passport');
    require("./models/Postagem")
    require("./models/Categoria")
    const Postagem = mongoose.model("postagens")
    const Categoria = mongoose.model("categorias")
    require("./config/auth")(passport)

// Configurações

    // Sessão
    app.use(session({
        secret:"15071907",
        resave: true,
        saveUninitialized: true
    }));


    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash());

    // Middleware
    app.use((req, res, next)=>{
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null
        next();
    });

    // Body Parser
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

    // Handlebars
    app.engine('handlebars', handlebars.engine({ 
        defaultLayout: 'main',
        helpers: {
            formatDate: (date) => {
                return moment(date).format('DD/MM/YYYY HH:mm')
            }
        } 
    }))
    app.set('view engine', 'handlebars')


    // Mongoose
    mongoose.set("strictQuery", false);
    mongoose.connect("mongodb://localhost/blogapp",{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>{
        console.log("Conectado ao mongodb");
    }).catch((err)=>{
        console.log("Erro ao se conectar: " + err)
    })

    // Public
    app.use(express.static(path.join(__dirname,"public")))
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

// Rotas
    app.get('/', (req, res)=>{
        Postagem.find().populate("categoria").lean().sort({data:"desc"}).then((postagens)=>{
            res.render("index", {postagens:postagens})
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro interno")
            res.redirect("/404")
        })
    })

    app.get("/postagens/:slug",(req,res)=>{
        Postagem.findOne({slug:req.params.slug}).lean().then((postagem)=>{
            if(postagem){
                res.render("postagem/index",{postagem:postagem})
            }else{
                req.flash("error_msg","Esta postagem não existe!")
                res.redirect("/")
            }
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro interno!")
            res.redirect("/")
        })
    })

    app.get("/categorias",(req, res)=>{
        Categoria.find().lean().then((categorias)=>{
            res.render("categorias/index",{categorias:categorias})
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro interno!")
            res.redirect("/")
        })
    })

    app.get("/categorias/:slug",(req,res)=>{
        Categoria.findOne({slug:req.params.slug}).lean().then((categoria)=>{
            if(categoria){
                Postagem.find({categoria:categoria._id}).lean().then((postagens)=>{
                    res.render("categorias/postagens", {postagens:postagens, categoria:categoria})
                }).catch((err)=>{
                    req.flash("error_msg","Houve um erro interno!")
                    res.redirect("/")
                })
            }else{
                req.flash("error_msg","Essa categoria não existe!")
                res.redirect("/")
            }
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro interno!")
            res.redirect("/")
        })
    })

    app.get("/404",(req, res)=>{
        res.send("Erro 404!")
    })
    app.use('/admin', admin);
    app.use('/usuarios', usuarios)
// Outros
const PORT = 8081;

app.listen(PORT,()=>{
    console.log("Servidor rodando!");
})