// Carregando módulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParse = require('body-parser');
    const app = express();
    const admin = require('./routes/admin')
    //const mongoose = require('mongoose')

// Configurações
    // Body Parser
    app.use(bodyParse.urlencoded({extended: false}))
    app.use(bodyParse.json())
    // Handlebars
    app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }))
    app.set('view engine', 'handlebars')
    // Mongoose
// Rotas
    app.use('/admin', admin);
// Outros
const PORT = 8081;

app.listen(PORT,()=>{
    console.log("Servidor rodando!");
})