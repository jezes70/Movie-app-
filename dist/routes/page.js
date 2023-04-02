"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const movieModels_1 = require("../model/movieModels");
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const router = express_1.default.Router();
//Pages
router.get("/dashboard", auth_1.auth, async (req, res) => {
    try {
        const { id } = req.user;
        const { movie } = await userModel_1.UserInstance.findOne({
            where: { id },
            include: {
                model: movieModels_1.MovieInstance,
                as: "movie",
            }
        });
        return res.render("Dashboard", {
            movieList: movie
        });
    }
    catch (error) {
        console.log(error);
    }
});
router.get("/register", (req, res, NextFunction) => {
    res.render("Register");
});
router.get("/login", (req, res, NextFunction) => {
    res.render("Login");
});
router.post("/dashboard", auth_1.auth, async (req, res, NextFunction) => {
    try {
        const verified = req.user;
        const id = (0, uuid_1.v4)();
        const movieRecord = await movieModels_1.MovieInstance.create({
            id,
            ...req.body,
            userId: verified.id,
        });
        return res.redirect("/dashboard");
    }
    catch (error) {
        console.log(error);
    }
});
// Get movie owned by a user
router.get('/dashboard', auth_1.auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { movie } = await userModel_1.UserInstance.findOne({
            where: { id },
            include: {
                model: movieModels_1.MovieInstance,
                as: 'movie',
            },
        });
        return res.render("Dashboard", {
            movielist: movie,
        });
    }
    catch (error) {
        console.log(error);
    }
});
router.get('/', async (req, res) => {
    try {
        const movies = await movieModels_1.MovieInstance.findAll();
        res.render('Home', { movieList: movies });
    }
    catch (error) {
        console.log(error);
    }
});
router.get('/dashboard/:id', auth_1.auth, async (req, res) => {
    try {
        const { id } = req.params;
        const deleteMovie = await movieModels_1.MovieInstance.findOne({ where: { id } });
        if (!deleteMovie) {
            return res.render("Dashboard", { error: "Movie cannot be found" });
        }
        await deleteMovie.destroy();
        return res.redirect("/dashboard");
    }
    catch (err) {
        console.log(err);
    }
});
exports.default = router;
