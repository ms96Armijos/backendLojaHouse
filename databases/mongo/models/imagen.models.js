let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//VERSIONKEY: FALSE PARA QUE NO APAREZCA -V CUANDO SE CREA EL DOCUMENTO
let imagenSchema = new Schema({
    url: {type: String},
    inmueble: {type: Schema.Types.ObjectId, ref: 'Inmueble'},
    public_id: {type: String},
}, {timestamps: true, versionKey: false}, { collection: 'imagenes'});




module.exports = mongoose.model('Imagen', imagenSchema);