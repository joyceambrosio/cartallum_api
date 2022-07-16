class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //1A) Build Query
    const queryObj = { ...this.queryString };
    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields',
      'search',
      'searchValue',
    ];
    excludedFields.forEach(element => delete queryObj[element]);

    //hack para trazer o trem

    if (queryObj._id) {
      if (queryObj._id.in) queryObj._id.in = queryObj._id.in.split(',');
    }

    //1A) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|in)\b/g,
      match => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
    //const query = Tour.find(JSON.parse(queryStr));
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-_id');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
