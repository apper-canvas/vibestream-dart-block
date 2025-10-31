import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { clearUser } from "@/store/slices/userSlice";

const ProfileMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

const handleLogout = async () => {
    try {
      dispatch(clearUser())
      await window.ApperSDK?.ApperUI?.logout()
      toast.success("Logged out successfully")
      navigate("/login")
      setIsOpen(false)
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed")
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        <img
src={user.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.emailAddress)}&background=1DB954&color=fff`}
          alt={user.name || user.emailAddress}
          className="w-8 h-8 rounded-full"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-12 w-64 glass rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-700 flex items-center space-x-3">
                <img
                  src={user.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.emailAddress)}&background=1DB954&color=fff`}
                  alt={user.name || user.emailAddress}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-white font-semibold">{user.name || user.emailAddress}</p>
                  <p className="text-gray-400 text-sm">{user.emailAddress}</p>
              </div>
              <div className="mt-3 flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-primary to-accent rounded-full">
                <ApperIcon name="Crown" size={14} className="text-white mr-1.5" />
                <span className="text-white text-xs font-semibold">Premium Member</span>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={() => {
                  toast.info("Account settings coming soon!")
                  setIsOpen(false)
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ApperIcon name="Settings" size={18} />
                <span>Account Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ApperIcon name="LogOut" size={18} />
                <span>Log Out</span>
</button>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfileMenu