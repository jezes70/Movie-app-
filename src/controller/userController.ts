import { Request, Response } from "express";
import { UserInstance } from "../model/userModel";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerUserSchema, options, loginUserSchema } from "../utilis/utilis";
import { MovieInstance } from "../model/movieModels";
const jwtSecret = process.env.JWT_SECRET as string;

/* ========================= USER API ================================ */
// export const Register = async (req: Request | any, res: Response) => {
//     try {
//         const {email, fullName, userName, password, confirm_password} = req.body;
//         const iduuid = uuidv4();
//         //validate with Joi email and fullName
//         const validationResut = registerUserSchema.validate(req.body,options)

//         if (validationResut.error){
//             let array = [];
//             array.push(validationResut.error.details[0].message)
//         //     return res.status(400).json({error:validationResut.error.details[0].
//         // message})
//         return res.render("Register",{error:validationResut.error.details[0].
//              message});

//         }

//         //generate salt and hash password
//         const passwordHash = await bcrypt.hash(password , 10)

//         //create user
//         //--check if the user already exists
//         const user = await UserInstance.findOne({
//             where: {email:email}
//         })

//         if (!user){
//         let newUser = await UserInstance.create({
//             id: iduuid,
//             email,
//             fullName,
//             userName,
//             password: passwordHash

//         })

//         //generate token for user
//         const user = await UserInstance.findOne({
//             where: {email:email}
//         })  as unknown as {[key: string]:string}
//         const { id } = user

//         const token = jwt.sign({id},jwtsecret,{expiresIn:"30mins"})

//         res.cookie('token',token, {httpOnly:true, maxAge:30 * 60 * 1000})

//         //res.cookie('token',token, {httpOnly:true, maxAge:30 * 60 * 1000})

//         //otp

//         //Email

//         // return res.status(201).json({
//         //     msg: 'user created successfully',
//         //     newUser,
//         //     token
//         // })
//         return res.redirect("/login");
//         }

//     res.status(409).json({
//     error: "email already taken"

//     })

//     }catch(err){
//         console.log(err)
//         res.status(500).json({error:"Internal server error"})
//     }
// }

// export const Login =  async (req: Request | any, res: Response) => {
//     try{
//         const {email,  password} = req.body;
//         //validate with Joi email and fullName
//         const validationResut = loginUserSchema.validate(req.body, options)

//         if (validationResut.error){
//             return res.status(400).json({error:validationResut.error.details[0].
//         message})
//         }

//      // Gererate token for user
//      const User = await UserInstance.findOne({
//         where:{email:email}
//      })  as unknown as {[key: string]:string}

//      const { id } = User

//      const token = jwt.sign({id},jwtsecret,{expiresIn:"30d"})
//      res.cookie('token',token, {httpOnly:true, maxAge:30 * 24 * 60 * 60 * 1000})

//      const validUser = await bcrypt.compare(password, User.password)

//      if(validUser){
//         // return res.status(201).json({
//         //     msg: "You have successfuly logged in",
//         //     User,
//         //     token,
//         // })
//         return res.redirect("/")
//      }

//         return res.status(400).json({error:"Invalid credentials"})

//     }
//     catch(err){
//         console.log(err)
//         res.status(500).json({error:"Internal server error"})
//     }
// }

// export const getUserAndMovies = async (req: Request | any, res: Response) => {
//     try{

//         //sequelize findAll or findAndCountAll

//         //const getAllMovies = await MovieInstance.findAll();

//      const getAllUser = await UserInstance.findAndCountAll(
//        {
//          include:[
//             {
//                 model: MovieInstance,
//                 as: 'movies',
//             }
//          ]

//        }
//      );

//      return res.status(200).json({
//          msg: 'You have seccssfully retrieve all movies',
//          count: getAllUser.count,
//         users: getAllUser.rows,
//       })

//   }catch(err){
//     console.log(err)
//   }
// }

/* =============================== EJS API ======================== */
export const Register = async (req: Request | any, res: Response) => {
  try {
    const { email, fullName, userName, password, confirm_password } = req.body;
    const iduuid = uuidv4();
    //validate with Joi email and fullName
    const validationResut = registerUserSchema.validate(req.body, options);

    if (validationResut.error) {
      return res.render("Register", {
        error: validationResut.error.details[0].message,
      });
    }

    //generate salt and hash password
    const passwordHash = await bcrypt.hash(password, 10);

    //create user
    //--check if the user already exists
    const user = await UserInstance.findOne({
      where: { email: email },
    });

    if (!user) {
      let newUser = await UserInstance.create({
        id: iduuid,
        fullName,
        email,
        userName,
        password: passwordHash,
      });

      //generate token for user
      const User = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as { [key: string]: string };

      const { id } = User;

      const token = jwt.sign({ id }, jwtSecret, { expiresIn: "30mins" });

      //res.cookie('token',token, {httpOnly:true, maxAge:30 * 60 * 1000})

      //otp

      //Email

      return res.redirect("/login");
    }

    return res.render("Register", {
      error: "Email is already taken",
    });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    //validate with Joi email and fullName
    const validationResut = loginUserSchema.validate(req.body, options);

    if (validationResut.error) {
      return res.render("Login", {
        error: validationResut.error.details[0].message,
      });
    }

    // Gererate token for user
    const User = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as { [key: string]: string };

    const { id } = User;

    const token = jwt.sign({ id }, jwtSecret, { expiresIn: "30d" });
    res.cookie("token", token, { httpOnly: true, maxAge: 30 * 60 * 60 * 1000 });

    const validUser = await bcrypt.compare(password, User.password);

    if (validUser) {
      return res.redirect("/dashboard");
    }

    res.render("Login", {
      error: "Invalid email/password",
    });
  } catch (err) {
    console.log(err);
    //res.status(500).json({Error:"Internal server error"})
  }
};

export const getUserAndMovies = async (req: Request | any, res: Response) => {
  try {
    //sequelize findAll or findAndCountAll

    //const getAllMovies = await MovieInstance.findAll();

    const getAllUser = await UserInstance.findAndCountAll({
      include: [
        {
          model: MovieInstance,
          as: "movies",
        },
      ],
    });

    return res.status(200).json({
      msg: "You have seccssfully retrieve all movies",
      count: getAllUser.count,
      users: getAllUser.rows,
    });
  } catch (err) {
    console.log(err);
  }
};

export const Logout = async (req: Request | any, res: Response) => {
  res.clearCookie("token");
  res.redirect("/login");
}