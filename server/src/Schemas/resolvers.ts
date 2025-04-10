//import { Query } from 'mongoose';


import { User } from '../models/index.js';

import { signToken, AuthenticationError } from '../services/auth.js';


//interface UserArgs {
//    id: string;
//    username: string;
//}

interface AddUserArgs {
    input: {

        username: string;
        email: string;
        password: string;
    }

}

interface LoginUserArgs {
    email: string;
    password: string;
}

interface addsaveBook {

    bookId: string;
    title: string;
    authors?: string[];
    description: string;
    image?: string;
    link?: string;

}

const resolvers = {

    Query: {

        // get a single user by either their id or their username
       /* getSingleUser: async (_parent: any, { id, username }: UserArgs, context: any) => {
            const foundUser = await User.findOne({
                $or: [{ _id: context.user ? context.user._id : id }, { username: username }],
            });

            if (!foundUser) {
                //return res.status(400).json({ message: 'Cannot find a user with this id!' });
                throw new AuthenticationError('Cannot find a user with this id!');
            }

            //return res.json(foundUser);
            return foundUser;
        },*/

        // get a single user by either their id or their username
        me : async (_parent: any, _args: any, context:any) =>{

            if(context.user){ 
                return User.findOne({_id: context.user._id}).populate("books");
            }
            throw new AuthenticationError('Could not authenticate user.');


        }

     /*   users: async () => {
            try {
                const users = await User.find({});
                return users;
            }
            catch (err) {
                console.log(err);
                return err;

            }
        }*/


    },
    Mutation: {
        //create a user a token, and send it back(client/src/compenents/SignUpForm.js)
        addUser: async (_parent: any, { input }: AddUserArgs) => {
            const user = await User.create({ ...input });

            if (!user) {
                throw new AuthenticationError('Something is Wrong!');
            }
            const token = signToken(user.username, user.email, user._id);


            return { token, user };



        },

        //login a user, sign a token and send it back back(client/src/compenents/SignUpForm.js)
        login: async (_parent: any, { email, password }: LoginUserArgs) => {

            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError("Can't find this user");
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {

                throw new AuthenticationError("Wrong password!")
            }

            const token = signToken(user.username, user.email, user._id);

            return { token, user };
        },

        // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        // user comes from `req.user` created in the auth middleware function
        //export const saveBook = async (req: Request, res: Response) => {
        saveBook: async (_parent: any, args: addsaveBook, context: any) => {
            try {
                if (context.user) {

                    const updatedUser = await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $addToSet: { savedBooks: { ...args } }},
                        { new: true, runValidators: true }
                    );
                    return updatedUser;
                }
                throw new Error("no user found!")


            } catch (err) {
                console.log(err);
                return (err);
            }
        },


        // remove a book from `savedBooks`
        //export const deleteBook = async (req: Request, res: Response) => {
        removeBook: async(_parent: any, args: any, context: any ) => {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId: args.bookId } } },
            { new: true }
          );
          if (!updatedUser) {
            throw new Error("Couldn't find user with this id!");
          }
          return updatedUser;
        },








    },




};

export default resolvers;

