import { DataTypes, Model } from 'sequelize';
import sequelize from '../../services/sequelize';

class Titre extends Model {


    view() {
        const view = {
            CIN: this.CIN,
            coordonnee: this.coordonnee,
            adresse: this.adresse,
            localisation: this.localisation,
            superficie: this.superficie,
            numeroParcelle: this.numeroParcelle,
            droitDeVendre: this.droitDeVendre,
            droitDeLouer: this.droitDeLouer,
            droitDeLeguer: this.droitDeLeguer,
        };
        return view;
    }
    static associate(models) {
        Titre.belongsTo(models.User, { foreignKey: 'CIN', as: 'user' });
        Titre.belongsTo(models.User, { foreignKey: 'CIN_admin', as: 'user_admin' });
    }
}


Titre.init(
    {
        coordonnee: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        adresse: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        localisation: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        superficie: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        numeroParcelle: {
            type: DataTypes.STRING,
            primaryKey:true,
            allowNull: false,
            unique: true,
        },
        droitDeVendre: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        droitDeLouer: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        droitDeLeguer: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: 'Titre',
        timestamps: true,
        underscored: true,
    }
);


export default Titre;