import React, { useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUpload = ({ images, setImages }) => {
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => file.type.startsWith('image/'));
    if (images.length + validFiles.length > 6) {
      alert("You can only upload a maximum of 6 images.");
      return;
    }
    setImages(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <div 
        className="relative group border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-3xl p-10 md:p-14 text-center hover:border-green-500 dark:hover:border-green-400 transition-all duration-300 cursor-pointer overflow-hidden bg-white/50 dark:bg-gray-800/50 hover:bg-green-50/50 dark:hover:bg-green-900/10"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input 
          type="file" 
          id="fileInput" 
          multiple 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange} 
        />
        
        <div className="flex flex-col items-center gap-5 relative z-10 transition-transform duration-300 group-hover:scale-105">
          <div className="bg-white dark:bg-gray-700 p-5 rounded-2xl shadow-sm mb-2 ring-1 ring-gray-100 dark:ring-gray-600">
             <Upload size={32} className="text-green-600 dark:text-green-400" />
          </div>
          <div className='space-y-2'>
            <p className="text-xl font-bold text-gray-700 dark:text-gray-200 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                Drop your items here
            </p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                or click to browse from your device
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Supported: JPG, PNG • Max 6 images
            </p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
            <AnimatePresence>
            {images.map((file, index) => (
                <motion.div 
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, opacity: 0 }}
                layout
                className="relative group aspect-square rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                <img 
                    src={URL.createObjectURL(file)} 
                    alt="preview" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button 
                        onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                        className="bg-red-500 text-white rounded-full p-2.5 hover:bg-red-600 transition-all hover:scale-110 shadow-lg"
                        title="Remove image"
                    >
                        <X size={18} />
                    </button>
                </div>
                </motion.div>
            ))}
            </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
