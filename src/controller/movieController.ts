import { Request, Response } from 'express';
import { where } from 'sequelize/types/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { MovieInstance } from '../model/movieModels';
import { updateMovieSchema, options } from '../utilis/utilis';

export const createMovie = async (req:Request | any, res:Response)=>{
  try{
    const verified = req.user;
    const id = uuidv4();
    //const { description, completed} = req.body;

    const movie = await MovieInstance.create({

        id,
        ...req.body,
        userId: verified.id
    })
       
    return res.status(201).json({
        msg: 'movie created successfully',
        movie
    })


  }catch(err){

  }
}

export const getMovies = async (req:Request | any, res:Response)=>{

try{
      //  /movie/get-movie?limit=10&offset=1
      const limit = req.query?.limit as number | undefined;
      const offset = req.query?.offset as number | undefined;
      //sequelize findAll or findAndCountAll

      //const getAllMovies = await MovieInstance.findAll();

   const getAllMovies = await MovieInstance.findAndCountAll(
      {
        limit:limit,
        offset:offset
      }

   );

   return res.status(200).json({
       msg: 'you have seccssfully retrieve all movies',
     count: getAllMovies.count,
       movies: getAllMovies.rows,
    })
}catch(err){
  console.log(err)
}
}

export const uptadeMovie = async (req:Request | any, res:Response)=>{
  try{
       //movies/update-movie/id

  const { id } = req.params.id;
  const {description, title, image, price} = req.body;

     //validate with joi or zod
  const validationResut = updateMovieSchema.validate (req.body, options);

  if (validationResut.error){
      return res.status(400).json({Error:validationResut.error.details[0].message})
  }

  const updateMovie = await MovieInstance.findOne({where:{id}});

  if (!updateMovie){
    return res.status(400).json({error:"cannot find existing Movie"})
  }
  
  const updatedRecord = await updateMovie.update({
    description, title, image, price

  })

  return res.status(200).json({
    msg: "Movie updated successfully",
    

  })

  return res.status(200).json({
    msg: "you have succssfully updated your movie",
    updatedRecord
  })

  }catch(err){
    console.log(err)
  }
}

export const deleteMovie = async (req:Request | any, res:Response)=>{
  try{
    const { id } = req.params;

    const deleteMovie = await MovieInstance.findOne({where:{id}});

    if (!deleteMovie){
      return res.status(400).json({error:"cannot find existing Movie"})
    }

    await deleteMovie.destroy();

    return res.status(200).json({
      msg: "Movie deleted successfully",
    })

  }catch(err){
    console.log(err)
  }
}