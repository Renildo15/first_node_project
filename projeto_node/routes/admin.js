const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    res.send("Página principal do painel ADM");
})

router.get('/posts',(req, res)=>{
    res.send("Página de posts");
})

router.get('/categories',(req, res)=>{
    res.send("Página de caategorias!")
})

module.exports = router