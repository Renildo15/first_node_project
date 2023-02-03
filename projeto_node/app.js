// Carregando módulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParse = require('body-parser');
    const app = express();
    const admin = require('./routes/admin')
    const path = require('path')
    const mongoose = require('mongoose')

// Configurações
    // Body Parser
    app.use(bodyParse.urlencoded({extended: false}))
    app.use(bodyParse.json())
    // Handlebars
    app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }))
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
// Rotas
    app.use('/admin', admin);
// Outros
const PORT = 8081;

app.listen(PORT,()=>{
    console.log("Servidor rodando!");
})