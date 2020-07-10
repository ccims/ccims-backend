import { mockServer, IMocks, IMockOptions, addMocksToSchema } from "graphql-tools";
import * as graphql from "graphql";
import { readFileSync } from "fs";
import express from "express";
import { graphqlHTTP, Options } from "express-graphql";

function randomColor(): string {
    var out = "#";
    for (var i = 0; i < 3; i++) {
        out += Math.floor(Math.random() * 255).toString(16).padStart(2, "0");
    }
    return out;
}

const schemaFile = readFileSync("schemas/schema.graphql").toString();
const schema = graphql.buildSchema(schemaFile);

const mockData: IMocks = {
    Int: () => 0,
    String: () => "A text",
    JSON: () => JSON.stringify({ this: "is", a: ["test"] }),
    Colour: randomColor,
    TimeSpan: () => Math.random() * 31536000000,
    Date: () => new Date().toISOString(),
}

const mockOptions: IMockOptions = {
    mocks: mockData,
    schema: schema,
    preserveResolvers: true
}

const apiMock = addMocksToSchema(mockOptions);

console.log(apiMock);


const server = express();

const graphqlOptions: Options = {
    graphiql: true,
    schema: apiMock
};

server.use("/api", graphqlHTTP(graphqlOptions));

server.listen(8080);

console.log("Started server on Port 8080");
console.log("GraphiQL (API Explorer + Rendered Docs) available at: http://localhost:8080/api");
console.log("API-Endpoint: http://[SERVER-IP]:8080/api")