import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Message = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    subject: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'replied'],
       default: 'unread',
    },

},
{
    timestamps: true,
  }
  );

  const MessageModel = mongoose.model('Message', Message);
  export default MessageModel;