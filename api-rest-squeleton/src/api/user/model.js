import { DataTypes, Model } from 'sequelize';
import crypto from 'crypto';
import sequelize from '../../services/sequelize';
import {crypt} from "../../services/passport";
import { password } from '../../services/passport';
const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction, AccountId } = require("@hashgraph/sdk");
import {ServerClient} from "../../services/hedera";
import Titre from "../titre/model";

const roles = ['user', 'admin'];
const DEFAULT_ROLE = 'user';

let credentials =  []
class User extends Model {

  view(full) {
    const view = {};
    let fields = [ 'name'];

    if (full) {
      fields = [...fields, 'CIN','telephone','ville', 'role','createdAt'];
    }

    fields.forEach((field) => {
      view[field] = this[field];
    });

    return view;
  }



}

User.init(
    {
      CIN: {
        type: DataTypes.STRING,
        primaryKey:true,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [6, 255],
        },
      },
      name: {
        type: DataTypes.STRING,
        validate: {
          len: [0, 255],
        },
      },telephone: {
        type: DataTypes.STRING,
        validate: {
          len: [0, 255],
        },
      },ville: {
        type: DataTypes.STRING,
        validate: {
          len: [0, 255],
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: DEFAULT_ROLE,
        validate: {
          isIn: {
            args: [roles],
            msg: 'Le rôle doit être "user" ou "admin"',
          },
        },
      },privateKey: {
        type: DataTypes.STRING,
        validate: {
          len: [0, 255],
        },
      },accountId: {
        type: DataTypes.STRING,
        validate: {
          len: [0, 255],
        },
      }
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true,
      underscored: true,
    }
);

/*
User.beforeSave(async (user, options) => {
  if (!user.picture || user.picture.indexOf('https://gravatar.com') === 0) {
    const hash = crypto.createHash('md5').update(toString(user.email)).digest('hex');
    user.picture = `https://gravatar.com/avatar/${hash}?d=identicon`;
  }

  if (!user.name) {
    user.name = user.email.replace(/^(.+)@.+$/, '$1');
  }

  return toString(user.email);
});
*/
User.beforeCreate(async (user, options) => {
  const newAccountPrivateKey = PrivateKey.generateED25519();
  const newAccountPublicKey = newAccountPrivateKey.publicKey;
  const newAccount = await new AccountCreateTransaction()
      .setKey(newAccountPublicKey)
      .setInitialBalance(Hbar.fromTinybars(1000))
      .execute(ServerClient);
  const getReceipt = await newAccount.getReceipt(ServerClient);
  const newAccountId = getReceipt.accountId;
  user.privateKey = newAccountPrivateKey.toString() // PrivateKey.fromStringED25519()
  user.accountId = newAccountId.toString()
});

export default User;
