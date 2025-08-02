"use client";


import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative mx-4 w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute -top-10 right-0 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
              <iframe
                src={videoUrl}
                title="App Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface VideoTriggerProps {
  onClick: () => void;
  className?: string;
}

export function VideoTrigger({ onClick, className = "" }: VideoTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E1FF] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 border border-input bg-transparent text-muted-foreground hover:bg-transparent hover:text-[#B8E1FF] hover:border-[#B8E1FF] hover:px-8 ${className}`}
    >
      <Play className="w-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:opacity-100 group-hover:mr-4" />
      <span className="transition-transform duration-200">
        watch demo
      </span>
    </button>
  );
}