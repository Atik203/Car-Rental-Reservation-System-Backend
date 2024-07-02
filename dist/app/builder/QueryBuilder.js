"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    filterByCarId() {
        const { carId } = this.query;
        if (carId) {
            this.modelQuery = this.modelQuery.find({ car: carId });
        }
        return this;
    }
    filterByCarIdAndDate() {
        const { carId, date } = this.query;
        if (carId && date) {
            this.modelQuery = this.modelQuery.find({ car: carId, date });
        }
        return this;
    }
}
exports.default = QueryBuilder;
