import BaseController from './base.controller'
import User from '../models/user'
import Transaction from '../models/transaction'
import Wallet from '../models/wallet'
import HttpStatus from '../lib/status'
import PaymentProcessor from '../lib/payments'
import Constants from '../config/constants';
import crypto from 'crypto'


class WalletController extends BaseController {

    /**
     * Add Bank Account
     * @description Allow users add a new bank account to their list of accounts
     * @return {object} wallet
     */
    async getWallet(req, res, next) {
        try {
            const userId = req.currentUser._id
            const wallet = await Wallet.findOne({user : userId}).populate("transactions", "amount orderRef transactionId transactionRef status currency type createdAt")
            if (!wallet) {
                const err = new Error('Wallet not found');
                err.status = HttpStatus.BAD_REQUEST;
                return next(err);
            }
    
            return res.status(HttpStatus.OK).json({
                ok : true,
                status: HttpStatus.OK,
                message: 'Wallet fetched successfully',
                data: {wallet}
            })
    
        } catch (error) {
            console.log("error > ", error)
            const err = new Error('Error fetching user wallet')
            err.status = HttpStatus.SERVER_ERROR
            err.ok = false
            next(err)
        }
    }

    /**
        * Fund Wallet
        * @description Allow user fund wallet
        * @param {object} wallet        user naira wallet
    */
    async fundWallet(req, res, next) {
        try {
            const userId = req.currentUser._id
            var orderreference = await crypto.randomBytes(20)
            var paymentRequestBody = [{
                currencyiso3a : Constants.currency,
                requesttypedescriptions : Constants.paymentRequestType,
                sitereference : Constants.paymentSiteReference,
                baseamount : req.body.amount,
                orderreference : orderreference.toString('hex'),
                accounttypedescription : Constants.paymentAccountType,
                cachetoken : req.body.cachetoken
            }]
            var transaction = new Transaction() 
            const wallet = await Wallet.findOne({user : userId})

            let paymentProcessor = new PaymentProcessor(Constants.paymentUrl, {
                username: Constants.paymentUsername,
                password: Constants.paymentPass
            })

            paymentProcessor.addHeaders([{key : "Content-type", value : "application/json"},{key : "Accept", value : "application/json"}])
            const paymentResponse = await paymentProcessor.callStapi(paymentRequestBody, "POST")
            const responseBody = paymentResponse.data

            console.log("responseBody >> ", responseBody)

            paymentProcessor.handleStapiErrors(res, responseBody)

            transaction.user = userId
            transaction.transactionRef = responseBody.requestreference
            transaction.transactionId = responseBody.response[0].tid
            transaction.orderRef = responseBody.response[0].orderreference
            transaction.amount = paymentRequestBody[0].baseamount
            transaction.type = Transaction.Type.FUND
            transaction.status = (responseBody.response[0].settlestatus == "0" || responseBody.response[0].settlestatus == "1" || responseBody.response[0].settlestatus == "10")? Transaction.Status.PENDING : (responseBody.response[0].settlestatus == "100") ? Transaction.Status.SETTLED : (responseBody.response[0].settlestatus == "2") ? Transaction.Status.SUSPENDED : Transaction.Status.TERMINATED
            await transaction.save()

            if (responseBody.response[0].baseamount != paymentRequestBody[0].baseamount) { 
                return res.status(HttpStatus.BAD_REQUEST).json({ 
                    ok: false,
                    message: 'Fund amount entered is different from actual debit amount',
                    error: "Incomplete Funding",
                    data: {
                        amount : paymentRequestBody[0].baseamount,
                        actualDebit : responseBody.response[0].baseamount
                    }
                })
            }

            wallet.balance += parseInt(paymentRequestBody[0].baseamount)
            var walletTransactions = wallet.transactions
            walletTransactions.push(transaction._id)
            wallet.transactions = walletTransactions
            await wallet.save()

            return res.status(HttpStatus.OK).json({ 
                ok: true,
                status: HttpStatus.OK, 
                message: 'Wallet funded successfully!', 
                data: {wallet} 
            });

        } catch (error) {
            console.log("error > ", error)
            const err = {
                ok: false,
                status: HttpStatus.SERVER_ERROR,
                message: 'Could not fund wallet!'
            }
            next(err)
        }
    }

    /**
        * Withdraw Wallet
        * @description Allow user withdraw from their wallet
        * @param {object} wallet        user naira wallet
    */
    async withdraw(req, res, next) {
        try {
            const userId = req.currentUser._id
            var orderreference = await crypto.randomBytes(20)
            var paymentRequestBody = [{
                currencyiso3a : Constants.currency,
                requesttypedescriptions : Constants.paymentRefundType,
                sitereference : Constants.paymentSiteReference,
                baseamount : req.body.amount,
                orderreference : orderreference.toString('hex'),
                accounttypedescription : Constants.paymentRefundAccountType,
                cachetoken : req.body.cachetoken
            }]
            var transaction = new Transaction() 
            const wallet = await Wallet.findOne({user : userId})

            if (parseInt(paymentRequestBody[0].baseamount) > parseInt(wallet.balance)) {
                return next({
                    http: HttpStatus.PRECONDITION_FAILED,
                    status: 'failed',
                    message: 'Insufficient wallet balance!'
                })
            }
            console.log("requestBody > ", paymentRequestBody)

            let paymentProcessor = new PaymentProcessor(Constants.paymentUrl, {
                username: Constants.paymentUsername,
                password: Constants.paymentPass
            })

            paymentProcessor.addHeaders([{key : "Content-type", value : "application/json"},{key : "Accept", value : "application/json"}])
            const paymentResponse = await paymentProcessor.callStapi(paymentRequestBody, "POST")
            const responseBody = paymentResponse.data

            paymentProcessor.handleStapiErrors(res, responseBody)

            console.log("paymentResponse > ", paymentResponse.data)

            transaction.user = userId
            transaction.transactionRef = responseBody.requestreference
            transaction.transactionId = responseBody.response[0].tid
            transaction.orderRef = responseBody.response[0].orderreference
            transaction.amount = paymentRequestBody[0].baseamount
            transaction.type = Transaction.Type.WITHDRAW
            transaction.status = (responseBody.response[0].settlestatus == "0" || responseBody.response[0].settlestatus == "1" || responseBody.response[0].settlestatus == "10")? Transaction.Status.PENDING : (responseBody.response[0].settlestatus == "100") ? Transaction.Status.SETTLED : (responseBody.response[0].settlestatus == "2") ? Transaction.Status.SUSPENDED : Transaction.Status.TERMINATED
            await transaction.save()

            if (responseBody.response[0].baseamount != paymentRequestBody[0].baseamount) { 
                return res.status(HttpStatus.BAD_REQUEST).json({ 
                    ok: false,
                    message: 'Fund amount entered is different from actual debit amount',
                    error: "Incomplete Funding",
                    data: {
                        amount : paymentRequestBody[0].baseamount,
                        actualDebit : responseBody.response[0].baseamount
                    }
                })
            }

            wallet.balance -= parseInt(paymentRequestBody[0].baseamount)
            var walletTransactions = wallet.transactions
            walletTransactions.push(transaction._id)
            wallet.transactions = walletTransactions
            await wallet.save()

            return res.status(HttpStatus.OK).json({ 
                ok: true,
                status: HttpStatus.OK, 
                message: 'Wallet funded successfully!', 
                data: {wallet} 
            });

        } catch (error) {
            console.log("error > ", error)
            const err = {
                ok: false,
                status: HttpStatus.SERVER_ERROR,
                message: 'Could not fund wallet!'
            }
            next(err)
        }
    }


}

export default new WalletController();
