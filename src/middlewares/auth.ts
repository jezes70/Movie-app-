import {NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { UserInstance } from '../model/userModel';
const jwtSecret = process.env.JWT_SECRET as string;

/* ====================== EJS MIDDLEWARE ====================== */
export async function auth(req:Request | any, res:Response, next:NextFunction): Promise<unknown> {
   try{
    //req.cookies.jwt
    //const authorization = req.headers.authorization
    const authorization = req.cookies.token;

   if (!authorization){
         return res.redirect('/login')
   }

    // const token = authorization.split(7, authorization.length);

    let verified = jwt.verify(authorization, jwtSecret);

    if (!verified){
        return res.redirect('/login')
    }

    const {id} = verified as {[key:string]:string}

    //fine user by id;
    const user = await UserInstance.findOne({where: {id}})

    if (!user){
        return res.redirect('/login')
    }

    req.user = verified
    next()

   }catch(err){
    res.redirect('/login')
   }
}



/* ====================== API MIDDLEWARE =========================== */
// export async function auth(req:Request | any, res:Response, next:NextFunction): Promise<unknown> {
//     try{
//      //req.cookies.jwt
//      const authorization = req.headers.authorization
//     //  const authorization = req.cookies.jwt;
 
//     if (!authorization){
//           return res.status(401).json({error: "kind sigh in as a user"})
//     }
 
//      const token = authorization.split(7, authorization.length);
 
//      let verified = jwt.verify(token, jwtSecret);
 
//      if (!verified){
//          return res.status(401).json({error: "token invalid, you cant acces this route"})
//      }
 
//      const {id} = verified as {[key:string]:string}
 
//      //fine user by id;
//      const user = await UserInstance.findOne({where: {id}})
 
//      if (!user){
//          return res.status(401).json({error: "kindly rigister/signin as a user"})
//      }
 
//      req.user = verified
//      next()
 
//     }catch(err){
//      res.status(401).json({error: "user not logged in"})
//     }
//  }