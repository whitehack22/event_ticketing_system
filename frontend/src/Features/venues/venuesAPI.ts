import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/APIDomain";
import type { RootState } from "../../app/store";


export type TVenue = {
    venueID: number;
    name: string;
    address: string;
    capacity: number;
    contactNumber: string;
    createdAt: string;
}

export const venuesAPI = createApi({
    reducerPath: 'venuesAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: ApiDomain,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).user.token; // get the token from the user slice of the state
            if (token) {
                headers.set('Authorization', `Bearer ${token}`); // set the Authorization header with the token
            }
            headers.set('Content-Type', 'application/json'); // set the Content-Type header to application/json
            return headers; // return the headers to be used in the request
        }
    }),

    tagTypes: ['Venues'],
    endpoints: (builder) => ({
        createVenue: builder.mutation<TVenue, Partial<TVenue>>({
            query: (newVenue) => ({
                url: '/api/venue',
                method: 'POST',
                body: newVenue
            }),
            invalidatesTags: ['Venues'] // invalidates the cache for the Venues tag when a new venue is created
        }),
        getVenues: builder.query<{ data: TVenue[] }, void>({ //void means no parameters are needed to fetch the venues
            query: () => '/api/venues',
            providesTags: ['Venues'] // this tells RTK Query that this endpoint provides the Venues tag, so it can be used to invalidate the cache when a new venue is created
        }),
        updateVenue: builder.mutation<TVenue, Partial<TVenue> & { venueID: number }>({ //& { id: number } is used to ensure that the id is always present when updating a venue
            query: (updatedVenue) => ({
                url: `/api/venue/${updatedVenue.venueID}`,
                method: 'PUT',
                body: updatedVenue
            }),
            invalidatesTags: ['Venues'] // invalidates the cache for the Venues tag when a venue is updated
        }),
        deleteVenue: builder.mutation<{ success: boolean, venueID: number }, number>({ //success: boolean indicates whether the deletion was successful, id: number is the id of the venue that was deleted, number is the type of the id parameter
            query: (venueID) => ({
                url: `/api/venue/${venueID}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Venues'] // invalidates the cache for the Venues tag when a venue is deleted
        }),
        // get venue by id
        getVenueById: builder.query<{ data: TVenue[] }, number>({
            query: (venueID) => `/api/venue/${venueID}`,
            providesTags: ['Venues'] // this tells RTK Query that this endpoint provides the Venues tag, so it can be used to invalidate the cache when a new venue is created
        }),
    })
})