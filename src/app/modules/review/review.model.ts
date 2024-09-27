import { model, Schema } from 'mongoose';
import { TReview } from './review.interface';

// Define the review schema
export const reviewSchema = new Schema<TReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    totalCounts: {
      type: Number,
      default: 0,
    },
    counts: {
      type: [
        {
          rating: { type: Number },
          count: { type: Number },
        },
      ],
      default: [
        { rating: 1, count: 0 },
        { rating: 2, count: 0 },
        { rating: 3, count: 0 },
        { rating: 4, count: 0 },
        { rating: 5, count: 0 },
      ],
    },
    featured: {
      type: [
        {
          name: { type: String },
          image: { type: String },
          comment: { type: String },
          rating: { type: Number },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save hook to manage featured reviews
reviewSchema.pre('save', async function (next) {
  // Logic to update totalCounts and counts
  this.totalCounts += 1;
  this.counts[this.rating - 1].count += 1;

  // Logic to manage featured reviews
  if (this.featured.length < 5) {
    const user = await model('User').findById(this.user);
    this.featured.push({
      name: user.name,
      image: user.image,
      comment: this.comment,
      rating: this.rating,
    });
  } else {
    // Replace the oldest featured review if there are already 5
    this.featured.shift();
    const user = await model('User').findById(this.user);
    this.featured.push({
      name: user.name,
      image: user.image,
      comment: this.comment,
      rating: this.rating,
    });
  }
  next();
});

export const Review = model<TReview>('Review', reviewSchema);
