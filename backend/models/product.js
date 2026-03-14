const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    subject: { type: String, required: true }, // e.g., Physics, Maths
    board: { type: String, enum: ['NCERT', 'UP Board', 'CBSE', 'ICSE', 'None'] },
    category: { 
        type: String, 
        enum: ['Textbook', 'PYQP', 'Model Paper', 'Test Series'], 
        required: true 
    },
    examType: { type: String, enum: ['Board', 'JEE', 'NEET', 'NDA', 'Polytechnic'] },
    classLevel: { type: String, enum: ['9', '10', '11', '12', 'General'] },
    price: { type: Number, required: true },
    discountPrice: { type: Number }, // For "₹199 instead of ₹499"
    thumbnail: { type: String }, // Image URL
    isDigital: { type: Boolean, default: true }, 
    fileUrl: { type: String }, // Link to PDF/Test if digital
    stock: { type: Number, default: 100 }, // Relevant for physical books
    year: { type: Number }, // Specifically for PYQPs (e.g., 2024)
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
