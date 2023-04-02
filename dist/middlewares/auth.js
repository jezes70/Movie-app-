"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../model/userModel");
const jwtSecret = process.env.JWT_SECRET;
/* ====================== EJS MIDDLEWARE ====================== */
async function auth(req, res, next) {
    try {
        //req.cookies.jwt
        //const authorization = req.headers.authorization
        const authorization = req.cookies.token;
        if (!authorization) {
            return res.redirect('/login');
        }
        // const token = authorization.split(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(authorization, jwtSecret);
        if (!verified) {
            return res.redirect('/login');
        }
        const { id } = verified;
        //fine user by id;
        const user = await userModel_1.UserInstance.findOne({ where: { id } });
        if (!user) {
            return res.redirect('/login');
        }
        req.user = verified;
        next();
    }
    catch (err) {
        res.redirect('/login');
    }
}
exports.auth = auth;
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
