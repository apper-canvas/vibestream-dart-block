import { getApperClient } from "@/services/apperClient";
import React from "react";
import Error from "@/components/ui/Error";

class ArtistService {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const response = await apperClient.fetchRecords("artist_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "bio_c" } },
          { field: { Name: "profile_image_c" } },
          { field: { Name: "follower_count_c" } }
        ]
      })

      if (!response.success) {
        console.error("Failed to fetch artists:", response.message)
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      console.error("Error in artistService.getAll:", error)
      throw error
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const response = await apperClient.getRecordById("artist_c", id, {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "bio_c" } },
          { field: { Name: "profile_image_c" } },
          { field: { Name: "follower_count_c" } }
        ]
      })

      if (!response.success) {
        console.error("Failed to fetch artist:", response.message)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error("Error in artistService.getById:", error)
      return null
    }
  }

  async getFeatured(limit = 6) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const response = await apperClient.fetchRecords("artist_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "bio_c" } },
          { field: { Name: "profile_image_c" } },
          { field: { Name: "follower_count_c" } }
        ],
        orderBy: [
          {
            fieldName: "follower_count_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      })

      if (!response.success) {
        console.error("Failed to fetch featured artists:", response.message)
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      console.error("Error in artistService.getFeatured:", error)
      throw error
    }
  }

  async toggleFollow(artistId, userId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      // Check if already following
      const existingFollows = await apperClient.fetchRecords("artist_follow_c", {
        fields: [{ field: { Name: "Id" } }],
        where: [
          {
            FieldName: "artist_id_c",
            Operator: "EqualTo",
            Values: [artistId]
          },
          {
            FieldName: "user_id_c",
            Operator: "EqualTo",
            Values: [userId]
          }
        ]
      })

      if (existingFollows.success && existingFollows.data?.length > 0) {
        // Unfollow - delete record
        const deleteResponse = await apperClient.deleteRecord("artist_follow_c", {
          RecordIds: [existingFollows.data[0].Id]
        })

        if (!deleteResponse.success) {
          console.error("Failed to unfollow artist:", deleteResponse.message)
          throw new Error(deleteResponse.message)
        }

        return false
      } else {
        // Follow - create record
        const createResponse = await apperClient.createRecord("artist_follow_c", {
          records: [
            {
              artist_id_c: artistId,
              user_id_c: userId
            }
          ]
        })

        if (!createResponse.success) {
          console.error("Failed to follow artist:", createResponse.message)
          throw new Error(createResponse.message)
        }

        return true
      }
    } catch (error) {
      console.error("Error in artistService.toggleFollow:", error)
      throw error
    }
  }

  async getFollowedArtists(userId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      // Fetch user's followed artist IDs
      const followsResponse = await apperClient.fetchRecords("artist_follow_c", {
        fields: [
          { field: { Name: "artist_id_c" } }
        ],
        where: [
          {
            FieldName: "user_id_c",
            Operator: "EqualTo",
            Values: [userId]
          }
        ]
      })

      if (!followsResponse.success || !followsResponse.data?.length) {
        return []
      }

      const artistIds = followsResponse.data.map(follow => follow.artist_id_c)

      // Fetch full artist details
      const artistsResponse = await apperClient.fetchRecords("artist_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "bio_c" } },
          { field: { Name: "profile_image_c" } },
          { field: { Name: "follower_count_c" } }
        ],
        where: [
          {
            FieldName: "Id",
            Operator: "ExactMatch",
            Values: artistIds,
            Include: true
          }
        ]
      })

      if (!artistsResponse.success) {
        console.error("Failed to fetch followed artists:", artistsResponse.message)
        throw new Error(artistsResponse.message)
      }

      return artistsResponse.data || []
    } catch (error) {
      console.error("Error in artistService.getFollowedArtists:", error)
      throw error
    }
  }

  async isFollowing(artistId, userId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const response = await apperClient.fetchRecords("artist_follow_c", {
        fields: [{ field: { Name: "Id" } }],
        where: [
          {
            FieldName: "artist_id_c",
            Operator: "EqualTo",
            Values: [artistId]
          },
          {
            FieldName: "user_id_c",
            Operator: "EqualTo",
            Values: [userId]
          }
        ]
      })

      return response.success && response.data?.length > 0
    } catch (error) {
      console.error("Error in artistService.isFollowing:", error)
      return false
}
  }
}

export default new ArtistService()