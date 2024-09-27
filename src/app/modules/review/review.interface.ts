import { Types } from 'mongoose';

export interface TAuthorReview {
  name: string;
  image: string;
  comment: string;
  rating: number;
}

export interface TReview {
  user: Types.ObjectId;
  car: Types.ObjectId;
  rating: number;
  comment: string;
  totalCounts: number;
  counts: [
    {
      rating: 1;
      count: number;
    },
    {
      rating: 2;
      count: number;
    },
    {
      rating: 3;
      count: number;
    },
    {
      rating: 4;
      count: number;
    },
    {
      rating: 5;
      count: number;
    },
  ];
  featured: TAuthorReview[];
}
