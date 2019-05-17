import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ProjectSchema = new Schema({
   description: {
    type: String,
     required: true,
            }, 
  name: {
  type: String,
  required: true,
  },
  address:{
    type: String,
    required: true,
    },
   city: {
        type: String,
        required: true
        },
   state: {
            type: String,
            required: true,
     },
      country: {
        type: String,
        required: true,
    },
   lat: {
        type: String,
        },
     lng: {
            type: String,
            required: true,
     },
     project_type: {
        type: String,
        required: true,
 },
 project_yied: {
    type: Number,
    required: true,
},
project_term: {
    type: String,
    required: true,
},
min_amount: {
  type: Number,
  required: true,
},
amountFunded: {
  type: Number,
  required: true,
  default:0
},
investmentRequired: {
  type: Number,
  required: true,
},
currentInvestors: {
  type: Number,

},
marketInfo: {
  type: String,
  
},
investors: [{
  type: Schema.Types.ObjectId, ref: 'User',
}],
developmentInfo:{
  type: String,
},
exitStrategy: {
  type: String,
  
},
riskMitigation: {
  type: String,
  
},
images: {
  type: String,
  required:true
},
video:{
  type: String,
}

  // media: { type: Schema.Types.ObjectId, ref: 'Media' },
  // likes : [{ type: Schema.Types.ObjectId, ref: 'Like' }],
  // comments : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  // flags : [{ type: Schema.Types.ObjectId, ref: 'Flag' }]
   //_user: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

const ProjectModel = mongoose.model('Project', ProjectSchema);

export default ProjectModel;