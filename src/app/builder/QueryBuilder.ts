import { Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filterByCarId(): QueryBuilder<T> {
    const { carId } = this.query;
    if (carId) {
      this.modelQuery = this.modelQuery.find({ car: carId });
    }
    return this;
  }

  filterByCarIdAndDate(): QueryBuilder<T> {
    const { carId, date } = this.query;
    if (carId && date) {
      this.modelQuery = this.modelQuery.find({ car: carId, date });
    }
    return this;
  }
}

export default QueryBuilder;
