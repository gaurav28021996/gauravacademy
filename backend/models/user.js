const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    targetExam: { 
        type: String, 
        enum: ['JEE', 'NEET', 'NDA', 'UP Board', 'CBSE', 'Polytechnic'],
        default: 'CBSE'
    },
    classLevel: { type: String, enum: ['9', '10', '11', '12', 'Passout'] },
    purchasedMaterials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
