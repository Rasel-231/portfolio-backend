
import mongoose, { Schema } from 'mongoose';

const PortfolioSchema = new Schema({
    category: String,
    content: String,
    tags: [String],
});


PortfolioSchema.index({ content: 'text', tags: 'text' });

export const PortfolioData = mongoose.model('PortfolioData', PortfolioSchema);