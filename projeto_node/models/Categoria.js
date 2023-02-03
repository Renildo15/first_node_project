const mongoose = require('mongoose');
const { STRING } = require('sequelize');
const Schema = mongoose.Schema;

const Categoria = new Schema({
    nome:{
        type: STRING,
        required: true
    },
    slug:{
        type: STRING,
        required: true
    },
    data: {
        type:Date,
        default: Date.now()
    }
})

mongoose.model("categorias", Categoria)