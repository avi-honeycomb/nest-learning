export interface ApiResponse<T = Record<string, any>> {
  status: boolean;
  message: string | string[];
  data: T;
}
