// We are now going to be storing our data and manipulating it in db
const mongoose= require('mongoose');
const Schema =mongoose.Schema;

const eventSchema= new Schema ({
    name: {
        type:String,
        required:true
    },
    description :{
        type:String,
        required:true
    },
    price:{
        type: Number,
        rqeuired:true
    },
    date :{
        type:Date,
        required:true
    }

})

module.exports= mongoose.model('Event',eventSchema);