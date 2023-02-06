const mongoose = require('mongoose');
const { STRING } = require('sequelize');
const Schema = mongoose.Schema;

const Categoria = new Schema({
    nome:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    data: {
        type:Date,
        default: Date.now()
    }
})

mongoose.model("categorias", Categoria)