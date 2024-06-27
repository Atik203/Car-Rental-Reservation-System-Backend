import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // searching
  search(searchAbleFields: string[]) {
    const searchTerm = this.query?.searchTerm;
    const searchRegex = new RegExp(searchTerm as string, 'i');

    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchAbleFields.map(
          (key) =>
            ({
              [key]: searchRegex,
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  // filtering

  filter() {
    const queryObject = { ...this.query };
    const excludedFields = ['searchTerm', 'page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((field) => {
      if (queryObject[field]) {
        delete queryObject[field];
      }
    });

    this.modelQuery = this.modelQuery.find(queryObject as FilterQuery<T>);

    return this;
  }

  // sorting

  sort() {
    const sort =
      (this.query.sort as string)?.split(',').join(' ') || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sort as string);
    return this;
  }

  // pagination

  paginate() {
    const page = this.query?.page ? parseInt(this.query.page as string) : 1;
    const limit = this.query?.limit ? parseInt(this.query.limit as string) : 1;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // fields limiting

  fields() {
    const fields =
      (this.query.fields as string)?.split(',').join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
}

export default QueryBuilder;
