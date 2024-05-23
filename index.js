const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require("express-graphql");
const mongoose=  require('mongoose');
const { buildSchema } = require('graphql');

const Event= require("./models/event");
const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`

        type Event {
           _id:ID!
           name:String!
           description:String!
           price:Float!
           date:String!
        }
        input EventInput{
          name:String!
          description:String!
          price:Float!
          date:String!
        }
        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        // find method is used to query the database
        return Event.find()
        .then(events=>{
          return events;
      }).catch(err=> console.log(err));
      },
      createEvent: (args) => {
        // const event= {
        //    _id: Math.random().toString(),
        //    name: args.eventInput.name,
        //    description: args.eventInput.description,
        //    price:args.eventInput.price,
        //    date: new Date().toISOString()
        // }
        // we will now create an entry inside the MongoDB database
        console.log("Hii");
        console.log(args);
        const event=new Event({
          name: args.eventInput.name,
          description: args.eventInput.description,
          price:args.eventInput.price,
          date: new Date(args.eventInput.date)
        });
        console.log(event);
        // we have created an object now we need to save this inside DB. save() methods does that for us, it returns a promise like object
       return   event.save()
        .then((result)=>{
           return result;
        })
        .catch(err=>{
            console.log(err);
        });// 
        
      }
    },
    graphiql: true
  })
);

// connecting the database

mongoose.connect(`mongodb://localhost:27017/event-react-dev`)
.then(()=>{
    console.log("DB connected");
})
.catch(err=>{
   console.log(err);
}); 
app.listen(3000, ()=>{
   console.log("Server is running");
});