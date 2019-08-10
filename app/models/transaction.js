/**
 * THIS CAPTURES ALL WALLET TRANSACTIONS
 */
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TransactionStatus = Object.freeze({
  PENDING: 'Pending',
  SETTLED: 'Settled',
  SUSPENDED: 'Suspended',
  TERMINATED: 'Terminated'
})

const TransactionCurrency = Object.freeze({
  EUR: 'EUR',
  GBP: 'GBP',
  USG: 'USG'
})

const TransactionType = Object.freeze({
  FUND: 'Fund',
  WITHDRAW: 'Withdraw'
})

const TransactionSchema = new Schema(
  {
    user: { type: Schema.ObjectId, ref: 'Users', required: true },
    type: {
      type: Schema.Types.String,
      enum: Object.values(TransactionType),
      default: TransactionType.FUND,
      required: true
    },
    amount: { type: Schema.Types.Number },
    currency: {
      type: Schema.Types.String,
      enum: Object.values(TransactionCurrency),
      default: TransactionCurrency.GBP,
      required: true
    },
    transactionRef: { type: Schema.Types.String },
    transactionId: { type: Schema.Types.String },
    orderRef: { type: Schema.Types.String },
    status: {
      type: Schema.Types.String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
      required: true
    },
  },
  { timestamps: true }, { toObject: { virtuals: true }, toJSON: { virtuals: true } }
)

TransactionSchema.statics.Status = TransactionStatus
TransactionSchema.statics.Type = TransactionType
TransactionSchema.statics.Currencies = TransactionCurrency

const transaction = mongoose.model('Transactions', TransactionSchema)
module.exports = transaction
