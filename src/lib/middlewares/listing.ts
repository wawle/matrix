import { NextRequest } from "next/server";

export const listing = async <TData>(
  model: any,
  req: NextRequest,
  populate?: any
): Promise<{
  data: TData[];
  total: number;
  pageCount: number;
  pagination: {
    next?: {
      page: number;
      limit: number;
    };
  };
}> => {
  const {
    nextUrl: { search },
  } = req;
  const urlSearchParams = new URLSearchParams(search);
  const reqQuery = Object.fromEntries(urlSearchParams.entries());

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "per_page", "q"];
  let filteredQuery = { ...reqQuery };
  // Loop over removeFields and delete them from filteredQuery
  removeFields.forEach((param) => delete filteredQuery[param]);
  // Create query string

  let queryObj: any = {};

  // Handling operators ($gt, $gte, etc)
  for (const [key, value] of Object.entries(filteredQuery)) {
    const match = key.match(/(.+)\[(gt|gte|lt|lte|in|like)\]/);
    if (match) {
      const [, field, operator] = match;

      if (!queryObj[field]) queryObj[field] = {};

      if (operator === "in") {
        queryObj[field][`$${operator}`] = value.split(",");
      } else if (operator === "like") {
        queryObj[field] = { $regex: value, $options: "i" };
      } else {
        queryObj[field][`$${operator}`] = value;
      }
    } else {
      queryObj[key] = value;
    }
  }

  // Finding resource
  let query = model.find(queryObj);

  // Select Fields
  if (reqQuery?.select) {
    const fields = reqQuery?.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (reqQuery?.sort) {
    query = query.sort(reqQuery.sort);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(reqQuery?.page, 10) + 1 || 1;
  const limit = parseInt(reqQuery?.per_page, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const total = (await model.countDocuments(queryObj)) as number;
  // Number of items per page
  const pageCount = Math.ceil(total / limit);

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    if (typeof populate === "string") {
      query = query.populate(populate);
    } else {
      populate.map((item: any) => (query = query.populate(item)));
    }
  }

  // Executing query
  const results = await query;

  // Pagination result
  const pagination: {
    next?: {
      page: number;
      limit: number;
    };
    prev?: {
      page: number;
      limit: number;
    };
  } = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  return {
    pageCount,
    total,
    pagination,
    data: results.map((result: any) => result.toObject({ getters: true })),
  };
};
