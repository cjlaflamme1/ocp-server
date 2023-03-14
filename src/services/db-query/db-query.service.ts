import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';

export class Pagination {
  skip: number;
  take: number;
}

export class Filter {
  name: string;
  value: number | string | boolean | null;
}

export class OrderBy {
  column: string;
  order: string;
}

export class QueryDetails {
  pagination?: Pagination | null | undefined;
  filters?: Filter[] | null | undefined;
  orderBy?: OrderBy | null | undefined;
}

@Injectable()
export class DbQueryService {
  queryBuilder = (query: QueryDetails) => {
    const { pagination, filters, orderBy } = query;
    const baseQuery = {};

    if (pagination) {
      baseQuery['skip'] = pagination.skip;
      baseQuery['take'] = pagination.take;
    }

    if (orderBy) {
      baseQuery['order'] = {};
      baseQuery['order'][orderBy.column] = orderBy.order;
    }

    if (filters) {
      baseQuery['where'] = {};
      filters.forEach((filter) => {
        const strType = typeof filter.value === 'string';
        baseQuery['where'][filter.name] = strType
          ? Like(`%${filter.value}%`)
          : filter.value;
      });
    }

    return baseQuery;
  };
}
