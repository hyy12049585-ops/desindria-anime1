/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/** Paginated response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

/** Search query parameters */
export interface SearchParams {
  query: string;
  genre?: string;
  type?: string;
  status?: string;
  year?: number;
  sort?: "rating" | "popularity" | "newest" | "title";
  page?: number;
  limit?: number;
}
