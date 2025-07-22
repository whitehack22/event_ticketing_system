import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/APIDomain";
import type { RootState } from "../../app/store";


export type TEvent = {
    eventID: number;
    title: string;
    description: string;
    category: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    ticketPrice: number;
    totalTickets: number;
    availableTickets: number;
    isActive: boolean;
    image_url: string;
    venueID: number;
    createdAt: string;
    updatedAt: string;
}

export const eventsAPI = createApi({
    reducerPath: 'eventsAPI',
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

    tagTypes: ['Events'],
    endpoints: (builder) => ({
        createEvent: builder.mutation<TEvent, Partial<TEvent>>({
            query: (newEvent) => ({
                url: '/api/event',
                method: 'POST',
                body: newEvent
            }),
            invalidatesTags: ['Events'] // invalidates the cache for the Events tag when a new event is created
        }),
        getEvents: builder.query<{ data: TEvent[] }, void>({ //void means no parameters are needed to fetch the events
            query: () => '/api/events',
            providesTags: ['Events'] // this tells RTK Query that this endpoint provides the Events tag, so it can be used to invalidate the cache when a new event is created
        }),
        updateEvent: builder.mutation<TEvent, Partial<TEvent> & { eventID: number }>({ //& { id: number } is used to ensure that the id is always present when updating a event
            query: (updatedEvent) => ({
                url: `/api/event/${updatedEvent.eventID}`,
                method: 'PUT',
                body: updatedEvent
            }),
            invalidatesTags: ['Events'] // invalidates the cache for the Events tag when a event is updated
        }),
        deleteEvent: builder.mutation<{ success: boolean, eventID: number }, number>({ //success: boolean indicates whether the deletion was successful, id: number is the id of the event that was deleted, number is the type of the id parameter
            query: (eventID) => ({
                url: `/api/event/${eventID}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Events'] // invalidates the cache for the Events tag when a event is deleted
        }),
        // get event by id
        getEventById: builder.query<{ data: TEvent[] }, number>({
            query: (eventID) => `/api/event/${eventID}`,
            providesTags: ['Events'] // this tells RTK Query that this endpoint provides the Events tag, so it can be used to invalidate the cache when a new event is created
        }),
    })
})