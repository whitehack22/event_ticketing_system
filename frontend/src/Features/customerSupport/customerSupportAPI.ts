import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/APIDomain";
import type { RootState } from "../../app/store";


export type TCustomerSupport = {
    ticketID: number;
    userID: number;
    email: string;
    subject: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export const customerSupportAPI = createApi({
    reducerPath: 'customerSupportAPI',
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

    tagTypes: ['CustomerSupport'],
    endpoints: (builder) => ({
        createSupportTicket: builder.mutation<TCustomerSupport, Partial<TCustomerSupport>>({
            query: (newSupportTicket) => ({
                url: '/api/ticket',
                method: 'POST',
                body: newSupportTicket
            }),
            invalidatesTags: ['CustomerSupport'] // invalidates the cache for the Customer Support tag when a new ticket is created
        }),
        getSupportTickets: builder.query<{ data: TCustomerSupport[] }, void>({ //void means no parameters are needed to fetch the tickets
            query: () => '/api/tickets',
            providesTags: ['CustomerSupport'] // this tells RTK Query that this endpoint provides the Customer Supports tag, so it can be used to invalidate the cache when a new ticket is created
        }),
        updateSupportTicket: builder.mutation<TCustomerSupport, Partial<TCustomerSupport> & { ticketID: number }>({ //& { id: number } is used to ensure that the id is always present when updating a ticket
            query: (updatedSupportTicket) => ({
                url: `/api/ticket/${updatedSupportTicket.ticketID}`,
                method: 'PUT',
                body: updatedSupportTicket
            }),
            invalidatesTags: ['CustomerSupport'] // invalidates the cache for the Customer Support tag when a ticket is updated
        }),
        deleteSupportTicket: builder.mutation<{ success: boolean, ticketID: number }, number>({ //success: boolean indicates whether the deletion was successful, id: number is the id of the ticket that was deleted, number is the type of the id parameter
            query: (ticketID) => ({
                url: `/api/ticket/${ticketID}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['CustomerSupport'] // invalidates the cache for the Customer Support tag when a ticket is deleted
        }),
        // get ticket by id
        getSupportTicketById: builder.query<{ data: TCustomerSupport[] }, number>({
            query: (ticketID) => `/api/ticket/${ticketID}`,
            providesTags: ['CustomerSupport'] // this tells RTK Query that this endpoint provides the Customer Support tag, so it can be used to invalidate the cache when a new ticket is created
        }),
        // get ticket by User ID
        getSupportTicketsByUserId: builder.query<{ data: TCustomerSupport[] }, number>({
        query: (userId) => `/api/tickets/user/${userId}`,
        providesTags: ['CustomerSupport'],
    }),
    })
})