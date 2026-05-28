// Pagination shapes that every paginated list endpoint should reuse, so the meta object stays identical across resources
// It's important to keep pagination consistent across the app
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}
