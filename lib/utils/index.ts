// Database utility functions

import type { PaginationOptions, PaginatedResult, DateRange } from '../db/types';

/**
 * Helper function for pagination
 */
export const paginate = (
  page = 1, 
  limit = 10
): { offset: number; limit: number } => {
  const offset = (page - 1) * limit;
  return { offset, limit };
};

/**
 * Create paginated result object
 */
export const createPaginatedResult = <T>(
  data: T[], 
  total: number, 
  page: number, 
  limit: number
): PaginatedResult<T> => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
};

/**
 * Validate date range
 */
export const validateDateRange = (dateRange: DateRange): boolean => {
  if (!dateRange.from || !dateRange.to) return true;
  return dateRange.from <= dateRange.to;
};

/**
 * Generate random string for codes/tokens
 */
export const generateRandomCode = (length: number = 6): string => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Check if entity is soft deleted
 */
export const isSoftDeleted = (entity: { deletedAt?: Date | null }): boolean => {
  return entity.deletedAt !== null && entity.deletedAt !== undefined;
};

/**
 * Get current timestamp for database operations
 */
export const getCurrentTimestamp = (): Date => {
  return new Date();
};

// @custom:start - Add custom utility functions here
// @custom:end
