//import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {GraphQLError} from 'graphql';
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
 username: string;
 email: string,
}

//export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
export const authenticationToken = ({req}: any) =>{
 const authHeader = req.headers.authorization;
 const bodyToken =  req.body.token;
 const queryToken = req.query.token;

 // token to be sent via req.body, req.query, or headers.
 let token = bodyToken || queryToken || authHeader;

//if token is sent in the authoriation header, extract token from the header.
  if (authHeader) {
    //const token = authHeader.split(' ')[1];
    token = token.split(' ').pop().trim();}

    // if no token provided, return requested object as is
    if(!token){
      return req;
    }


    //verify the token
    try {
    const secretKey = process.env.JWT_SECRET_KEY || '';
     //const {data}: any = jwt.verify(token, secretKey, (err, user) => {
      const {data}: any = jwt.verify(token, secretKey, {maxAge: '1hr'});

      //if token valid, then attach user data to requested object.
      req.user = data as JwtPayload;

      //if (err) {
        //return res.sendStatus(403); // Forbidden
      //}
     }
     catch(err)
     {
      //token is invalid.
      console.log("Invalid token"); 

     }

     // return requested object.
     return req;

     // req.user = user as JwtPayload;
      //return next();
    //});
  //} else {
   // res.sendStatus(401); // Unauthorized
 // }

};

export const signToken = (username: string, email: string, _id: unknown) => {
  //create payload user info.
  const payload = { username, email, _id };
  const secretKey:any = process.env.JWT_SECRET_KEY; //obtain from env variable.
//sign token with secret key, and set it to expire in 1 hour.
  return jwt.sign({data:payload}, secretKey, { expiresIn: '1h' });
};

//using GraphQLError from graphql
export class AuthenticationError extends GraphQLError{
  constructor(message: string){

    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    
    Object.defineProperty(this,'name', {value: 'AuthenticationError'});

}
};
