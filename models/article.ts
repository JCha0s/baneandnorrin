import mongoose, { Schema, model, models } from 'mongoose';

const ArticleSchema = new Schema({
  title: { type: String, required: true },       // Placeholder TITLE
  category: { type: String, required: true },    // Placeholder Category
  bio: { type: String, required: true },         // Placeholder bio
  author: { type: String, required: true },      // Placeholder Author
  content: { type: String, required: true },     // The full article body
  imageUrl: { type: String },                    // Link to the image
  publishedAt: { type: Date, default: Date.now },// The static date
});

// This line is crucial: It prevents Next.js from trying to create 
// a new model every time the page reloads.
const Article = models.Article || model('Article', ArticleSchema);

export default Article;