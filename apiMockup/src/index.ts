import * as graphql from "graphql";
import { readFileSync } from "fs";
import { ApolloServer } from "apollo-server";

function randomColor(): string {
    var out = "#";
    for (var i = 0; i < 3; i++) {
        out += Math.floor(Math.random() * 255).toString(16).padStart(2, "0");
    }
    return out;
}

const schemaFile = readFileSync("schemas/schema.graphql").toString();
const schema = graphql.buildSchema(schemaFile);

const mocks = {
    Int: () => 0,
    String: () => "A text",
    JSON: () => JSON.stringify({ this: "is", a: ["test"] }),
    Colour: randomColor,
    TimeSpan: () => Math.random() * 31536000000,
    Date: () => new Date().toISOString(),
}

const server = new ApolloServer({schema, mocks});
server.listen("8080").then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });