import { api } from "./api"

export const followApi = api.injectEndpoints({
    endpoints: (builder) => ({
        followUser: builder.mutation<void, { followingId: string }>({
            query: (body) => ({
                url: "/follows",
                method: "POST",
                body,
            }),
        }),
        unfollowUser: builder.mutation<void, string>({
            query: (userId) => ({
                url: `/follows/${userId}`,
                method: "DELETE",
            }),
        }),
    }),
})

export const {
    useFollowUserMutation,
    useUnfollowUserMutation
} = followApi

export const {
    endpoints: { followUser, unfollowUser },
} = followApi