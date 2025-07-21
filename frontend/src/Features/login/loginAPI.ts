import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/APIDomain";

export type TLoginResponse = {
    token: string;
    user: {
        userID: number;
        firstName: string;
        lastName: string;
        email: string;
        contactPhone: string;
        address: string;
        role: string;
    };
}

type LoginInputs = {
    email: string;
    password: string;
}

export const loginAPI = createApi({
    reducerPath: 'loginAPI',
    baseQuery: fetchBaseQuery({ baseUrl: ApiDomain }),
    tagTypes: ['Login'],
    endpoints: (builder) => ({
        loginUser: builder.mutation<TLoginResponse, LoginInputs>({
            query: (loginData) => ({
                url: '/api/user/login',
                method: 'POST',
                body: loginData
            }),
            invalidatesTags: ['Login']
        })
    })
});