import { success, notFound } from '../../services/response/';
import Titre from './model';
import User from "../user/model";
import {ServerClient} from '../../services/hedera/';
import { myAccountId,myPrivateKey } from '../../config'
const {
    AccountId,
    PrivateKey,
    Client,
    Hbar,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    TokenMintTransaction,
    TransferTransaction,
    AccountBalanceQuery,
    TokenAssociateTransaction,
    AccountCreateTransaction,
    CustomRoyaltyFee,
    TokenInfoQuery,
    TokenUpdateTransaction,
    TokenFeeScheduleUpdateTransaction,
} = require("@hashgraph/sdk");
require("dotenv").config();




export const create = async ({ bodymen: { body } ,user}, res, next) => {
    try {
        const titre = await  Titre.create({ ...body });
        await titre.save()
        success(res, 201)({titre: titre.view(true) });
    } catch (err) {
            console.log('Une erreur est survenue dans la création du Titre verifier que les informations sont correctes ', err);
            next(err);
    }
};


export const validate = async ({ bodymen: { body } , params}, res, next) => {
    try {
        const user = await User.findByPk(body.CIN)
        const admin = await User.findByPk(body.CIN_admin)
        const titre = await Titre.findByPk(params.id)
        const userAccountId =  await AccountId.fromString(user.accountId)
        const adminAccountId =  await AccountId.fromString(admin.accountId)
        const accountId =  await AccountId.fromString(myAccountId)
        const adminPrivateKey = PrivateKey.fromStringED25519(admin.privateKey.toString());
        const ownerPrivateKey = PrivateKey.fromStringED25519(user.privateKey.toString());
        const privateKey = PrivateKey.fromStringECDSA(myPrivateKey);
        /* phase de payement */
        const sendHbar = await new TransferTransaction()
            .addHbarTransfer(userAccountId, Hbar.fromTinybars(-50))
            .addHbarTransfer(adminAccountId, Hbar.fromTinybars(50))
            .execute(ServerClient);

        const royaltyFee = new CustomRoyaltyFee()
            .setNumerator(1)
            .setDenominator(10)
            .setFeeCollectorAccountId(adminAccountId);

        const customFee = [royaltyFee];
        /*Phase de tokenisation */
        const createTokenTransaction = await new TokenCreateTransaction()
            .setTokenName("Titre Token for "+user.name)
            .setTokenSymbol("NFTitre")
            .setDecimals(0)
            .setInitialSupply(0)
            .setTreasuryAccountId(accountId)
            .setTokenType(TokenType.NonFungibleUnique)
            .setSupplyType(TokenSupplyType.Finite)
            .setCustomFees(customFee)
            .setTokenMemo(titre.view(true).toString())
            .setMaxSupply(250)
            .setSupplyKey(privateKey)
            .setFeeScheduleKey(privateKey)
            .setMaxTransactionFee(new Hbar(100000))
            .freezeWith(ServerClient);

        /*phase de signature */

        //Sign the transaction with the treasury key
        const nftCreateTxSign = await createTokenTransaction.sign(ownerPrivateKey);

            //Submit the transaction to a Hedera network
        const nftCreateSubmit = await nftCreateTxSign.execute(ServerClient);

        //Get the transaction receipt
        const nftCreateRx = await nftCreateSubmit.getReceipt(ServerClient);
        const tokenId = nftCreateRx.tokenId;
        console.log("le token est "+tokenId)
        //Create the associate transaction and sign with Alice's key
        const associateOwnerTx = await new TokenAssociateTransaction()
            .setAccountId(userAccountId)
            .setTokenIds([tokenId])
            .freezeWith(ServerClient)
            .sign(ownerPrivateKey);

        //Submit the transaction to a Hedera network
        const associateOwnerTxSubmit = await associateOwnerTx.execute(ServerClient);

        //Get the transaction receipt
        const associateOwnerRx = await associateOwnerTxSubmit.getReceipt(ServerClient);

        //Confirm the transaction was successful
        console.log(`- NFT association with Owner's account: ${associateOwnerRx.status}\n`);
        console.log("phase de signature achevé ")
        success(res, 201)({ message: "Le titre a été tokenisé avec succès", tokenId: tokenId });
        console.log("phase de tokenisation achevé ")
        /*tokenisation*/

    } catch (err) {
        console.log('Une erreur est survenue dans tokenisation du titre:', err);
        next(err);
    }
};

export const show = async ({ params }, res, next) => {
    try {
        const titre = await Titre.findByPk(params.id);
        if (!titre) {
            notFound(res)();
        } else {
            success(res)(titre.view());
        }
    } catch (error) {
        next(error);
    }
};

export const index = async ({}, res, next) => {
    try {
        const count = await Titre.count();
        const titres = await Titre.findAll();
        const response = {
            rows: titres.map((titre) => titre.view()),
            count,
        };
        success(res)(response);
    } catch (error) {
        next(error);
    }
};

