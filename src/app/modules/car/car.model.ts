import { model, Schema } from 'mongoose';
import { CarModel, TCar } from './car.interface';

const carSchema = new Schema<TCar, CarModel>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    isElectric: {
      type: Boolean,
      required: true,
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'unavailable'],
      default: 'available',
    },
    features: {
      type: [String],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

carSchema.statics.isCarExistById = async function (id: string) {
  const car = await this.findById(id);
  return !!car; // !!car === car ? true : false
};

carSchema.statics.isCarAvailable = async function (id: string) {
  const car = await this.findById(id);
  return car?.status === 'available';
};

carSchema.statics.isCarDeleted = async function (id: string) {
  const car = await this.findById(id);
  return car?.isDeleted;
};

export const Car = model<TCar, CarModel>('Car', carSchema);
