import React, { useCallback } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { formatDuration, formatPlayCount } from "@/utils/formatDuration";

const SongCard = ({ song, onPlay, isPlaying = false, isPreviewing = false, onPreview, onStopPreview, showPlayCount = false }) => {
  const handleMouseEnter = useCallback(() => {
    if (onPreview && !isPlaying) {
      onPreview(song)
    }
  }, [song, onPreview, isPlaying])

  const handleMouseLeave = useCallback(() => {
    if (onStopPreview && isPreviewing) {
      onStopPreview()
    }
  }, [onStopPreview, isPreviewing])
  return (
<motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="glass rounded-xl p-4 hover:shadow-xl hover:shadow-primary/10 transition-all duration-200 group"
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
src={song.album_art_c}
            alt={song.album_c}
            className="w-full aspect-square object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          <button
            onClick={onPlay}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform">
              <ApperIcon 
                name={isPlaying ? "Pause" : "Play"} 
                className="w-6 h-6 text-white ml-0.5" 
              />
            </div>
          </button>
        </div>

        <div className="p-4 flex-1 min-w-0">
          <h4 className="text-white font-medium truncate group-hover:text-primary transition-colors">
            {song.Name}
          </h4>
          <p className="text-gray-400 text-sm truncate">{song.artist_c}</p>
          {showPlayCount && (
            <p className="text-gray-500 text-xs mt-1">
              {formatPlayCount(song.play_count_c)} plays
            </p>
          )}
        </div>

<div className="p-4 flex items-center space-x-3">
          <span className="text-gray-400 text-sm">
            {formatDuration(song.duration_c)}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default SongCard