const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req,res)=>{
    res.render("admin/index")
})

router.get('/posts',(req, res)=>{
    res.send("Página de posts");
})

router.get('/categorias',(req, res)=>{
    Categoria.find().sort({data:'desc'}).lean().then((categorias)=>{
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao listar as categorias!")
        res.redirect("/admin")
    })

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

router.get("/categorias/edit/:id", (req, res)=>{
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render("admin/edit_categorias", {categoria:categoria});
    }).catch((err)=>{
        req.flash("error_msg","Essa categoria não existe!");
        res.redirect("/admin/categorias");
    })
})

router.post("/categorias/edit", (req, res)=>{
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
        res.render("admin/edit_categorias", {errors:errors})
    }else{
        Categoria.findOne({_id:req.body.id}).then((categoria)=>{
        
            categoria.nome = req.body.nome;
            categoria.slug = req.body.slug
    
            categoria.save().then(()=>{
                req.flash("success_msg","Categoria editada com sucesso!")
                res.redirect("/admin/categorias")
            }).catch((err)=>{
                req.flash("error_msg","Houve um erro interno ao salvar a categoria!");
                res.redirect("/admin/categorias");
            })
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro ao editar a categoria!")
            res.redirect("/admin/categorias");
        })
    }
});

router.post("/categorias/deletar",(req, res)=>{
    Categoria.deleteOne({_id:req.body.id}).then(()=>{
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao deletar a categoria!")
        res.redirect("/admin/categorias");
        console.log(err)
    })
})


//Postagens

router.get("/postagens", (req,res)=>{
    Postagem.find().populate("categoria").lean().sort({data:"desc"}).then((postagens)=>{
        res.render("admin/postagens",{postagens:postagens})
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao listar as postagens!")
        res.redirect("/admin")
        console.log(err)
    })
    
})


router.get("/postagens/add", (req, res)=>{
    Categoria.find().lean().then((categorias)=>{
        res.render("admin/add_postagens", {categorias:categorias})
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao carregar formulário!")
        res.redirect("/admin");
        console.log(err)
    })
    
})

router.post("/postagens/nova",(req,res)=>{
    var errors = []

    if(req.body.categoria == "0"){
        errors.push({texto: "Categoria inválida, registre uma categoria"})
    }

    if(errors.length > 0){
        res.redirect("admin/add_postagens", {errors:errors})
    }else{
        const novaPostagens = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagens).save().then(()=>{
            req.flash("success_msg","Postagem criada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro durante o salvamento da postagem")
            res.redirect("/admin/postagens")
        })
    }
})


router.get("/postagens/edit/:id", (req, res)=>{
    Postagem.findOne({_id:req.params.id}).lean().then((postagem)=>{
        Categoria.find().lean().then((categorias)=>{
            res.render("admin/edit_postagens",{categorias:categorias, postagem:postagem})
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro ao listar as categorias!")
            res.redirect("/admin/postagens")
        })
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao carregar o formulario de edicão!")
        res.redirect("/admin/postagens")
    })
    
})

router.post("/postagens/edit", (req,res)=>{
    Postagem.findOne({_id:req.body.id}).then((postagem)=>{
        postagem.titulo = req.body.titulo
        postagem.descricao = req.body.descricao
        postagem.slug = req.body.slug
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(()=>{
            req.flash("success_msg","Postagem editada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro interno ao salvar a postagem!");
            res.redirect("/admin/postagens");
        })
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao salvar a edição!")
        res.redirect("/admin/postagens")
    })
})

router.get("/postagens/deletar/:id",(req, res)=>{
    Postagem.remove({_id:req.params.id}).then(()=>{
        req.flash("success_msg", "Postagem deletada com sucesso!")
        res.redirect("/admin/postagens")
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro interno!")
        res.redirect("/admin/postagens")
    })
})
module.exports = router