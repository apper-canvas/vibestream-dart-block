import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { formatPlayCount } from "@/utils/formatDuration";

const ArtistCard = ({ artist, onViewArtist }) => {
  return (
    <motion.div
    initial={{
        opacity: 0,
        y: 20
    }}
    animate={{
        opacity: 1,
        y: 0
    }}
    whileHover={{
        scale: 1.05,
        y: -8
    }}
    className="group cursor-pointer"
    onClick={() => onViewArtist(artist)}>
    <Card
        className="text-center hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300">
        <CardContent className="p-6">
            <div className="relative mx-auto w-24 h-24 mb-4">
                <img
                    src={artist.profile_image_c}
                    alt={artist.name_c}
                    className="w-40 h-40 rounded-full object-cover shadow-2xl" />
            </div>
            <div className="text-center">
                <h3
                    className="text-white font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                    {artist.name_c}
                </h3>
                <div
                    className="flex items-center justify-center space-x-2 text-gray-400 text-sm mb-4">
                    <ApperIcon name="Users" className="w-4 h-4" />
                    <span>{formatPlayCount(artist.follower_count_c)}followers</span>
                </div>
                <Button
                    variant="outline"
                    className="w-full group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all">
                    <ApperIcon name="User" className="w-4 h-4 mr-2" />View Artist
                              </Button>
            </div></CardContent>
    </Card>
</motion.div>
  )
}

export default ArtistCard