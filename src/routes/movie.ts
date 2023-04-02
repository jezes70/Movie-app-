import express from 'express';
import {
    // createMovie,
     getMovies,
      uptadeMovie,
     deleteMovie,
     createMovie
    } from '../controller/movieController'
import { auth } from '../middlewares/auth';
const router = express.Router();

/* GET home page. */
router.post('/create',auth, createMovie);
router.get('/get-movie',auth, getMovies);
router.patch('/patch-movie',auth,uptadeMovie);
router.delete('/delete-movie',auth, deleteMovie);
router.put('/delete-movie',auth, uptadeMovie);


export default router;
