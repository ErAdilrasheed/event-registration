const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    eventName: String,
    eventVenue: String,
    eventTime: String,
    qrCode: String,
    formId: String,
  },
  { timestamps: true }
)

module.exports = mongoose.model('Submission', submissionSchema)
