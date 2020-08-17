import { IMocks, IMockOptions, addMocksToSchema, makeExecutableSchema } from "graphql-tools";
import { readFileSync } from "fs";
import express from "express";
import { graphqlHTTP, Options } from "express-graphql";

const cors = require('cors');

function randomColor(): string {
    var out = "#";
    for (var i = 0; i < 3; i++) {
        out += Math.floor(Math.random() * 255).toString(16).padStart(2, "0");
    }
    return out;
}

const schemaFile = readFileSync("schemas/schema.graphql").toString();
const schema = makeExecutableSchema({
    typeDefs: schemaFile,
});

const nodeTypes: string[] = [
    'User',
    'Project',
    'Component',
    'ComponentInterface',
    'Label',
    'Issue',
    'IssueComment',
    'DeletedIssueComment',
    'ReferencedByOtherEvent',
    'ReferencedByIssueEvent',
    'LinkEvent',
    'UnlinkEvent',
    'WasLinkedEvent',
    'WasUnlinkedEvent',
    'LabelledEvent',
    'UnlabelledEvent',
    'PinnedEvent',
    'UnpinnedEvent',
    'RenamedTitleEvent',
    'CategoryChangedEvent',
    'AssignedEvent',
    'UnassignedEvent',
    'ClosedEvent',
    'ReopenedEvent',
    'PriorityChangedEvent',
    'StartDateChangedEvent',
    'DueDateChangedEvent',
    'EstimatedTimeChangedEvent',
    'AddedLocationEvent',
    'RemovedLocationEvent',
    'MarkedAsDuplicateEvent',
    'UnmarkedAsDuplicateEvent',
];

const mockData: IMocks = {
    Int: () => 0,
    String: () => "A text",
    JSON: () => JSON.stringify({ this: "is", a: ["test"] }),
    Colour: randomColor,
    TimeSpan: () => Math.floor(Math.random() * 2**31),
    Date: () => new Date().toISOString(),
    // resolve node type based on id prefix
    Node: (root, { id }) => {
        const nodeType = nodeTypes.find(nodeType => id.startsWith(nodeType));
        if (nodeType != null) {
            return {
                id,
                __typename: nodeType,
            }
        }
        // return a default type, maybe change this to a random type
        return {
            id,
            __typename: 'Project',
        }
    },
}

// add ID generators with the correct id prefix and simple counting ids to the mock resolvers
nodeTypes.forEach(nodeType => {
    let lastId = 0;
    mockData[nodeType] = (root, {id}) => {
        if (id != null) {
            return {id}
        }

        lastId++;
        const newId = lastId;
        return {
            id: `${nodeType}_${newId}`,
        };
    };
});

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

server.use(cors());
server.use("/api", graphqlHTTP(graphqlOptions));

server.listen(8080);

console.log("Started server on Port 8080");
console.log("GraphiQL (API Explorer + Rendered Docs) available at: http://localhost:8080/api");
console.log("API-Endpoint: http://[SERVER-IP]:8080/api");
