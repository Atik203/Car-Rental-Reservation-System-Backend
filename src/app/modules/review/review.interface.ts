import { Types } from 'mongoose';

export interface TReview {
  user: Types.ObjectId;
  car: Types.ObjectId;
  rating: number;
  comment: string;
}
