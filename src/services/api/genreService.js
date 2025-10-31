import { getApperClient } from "@/services/apperClient"

class GenreService {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const response = await apperClient.fetchRecords("genre_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "icon_c" } }
        ]
      })

      if (!response.success) {
        console.error("Failed to fetch genres:", response.message)
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      console.error("Error in genreService.getAll:", error)
      throw error
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error("ApperClient not initialized")

      const response = await apperClient.getRecordById("genre_c", id, {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "icon_c" } }
        ]
      })

      if (!response.success) {
        console.error("Failed to fetch genre:", response.message)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error("Error in genreService.getById:", error)
      return null
    }
  }
}

export default new GenreService()