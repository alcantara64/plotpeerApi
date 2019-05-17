import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const WalletSchema =  new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    balance:{
        type: Number,
        required: true,
        default : 0,
        min: 0
    },
   
    paymentGateway :{
        type : String,
         required: true
    },
    reference: {
        type: String,
        required:true
    },

},
{
    timestamps : true
});

const WalletModel  = mongoose.model('Wallet', WalletSchema)
export default WalletModel;