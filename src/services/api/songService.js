import { getApperClient } from "@/services/apperClient"

class SongService {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const response = await apperClient.fetchRecords("song_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "artist_c" } },
          { field: { Name: "album_c" } },
          { field: { Name: "album_art_c" } },
          { field: { Name: "audio_url_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "genre_c" } },
          { field: { Name: "play_count_c" } }
        ]
      })

      if (!response.success) {
        console.error("Failed to fetch songs:", response.message)
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      console.error("Error in songService.getAll:", error)
      throw error
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const response = await apperClient.getRecordById("song_c", id, {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "artist_c" } },
          { field: { Name: "album_c" } },
          { field: { Name: "album_art_c" } },
          { field: { Name: "audio_url_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "genre_c" } },
          { field: { Name: "play_count_c" } }
        ]
      })

      if (!response.success) {
        console.error("Failed to fetch song:", response.message)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error("Error in songService.getById:", error)
      return null
    }
  }

  async getByGenre(genre) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const response = await apperClient.fetchRecords("song_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "artist_c" } },
          { field: { Name: "album_c" } },
          { field: { Name: "album_art_c" } },
          { field: { Name: "audio_url_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "genre_c" } },
          { field: { Name: "play_count_c" } }
        ],
        where: [
          {
            FieldName: "genre_c",
            Operator: "EqualTo",
            Values: [genre]
          }
        ]
      })

      if (!response.success) {
        console.error("Failed to fetch songs by genre:", response.message)
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      console.error("Error in songService.getByGenre:", error)
      throw error
    }
  }

  async search(query) {
    try {
      if (!query.trim()) return []

      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const searchTerm = query.toLowerCase()

      const response = await apperClient.fetchRecords("song_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "artist_c" } },
          { field: { Name: "album_c" } },
          { field: { Name: "album_art_c" } },
          { field: { Name: "audio_url_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "genre_c" } },
          { field: { Name: "play_count_c" } }
        ],
        whereGroups: {
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "Name",
                  operator: "Contains",
                  values: [searchTerm]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "artist_c",
                  operator: "Contains",
                  values: [searchTerm]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "album_c",
                  operator: "Contains",
                  values: [searchTerm]
                }
              ]
            }
          ]
        }
      })

      if (!response.success) {
        console.error("Failed to search songs:", response.message)
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      console.error("Error in songService.search:", error)
      throw error
    }
  }

  async getTopCharts(limit = 10) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const response = await apperClient.fetchRecords("song_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "artist_c" } },
          { field: { Name: "album_c" } },
          { field: { Name: "album_art_c" } },
          { field: { Name: "audio_url_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "genre_c" } },
          { field: { Name: "play_count_c" } }
        ],
        orderBy: [
          {
            fieldName: "play_count_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      })

      if (!response.success) {
        console.error("Failed to fetch top charts:", response.message)
        throw new Error(response.message)
      }

      const songs = response.data || []
      return songs.map((song, index) => ({
        rank: index + 1,
        song,
        previousRank: index + 1 + Math.floor(Math.random() * 3) - 1
      }))
    } catch (error) {
      console.error("Error in songService.getTopCharts:", error)
      throw error
    }
  }

  async getPreviewUrl(id) {
    try {
      const song = await this.getById(id)
      if (!song) return null

      return song.audio_url_c || `https://cdn.vibestream.io/previews/song-${id}-preview.mp3`
    } catch (error) {
      console.error("Error in songService.getPreviewUrl:", error)
      return null
    }
  }

  async toggleLike(songId, userId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      // Check if already liked
      const existingLikes = await apperClient.fetchRecords("song_like_c", {
        fields: [{ field: { Name: "Id" } }],
        where: [
          {
            FieldName: "song_id_c",
            Operator: "EqualTo",
            Values: [songId]
          },
          {
            FieldName: "user_id_c",
            Operator: "EqualTo",
            Values: [userId]
          }
        ]
      })

      if (existingLikes.success && existingLikes.data?.length > 0) {
        // Unlike - delete record
        const deleteResponse = await apperClient.deleteRecord("song_like_c", {
          RecordIds: [existingLikes.data[0].Id]
        })

        if (!deleteResponse.success) {
          console.error("Failed to unlike song:", deleteResponse.message)
          throw new Error(deleteResponse.message)
        }

        return false
      } else {
        // Like - create record
        const createResponse = await apperClient.createRecord("song_like_c", {
          records: [
            {
              song_id_c: songId,
              user_id_c: userId
            }
          ]
        })

        if (!createResponse.success) {
          console.error("Failed to like song:", createResponse.message)
          throw new Error(createResponse.message)
        }

        return true
      }
    } catch (error) {
      console.error("Error in songService.toggleLike:", error)
      throw error
    }
  }

  async getLikedSongs(userId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      // Fetch user's liked song IDs
      const likesResponse = await apperClient.fetchRecords("song_like_c", {
        fields: [
          { field: { Name: "song_id_c" } }
        ],
        where: [
          {
            FieldName: "user_id_c",
            Operator: "EqualTo",
            Values: [userId]
          }
        ]
      })

      if (!likesResponse.success || !likesResponse.data?.length) {
        return []
      }

      const songIds = likesResponse.data.map(like => like.song_id_c)

      // Fetch full song details
      const songsResponse = await apperClient.fetchRecords("song_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "artist_c" } },
          { field: { Name: "album_c" } },
          { field: { Name: "album_art_c" } },
          { field: { Name: "audio_url_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "genre_c" } },
          { field: { Name: "play_count_c" } }
        ],
        where: [
          {
            FieldName: "Id",
            Operator: "ExactMatch",
            Values: songIds,
            Include: true
          }
        ]
      })

      if (!songsResponse.success) {
        console.error("Failed to fetch liked songs:", songsResponse.message)
        throw new Error(songsResponse.message)
      }

      return songsResponse.data || []
    } catch (error) {
      console.error("Error in songService.getLikedSongs:", error)
      throw error
    }
  }

  async isLiked(songId, userId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const response = await apperClient.fetchRecords("song_like_c", {
        fields: [{ field: { Name: "Id" } }],
        where: [
          {
            FieldName: "song_id_c",
            Operator: "EqualTo",
            Values: [songId]
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
      console.error("Error in songService.isLiked:", error)
      return false
    }
  }
}

export default new SongService()