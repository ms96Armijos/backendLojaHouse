const mongoose = require('mongoose');

async function connect(){
    await mongoose.connect('mongodb+srv://dblojahouse:db123@cluster0.pmwaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
     {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true 
     })
     .then(db => console.log('DB is connect'))
    .catch(err => console.log(err));

    
 }
module.exports = {connect};


