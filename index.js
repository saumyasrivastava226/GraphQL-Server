const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require("express-graphql");
const mongoose=  require('mongoose');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());
const events=[];
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
        return events;
      },
      createEvent: (args) => {
        const event= {
           _id: Math.random().toString(),
           name: args.eventInput.name,
           description: args.eventInput.description,
           price:args.eventInput.price,
           date: new Date().toISOString()
        }
        console.log(event);
        events.push(event);
        return event;
      }
    },
    graphiql: true
  })
);

// connecting the database

mongoose.connect(`mongodb://localhost:27017`)
.then(()=>{
    console.log("DB connected");
})
.catch(err=>{
   console.log(err);
}); 
app.listen(3000, ()=>{
   console.log("Server is running");
});