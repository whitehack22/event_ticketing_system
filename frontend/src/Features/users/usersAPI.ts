import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/APIDomain";
import type { RootState } from "../../app/store";

export type TUser = {
    userID: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    contactPhone: string;
    address:string;
    role: string;
    isVerified: string;
    image_url?: string;
    createdAt: string;
    updatedAt: string;

}

export const userAPI = createApi({ // sets up API endpoints for user management - creating users and verifying them etc
    reducerPath: 'userAPI', // this is the key in the store where the API state will be stored - name of the API in the store
    baseQuery: fetchBaseQuery({
        baseUrl: ApiDomain, // base URL for the API - this is the domain where the API is hosted
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).user.token; // get the token from the user slice of the state
            if (token) {
                headers.set('Authorization', `Bearer ${token}`); // set the Authorization header with the token
            }
            headers.set('Content-Type', 'application/json'); // set the Content-Type header to application/json
            return headers; // return the headers to be used in the request
        }
    }), // base query function that will be used to make requests to the API

    // used to invalidate the cache when a mutation is performed 
    //  it helps to keep the data fresh in the cache, that is to mean that when a user is created, the cache is invalidated so that the next time the users are fetched, the new user is included in the list.
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        createUser: builder.mutation<TUser, Partial<TUser>>({
            query: (newUser) => ({
                url: '/api/user',
                method: 'POST',
                body: newUser
            }),
            invalidatesTags: ['Users']
        }),
         verifyUser: builder.mutation<{ message: string }, { email: string; code: string }>({
            query: (data) => ({
                url: '/api/user/verify',
                method: 'POST',
                body: data,
            }),
        }),
        getUsers: builder.query<TUser[], void>({
            query: () => '/api/users',
            transformResponse: (response: { data: TUser[] }) => response.data,
            providesTags: ['Users']
        }),
        // update user
        updateUser: builder.mutation<TUser, Partial<TUser> & { userID: number }>({
            query: (user) => ({
                url: `/api/user/${user.userID}`,
                method: 'PUT',
                body: user,
            }),
            invalidatesTags: ['Users']
        }),
        deleteUsers: builder.mutation<{ success: boolean, userID: number }, number>({ //success: boolean indicates whether the deletion was successful, id: number is the id of the user that was deleted, number is the type of the id parameter
            query: (userID) => ({
                url: `/api/user/${userID}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Users'] // invalidates the cache for the Users tag when a user is deleted
        }),
        getUserById: builder.query<TUser, number>({
            query: (userID) => `/api/user/${userID}`,
            transformResponse: (response: { data: TUser }) => response.data,
            providesTags: ['Users']
        }),
    })

})