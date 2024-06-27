"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    // searching
    search(searchAbleFields) {
        var _a;
        const searchTerm = (_a = this.query) === null || _a === void 0 ? void 0 : _a.searchTerm;
        const searchRegex = new RegExp(searchTerm, 'i');
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchAbleFields.map((key) => ({
                    [key]: searchRegex,
                })),
            });
        }
        return this;
    }
    // filtering
    filter() {
        const queryObject = Object.assign({}, this.query);
        const excludedFields = ['searchTerm', 'page', 'limit', 'sort', 'fields'];
        excludedFields.forEach((field) => {
            if (queryObject[field]) {
                delete queryObject[field];
            }
        });
        this.modelQuery = this.modelQuery.find(queryObject);
        return this;
    }
    // sorting
    sort() {
        var _a;
        const sort = ((_a = this.query.sort) === null || _a === void 0 ? void 0 : _a.split(',').join(' ')) || '-createdAt';
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    // pagination
    paginate() {
        var _a, _b;
        const page = ((_a = this.query) === null || _a === void 0 ? void 0 : _a.page) ? parseInt(this.query.page) : 1;
        const limit = ((_b = this.query) === null || _b === void 0 ? void 0 : _b.limit) ? parseInt(this.query.limit) : 1;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    // fields limiting
    fields() {
        var _a;
        const fields = ((_a = this.query.fields) === null || _a === void 0 ? void 0 : _a.split(',').join(' ')) || '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
}
exports.default = QueryBuilder;
