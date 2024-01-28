import {master, token} from "../../services/passport";
import {middleware as body} from "bodymen";
import {create, validate,show,index} from "./controller";
import {Router} from "express";
import User from "../user/model";
import Titre from "./model";

const router = new Router();

const {CIN_admin,CIN,coordonnee,adresse,localisation,superficie,numeroParcelle,droitDeVendre,droitDeLouer,droitDeLeguer} = Titre.getAttributes()

router.post('/',
    body({CIN_admin,CIN,coordonnee,adresse,localisation,superficie,numeroParcelle,droitDeVendre,droitDeLouer,droitDeLeguer}),
    create);


router.put('/validate/:id',
    body({CIN,CIN_admin}),
    validate);

router.get('/:id',
    show);

router.get('/',
    token(),
    index);

export default router;