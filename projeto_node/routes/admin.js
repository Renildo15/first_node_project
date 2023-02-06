const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req,res)=>{
    res.render("admin/index")
})

router.get('/posts',(req, res)=>{
    res.send("Página de posts");
})

router.get('/categorias',(req, res)=>{
    res.render("admin/categorias")
})
router.get('/categorias/add',(req, res)=>{
    res.render("admin/add_categoria")
})

router.post("/categorias/nova",(req, res)=>{
    var errors = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        errors.push({texto: "Nome inválido"});
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        errors.push({texto: "Slug inválido"});
    }

    if(req.body.nome.length < 2 || req.body.slug.length < 2){
        errors.push({texto: "Muito curto! "})
    }

    if(errors.length > 0){
        res.render("admin/add_categoria", {errors:errors})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(()=>{
            console.log("Categoria salva com sucesso!")
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro salvar a categoria, tente novamente!")
            res.redirect("/admin")
        })
    }
    
})

module.exports = router