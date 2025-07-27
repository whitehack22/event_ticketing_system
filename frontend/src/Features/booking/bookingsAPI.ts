import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/APIDomain";
import type { RootState } from "../../app/store";


export type TBooking = {
    bookingID: number;
    userID: number;
    eventID: number;
    numberOfTickets: number;
    totalAmount: string;
    bookingDate: string;
    bookingStatus: string;
    checkoutRequestID: string;
    createdAt: string;
    updatedAt: string;
}

export const bookingsAPI = createApi({
    reducerPath: 'bookingsAPI',
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

    tagTypes: ['Bookings'],
    endpoints: (builder) => ({
        createBooking: builder.mutation<TBooking, Partial<TBooking>>({
            query: (newBooking) => ({
                url: '/api/booking',
                method: 'POST',
                body: newBooking
            }),
            invalidatesTags: ['Bookings'] // invalidates the cache for the Bookings tag when a new booking is created
        }),
        getBookings: builder.query<{ data: TBooking[] }, void>({ //void means no parameters are needed to fetch the bookings
            query: () => '/api/bookings',
            providesTags: ['Bookings'] // this tells RTK Query that this endpoint provides the Bookings tag, so it can be used to invalidate the cache when a new booking is created
        }),
        updateBooking: builder.mutation<TBooking, Partial<TBooking> & { bookingID: number }>({ //& { id: number } is used to ensure that the id is always present when updating a booking
            query: (updatedBooking) => ({
                url: `/api/booking/${updatedBooking.bookingID}`,
                method: 'PUT',
                body: updatedBooking
            }),
            invalidatesTags: ['Bookings'] // invalidates the cache for the Bookings tag when a booking is updated
        }),
        deleteBooking: builder.mutation<{ success: boolean, bookingID: number }, number>({ //success: boolean indicates whether the deletion was successful, id: number is the id of the booking that was deleted, number is the type of the id parameter
            query: (bookingID) => ({
                url: `/api/booking/${bookingID}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Bookings'] // invalidates the cache for the Bookings tag when a booking is deleted
        }),
        // get booking by id
        getBookingById: builder.query<{ data: TBooking[] }, number>({
            query: (bookingID) => `/api/booking/${bookingID}`,
            providesTags: ['Bookings'] // this tells RTK Query that this endpoint provides the Bookings tag, so it can be used to invalidate the cache when a new booking is created
        }),
        // get booking by User ID
        getBookingsByUserId: builder.query<{ data: TBooking[] }, number>({
        query: (userId) => `/api/bookings/user/${userId}`,
        providesTags: ['Bookings'],
    }),
    })
})

export const { useCreateBookingMutation } = bookingsAPI;