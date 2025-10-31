import { getApperClient } from "@/services/apperClient";
import React from "react";
import Error from "@/components/ui/Error";

class PlaylistService {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const response = await apperClient.fetchRecords("playlist_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "cover_image_c" } },
          { field: { Name: "song_count_c" } },
          { field: { Name: "user_id_c" } }
        ]
      })

      if (!response.success) {
        console.error("Failed to fetch playlists:", response.message)
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      console.error("Error in playlistService.getAll:", error)
      throw error
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const response = await apperClient.getRecordById("playlist_c", id, {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "cover_image_c" } },
          { field: { Name: "song_count_c" } },
          { field: { Name: "user_id_c" } }
        ]
      })

      if (!response.success) {
        console.error("Failed to fetch playlist:", response.message)
        return null
      }

      const playlist = response.data

      if (!playlist) return null

      // Fetch playlist songs
      const songsResponse = await apperClient.fetchRecords("playlist_song_c", {
        fields: [
          { field: { Name: "song_id_c" } }
        ],
        where: [
          {
            FieldName: "playlist_id_c",
            Operator: "EqualTo",
            Values: [id]
          }
        ]
      })

      let songs = []
      if (songsResponse.success && songsResponse.data?.length > 0) {
        const songIds = songsResponse.data.map(ps => ps.song_id_c)

        const fullSongsResponse = await apperClient.fetchRecords("song_c", {
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

        if (fullSongsResponse.success) {
          songs = fullSongsResponse.data || []
        }
      }

      return {
        ...playlist,
        songs
      }
    } catch (error) {
      console.error("Error in playlistService.getById:", error)
      return null
    }
  }

  async getUserPlaylists(userId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const response = await apperClient.fetchRecords("playlist_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "cover_image_c" } },
          { field: { Name: "song_count_c" } },
          { field: { Name: "user_id_c" } }
        ],
        where: [
          {
            FieldName: "user_id_c",
            Operator: "EqualTo",
            Values: [userId]
          }
        ]
      })

      if (!response.success) {
        console.error("Failed to fetch user playlists:", response.message)
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      console.error("Error in playlistService.getUserPlaylists:", error)
      throw error
    }
  }

  async getTrending(limit = 8) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const response = await apperClient.fetchRecords("playlist_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "cover_image_c" } },
          { field: { Name: "song_count_c" } },
          { field: { Name: "user_id_c" } }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      })

      if (!response.success) {
        console.error("Failed to fetch trending playlists:", response.message)
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      console.error("Error in playlistService.getTrending:", error)
      throw error
    }
  }

  async create(playlistData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const response = await apperClient.createRecord("playlist_c", {
        records: [
          {
            name_c: playlistData.name,
            description_c: playlistData.description,
            cover_image_c: playlistData.coverImage,
            song_count_c: 0,
            user_id_c: playlistData.userId
          }
        ]
      })

      if (!response.success) {
        console.error("Failed to create playlist:", response.message)
        throw new Error(response.message)
      }

      if (response.results && response.results[0]?.success) {
        return response.results[0].data
      }

      throw new Error("Failed to create playlist")
    } catch (error) {
      console.error("Error in playlistService.create:", error)
      throw error
    }
  }

  async update(id, data) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const updateData = {
        Id: id
      }

      if (data.name) updateData.name_c = data.name
      if (data.description) updateData.description_c = data.description
      if (data.coverImage) updateData.cover_image_c = data.coverImage

      const response = await apperClient.updateRecord("playlist_c", {
        records: [updateData]
      })

      if (!response.success) {
        console.error("Failed to update playlist:", response.message)
        throw new Error(response.message)
      }

      if (response.results && response.results[0]?.success) {
        return response.results[0].data
      }

      throw new Error("Failed to update playlist")
    } catch (error) {
      console.error("Error in playlistService.update:", error)
      throw error
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const response = await apperClient.deleteRecord("playlist_c", {
        RecordIds: [id]
      })

      if (!response.success) {
        console.error("Failed to delete playlist:", response.message)
        throw new Error(response.message)
      }

      return true
    } catch (error) {
      console.error("Error in playlistService.delete:", error)
      throw error
    }
  }

  async addSong(playlistId, songId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      // Check if song already in playlist
      const existingResponse = await apperClient.fetchRecords("playlist_song_c", {
        fields: [{ field: { Name: "Id" } }],
        where: [
          {
            FieldName: "playlist_id_c",
            Operator: "EqualTo",
            Values: [playlistId]
          },
          {
            FieldName: "song_id_c",
            Operator: "EqualTo",
            Values: [songId]
          }
        ]
      })

      if (existingResponse.success && existingResponse.data?.length > 0) {
        return true // Already in playlist
      }

      // Add song to playlist
      const response = await apperClient.createRecord("playlist_song_c", {
        records: [
          {
            playlist_id_c: playlistId,
            song_id_c: songId
          }
        ]
      })

      if (!response.success) {
        console.error("Failed to add song to playlist:", response.message)
        throw new Error(response.message)
      }

      // Update song count
      const playlist = await this.getById(playlistId)
      if (playlist) {
        await this.update(playlistId, {
          ...playlist,
          song_count_c: (playlist.song_count_c || 0) + 1
        })
      }

      return true
    } catch (error) {
      console.error("Error in playlistService.addSong:", error)
      throw error
    }
  }

  async removeSong(playlistId, songId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      // Find playlist-song record
      const existingResponse = await apperClient.fetchRecords("playlist_song_c", {
        fields: [{ field: { Name: "Id" } }],
        where: [
          {
            FieldName: "playlist_id_c",
            Operator: "EqualTo",
            Values: [playlistId]
          },
          {
            FieldName: "song_id_c",
            Operator: "EqualTo",
            Values: [songId]
          }
        ]
      })

      if (!existingResponse.success || !existingResponse.data?.length) {
        return true // Not in playlist
      }

      // Delete playlist-song record
      const response = await apperClient.deleteRecord("playlist_song_c", {
        RecordIds: [existingResponse.data[0].Id]
      })

      if (!response.success) {
        console.error("Failed to remove song from playlist:", response.message)
        throw new Error(response.message)
      }

      // Update song count
      const playlist = await this.getById(playlistId)
      if (playlist) {
        await this.update(playlistId, {
          ...playlist,
          song_count_c: Math.max(0, (playlist.song_count_c || 0) - 1)
        })
      }

      return true
    } catch (error) {
      console.error("Error in playlistService.removeSong:", error)
      throw error
    }
  }

  async reorderSongs(playlistId, songIds) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      // Get existing playlist-song records
      const existingResponse = await apperClient.fetchRecords("playlist_song_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "song_id_c" } }
        ],
        where: [
          {
            FieldName: "playlist_id_c",
            Operator: "EqualTo",
            Values: [playlistId]
          }
        ]
      })

      if (!existingResponse.success) {
        throw new Error("Failed to fetch playlist songs")
      }

      // Delete all existing records
      if (existingResponse.data?.length > 0) {
        const recordIds = existingResponse.data.map(ps => ps.Id)
        await apperClient.deleteRecord("playlist_song_c", {
          RecordIds: recordIds
        })
      }

      // Create new records in correct order
      const records = songIds.map(songId => ({
        playlist_id_c: playlistId,
        song_id_c: songId
      }))

      const response = await apperClient.createRecord("playlist_song_c", {
        records
      })

      if (!response.success) {
        console.error("Failed to reorder playlist songs:", response.message)
        throw new Error(response.message)
      }

      return true
    } catch (error) {
      console.error("Error in playlistService.reorderSongs:", error)
      throw error
throw error
    }
  }
}

export default new PlaylistService()