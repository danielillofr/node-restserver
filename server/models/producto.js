var mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator')
var Schema = mongoose.Schema;


var productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
        unique: true
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio únitario es necesario']
    },
    descripcion: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: [true, 'Categoria es necesario']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

productoSchema.plugin(uniquevalidator, { message: '{PATH} debe ser unico' });
module.exports = mongoose.model('Producto', productoSchema);