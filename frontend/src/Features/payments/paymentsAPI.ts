import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/APIDomain";
import type { RootState } from "../../app/store";


export type TPayment = {
    paymentID: number;
    bookingID: number;
    userID: number;
    amount: number;
    paymentStatus:string;
    paymentDate: string;
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
}

export const paymentsAPI = createApi({
    reducerPath: 'paymentsAPI',
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

    tagTypes: ['Payments'],
    endpoints: (builder) => ({
        createPayment: builder.mutation<TPayment, Partial<TPayment>>({
            query: (newPayment) => ({
                url: '/api/payment',
                method: 'POST',
                body: newPayment
            }),
            invalidatesTags: ['Payments'] // invalidates the cache for the Payment tag when a new payment is created
        }),
        getPayments: builder.query<{ data: TPayment[] }, void>({ //void means no parameters are needed to fetch the payments
            query: () => '/api/payments',
            providesTags: ['Payments'] // this tells RTK Query that this endpoint provides the Payment tag, so it can be used to invalidate the cache when a new payment is created
        }),
        updatePayment: builder.mutation<TPayment, Partial<TPayment> & { paymentID: number }>({ //& { id: number } is used to ensure that the id is always present when updating a payment
            query: (updatedPayment) => ({
                url: `/api/payment/${updatedPayment.paymentID}`,
                method: 'PUT',
                body: updatedPayment
            }),
            invalidatesTags: ['Payments'] // invalidates the cache for the Payment tag when a payment is updated
        }),
        deletePayment: builder.mutation<{ success: boolean, paymentID: number }, number>({ //success: boolean indicates whether the deletion was successful, id: number is the id of the payment that was deleted, number is the type of the id parameter
            query: (paymentID) => ({
                url: `/api/payment/${paymentID}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Payments'] // invalidates the cache for the Payment tag when a payment is deleted
        }),
        // get payment by id
        getPaymentById: builder.query<{ data: TPayment[] }, number>({
            query: (paymentID) => `/api/payment/${paymentID}`,
            providesTags: ['Payments'] // this tells RTK Query that this endpoint provides the Payment tag, so it can be used to invalidate the cache when a new payment is created
        }),
        // get payment by User ID
        getPaymentByUserId: builder.query<{ data: TPayment[] }, number>({
        query: (userId) => `/api/payments/user/${userId}`,
        providesTags: ['Payments'],
    }),
        // get payment by Booking ID
        getPaymentByBookingId: builder.query<{ data: TPayment[] }, number>({
        query: (bookingID) => `/api/payments/booking/${bookingID}`,
        providesTags: ['Payments'],
    }),
    })
})