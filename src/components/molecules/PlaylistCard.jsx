import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const PlaylistCard = ({ playlist, onViewPlaylist }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -8 }}
      className="group cursor-pointer"
      onClick={() => onViewPlaylist(playlist)}
    >
      <Card className="overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300">
        <div className="relative">
          <img
src={playlist.cover_image_c}
            alt={playlist.name_c}
            className="w-full aspect-square object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
          
          {/* Play Button */}
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg hover:bg-primary/90 hover:scale-110 transition-all duration-200">
              <ApperIcon name="Play" className="w-6 h-6 text-white ml-1" />
            </button>
          </motion.div>
          
          <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs font-semibold text-white bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
              {playlist.song_count_c || 0} songs
            </span>
          </div>
        </div>
        
<CardContent className="p-4">
          <h3 className="text-white font-semibold text-lg truncate group-hover:text-primary transition-colors">
            {playlist.name_c}
          </h3>
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
            {playlist.description_c}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default PlaylistCard