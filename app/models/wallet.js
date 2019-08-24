
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Wallet = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Users', unique: true },
  balance: { type: Schema.Types.Number, required: true, default: 0 },
  transactions: [{ type: Schema.Types.ObjectId, ref: 'Transactions' }],
}, { timestamps: true }, { toObject: { virtuals: true }, toJSON: { virtuals: true } })

const WalletModel = mongoose.model('Wallet', Wallet);
export default WalletModel;