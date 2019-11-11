import BaseController from './base.controller';
import User from '../models/user';
import HttpStatus from '../lib/status'
import Transaction from '../models/transaction'


class TransactionController extends BaseController {
  /**
     * Get User Transactions
     * @description Get all user transactions
     * @return {object} user
     */
  async one(req, res, next) {
    try {
        const transactionId = req.params.id
        const transaction = await Transaction.findOne({ _id: transactionId })

        return res.status(HttpStatus.OK).json({
          status: 'success',
          message: 'Transaction fetched successfully',
          data: transaction
        })

    } catch (error) {
        console.log("error > ", error)
        const err = new Error('Error fetching transaction')
        err.status = HttpStatus.SERVER_ERROR
        next(err)
    }
  }
    
  /**
    * Get transactions
    * @description Get all transactions
    * @param {string} type
    * @param {string} to
    * @param {string} from
    * @param {string} status
    * @return {object[]} transactions
    */
  async all(req, res, next) {
    try {

      const {type, to, from, status} = req.query
      const query = { }

      // build up query
      if (status) query.status = Transaction.Status[status.toUpperCase()]
      if (type) query.type = Transaction.Type[type.toUpperCase()]
      if (from && to == null) query.createdAt = { $gte: from }
      if (to && from == null) query.createdAt = { $lt: to }
      if (from && to) query.createdAt = { $lt: to, $gte: from }

      const transactions = await Transaction.find(query).populate('user').sort({ createdAt: -1 })
      

        return res.status(HttpStatus.OK).json({
            status: 'success',
            message: 'All transactions fetched successfully',
            data: {transactions}
        })

    } catch (error) {
        console.log("error > ", error)
        const err = new Error('Error fetching transactions')
        err.status = HttpStatus.SERVER_ERROR
        next(err)
    }
  }

    /**
     * Get User Transactions
     * @description Get all user transactions
     * @return {object} user
     */
    async self(req, res, next) {
        try {
            const userId = req.currentUser._id
            const transactions = await Transaction.find({ user: userId })

            return res.status(HttpStatus.OK).json({
            status: 'success',
            message: 'User transactions fetched successfully',
            data: transactions
            })

        } catch (error) {
            console.log("error > ", error)
            const err = new Error('Error fetching user transactions')
            err.status = HttpStatus.SERVER_ERROR
            next(err)
        }
    }
}

export default new TransactionController();
