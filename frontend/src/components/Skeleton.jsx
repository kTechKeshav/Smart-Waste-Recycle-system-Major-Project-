import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden relative ${className}`}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default Skeleton;
