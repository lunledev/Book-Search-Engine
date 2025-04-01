const typeDefs =`
input UserInput{
    username: String!
    email: String!
    password: String!
}

type User {
    id: ID!
    username: String!
    email: String!
}
type Auth{
    token: ID!
    user: User
}

type Query{
    users: [User]
    getSingleUser(ID: ID!): User
}

type Mutation{
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
}
`;

export default typeDefs;