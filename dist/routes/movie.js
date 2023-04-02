"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const movieController_1 = require("../controller/movieController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
/* GET home page. */
router.post('/create', auth_1.auth, movieController_1.createMovie);
router.get('/get-movie', auth_1.auth, movieController_1.getMovies);
router.patch('/patch-movie', auth_1.auth, movieController_1.uptadeMovie);
router.delete('/delete-movie', auth_1.auth, movieController_1.deleteMovie);
router.put('/delete-movie', auth_1.auth, movieController_1.uptadeMovie);
exports.default = router;
