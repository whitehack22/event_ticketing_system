import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MpesaDomain } from "../../utils/APIDomain";
import type { RootState } from "../../app/store";

export type TMpesa = {
    phone: string;
    amount: number;
    bookingID: number;
    paymentStatus:string;
}
export const mpesaAPI = createApi({
  reducerPath: "mpesaAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: MpesaDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Mpesa'],
  endpoints: (builder) => ({
    initiateSTK: builder.mutation<TMpesa, Partial<TMpesa>>({
      query: (newSTK) => ({
        url: "api/mpesa/stk",
        method: "POST",
        body: newSTK,
      }),
      invalidatesTags: ['Mpesa'],
    }),

    getPaymentStatus: builder.query<{ data: TMpesa[] }, number>({
      query: (bookingID) => `/api/payments/booking/${bookingID}`,
      providesTags: ['Mpesa'],
    }),
  }),
});

