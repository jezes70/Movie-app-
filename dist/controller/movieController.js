"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMovie = exports.uptadeMovie = exports.getMovies = exports.createMovie = void 0;
const uuid_1 = require("uuid");
const movieModels_1 = require("../model/movieModels");
const utilis_1 = require("../utilis/utilis");
const createMovie = async (req, res) => {
    try {
        const verified = req.user;
        const id = (0, uuid_1.v4)();
        //const { description, completed} = req.body;
        const movie = await movieModels_1.MovieInstance.create({
            id,
            ...req.body,
            userId: verified.id
        });
        return res.status(201).json({
            msg: 'movie created successfully',
            movie
        });
    }
    catch (err) {
    }
};
exports.createMovie = createMovie;
const getMovies = async (req, res) => {
    try {
        //  /movie/get-movie?limit=10&offset=1
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        //sequelize findAll or findAndCountAll
        //const getAllMovies = await MovieInstance.findAll();
        const getAllMovies = await movieModels_1.MovieInstance.findAndCountAll({
            limit: limit,
            offset: offset
        });
        return res.status(200).json({
            msg: 'you have seccssfully retrieve all movies',
            count: getAllMovies.count,
            movies: getAllMovies.rows,
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.getMovies = getMovies;
const uptadeMovie = async (req, res) => {
    try {
        //movies/update-movie/id
        const { id } = req.params.id;
        const { description, title, image, price } = req.body;
        //validate with joi or zod
        const validationResut = utilis_1.updateMovieSchema.validate(req.body, utilis_1.options);
        if (validationResut.error) {
            return res.status(400).json({ Error: validationResut.error.details[0].message });
        }
        const updateMovie = await movieModels_1.MovieInstance.findOne({ where: { id } });
        if (!updateMovie) {
            return res.status(400).json({ error: "cannot find existing Movie" });
        }
        const updatedRecord = await updateMovie.update({
            description, title, image, price
        });
        return res.status(200).json({
            msg: "Movie updated successfully",
        });
        return res.status(200).json({
            msg: "you have succssfully updated your movie",
            updatedRecord
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.uptadeMovie = uptadeMovie;
const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteMovie = await movieModels_1.MovieInstance.findOne({ where: { id } });
        if (!deleteMovie) {
            return res.status(400).json({ error: "cannot find existing Movie" });
        }
        await deleteMovie.destroy();
        return res.status(200).json({
            msg: "Movie deleted successfully",
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.deleteMovie = deleteMovie;
