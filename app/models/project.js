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
  address: {
    type: String,
    required: true,
    },
   city: {
        type: String,
        required: true,
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
     projectType: {
        type: String,
        required: true,
 },
 projectYied: {
    type: Number,
    required: true,
},
projectTerm: {
    type: String,
    required: true,
},
minAmount: {
  type: Number,
  required: true,
},
amountFunded: {
  type: Number,
  required: true,
  default: 0,
},
investmentRequired: {
  type: Number,
  required: true,
},
marketInfo: {
  type: String,

},
investors: [{
  type: Schema.Types.ObjectId, ref: 'User',
}],
developmentInfo: {
  type: String,
},
exitStrategy: {
  type: String,

},
riskMitigation: {
  type: String,

},
images: [{
  type: String,
  required: true,
}],
video: {
  type: String,
},
}, {
  timestamps: true,
});

const ProjectModel = mongoose.model('Project', ProjectSchema);

export default ProjectModel;