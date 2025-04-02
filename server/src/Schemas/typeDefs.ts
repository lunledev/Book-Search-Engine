const typeDefs =`
input UserInput{
    username: String!
    email: String!
    password: String!
}

input BookInput{

    bookId:String!
    title:String!
    authors:[String]
    description:String!
    image:String
    link: String

}

type User {
    id: ID!
    username: String!
    email: String!
    bookCount: Int!
    saveBooks: [Book]
}
type Auth{
    token: ID!
    user: User
}

type Query{
    
    me: User
}

type Book{
    bookId: String!
    authors: [String]
    description: String!
    title:  String!
    image: String
    link:  String


}


type Mutation{
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: BookInput): User
    removeBook(bookId: String!): User
}
`;

export default typeDefs;