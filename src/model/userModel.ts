import { DataTypes,Model } from "sequelize";
import db from '../config/database.config';
import { MovieInstance } from "./movieModels";

export interface UserAtrributes {
    id: string;
    email: string;
    fullName: string;
    userName: string;
    password: string;
    
}


export class UserInstance extends Model <UserAtrributes>{}

    UserInstance.init({
        id : {
            type: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize: db,
        tableName: 'user'
    })

    UserInstance.hasMany(MovieInstance, {foreignKey: 'userId', as: 'movie'});
    MovieInstance.belongsTo(UserInstance, {foreignKey: 'userId', as: 'user'});