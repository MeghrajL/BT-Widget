import { api } from '../../api';

export type User = {
  id: number;
  name: string;
};

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    fetchOne: build.query<User, string>({
      query: id => `/users/${id}`,
    }),
    fetchComments: build.query({
      query: id => `/posts/${id}`,
    }),
  }),

  overrideExisting: true,
});

export const { useLazyFetchOneQuery, useLazyFetchCommentsQuery } = userApi;
