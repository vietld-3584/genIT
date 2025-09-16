// Common types for the database layer

// Base entity types
export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeletableEntity extends BaseEntity {
  deletedAt?: Date;
}

// Query result types
export interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter types
export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface SortOptions {
  field: string;
  direction: 'ASC' | 'DESC';
}

// @custom:start - Add custom types and interfaces here
// @custom:end
