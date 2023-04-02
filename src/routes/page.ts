import express, { NextFunction, Response, Request } from "express";
import { auth } from "../middlewares/auth";
import { MovieInstance } from "../model/movieModels";
import { UserInstance } from "../model/userModel";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

//Pages

router.get("/dashboard", auth, async (req: Request | any, res: Response) => {
    try {
        const { id } = req.user;
        const { movie } = await UserInstance.findOne({
        where: { id },
        include: {
            model: MovieInstance,
            as: "movie",
        }}) as unknown as any;
        return res.render("Dashboard", {
             movieList: movie
            })
        } catch (error) {
            console.log(error);
        }
    });

router.get("/register", (req: Request, res: Response, NextFunction) => {
  res.render("Register");
});

router.get("/login", (req: Request, res: Response, NextFunction) => {
  res.render("Login");
});

router.post("/dashboard",auth,async (req: Request | any, res: Response, NextFunction) => {
    try {
      const verified = req.user;
      const id = uuidv4();

      const movieRecord = await MovieInstance.create({
        id,
        ...req.body,
        userId: verified.id,
      });

      return res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }
);


// Get movie owned by a user
router.get('/dashboard', auth, async(req:Request | any, res:Response)=>{
    try{
        const { id } = req.params;
        const {movie} = await UserInstance.findOne({
        where:{id}, 
        include: {
        
        model: MovieInstance,
        as: 'movie',
        },
    }) as unknown as any;

        return res.render("Dashboard",{
        movielist: movie,
    
    });
}catch(error){
    console.log(error);
}
});

router.get('/', async(req:Request | any, res:Response)=>{
    try{
        const movies = await MovieInstance.findAll();
        res.render('Home',{ movieList: movies });
}catch(error){
    console.log(error);
}
});
router.get('/dashboard/:id', auth, async (req:Request | any, res:Response)=>{
  try{
    const { id } = req.params;

    const deleteMovie = await MovieInstance.findOne({where:{id}});

    if (!deleteMovie){
      return res.render("Dashboard", {error: "Movie cannot be found"})
    }

    await deleteMovie.destroy();

    return res.redirect("/dashboard");

  }catch(err){
    console.log(err)
  }
})
    
export default router;
