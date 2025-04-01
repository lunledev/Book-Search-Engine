//import { Query } from 'mongoose';
import { User } from '../models/index.js';

import { signToken, AuthenticationError } from '../services/auth.js';


interface UserArgs {
    id: string;
    username: string;
}

interface AddUserArgs{
input: {

    username: string;
    email: string;
    password: string;
}

}

interface LoginUserArgs{
    email: string;
    password: string;
}

const resolvers = {

    Query: {

        // get a single user by either their id or their username
       getSingleUser: async (_parent: any, {id, username}: UserArgs, context: any) => {
            const foundUser = await User.findOne({
                $or: [{ _id: context.user ? context.user._id : id}, { username: username }],
            });

            if (!foundUser) {
                //return res.status(400).json({ message: 'Cannot find a user with this id!' });
                throw new AuthenticationError('Cannot find a user with this id!');
            }

            //return res.json(foundUser);
            return foundUser;
        },

        users: async() =>{
            try{
                const users = await User.find({});
                return users;
            }
            catch(err){
                console.log(err);
                return err;

            }
        }


    },
    Mutation: {
        //create a user a token, and send it back(client/src/compenents/SignUpForm.js)
       addUser: async (_parent: any, {input}: AddUserArgs) =>{
            const user = await User.create({...input});

            if(!user)
            {
                 throw new AuthenticationError('Something is Wrong!');
            }
            const token = signToken(user.username, user.email, user._id);


            return {token, user};



        },

        //login a user, sign a token and send it back back(client/src/compenents/SignUpForm.js)
        login: async (_parent: any, {email,password}: LoginUserArgs) =>{

            const user = await User.findOne({email});

            if (!user){
                throw new AuthenticationError("Can't find this user");
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw){

                throw new AuthenticationError("Wrong password!")
            }

            const token = signToken(user.username, user.email, user._id);

            return {token, user};
        },
        


    },




};

export default resolvers;

