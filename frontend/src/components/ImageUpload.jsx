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
    <div className="w-full max-w-2xl mx-auto p-4">
      <div 
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-10 text-center hover:border-green-500 dark:hover:border-green-400 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-700/50"
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
        <div className="flex flex-col items-center gap-4 text-gray-500 dark:text-gray-400">
          <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full mb-2">
             <Upload size={32} className="text-green-600 dark:text-green-400" />
          </div>
          <div className='space-y-1'>
            <p className="text-xl font-bold text-gray-700 dark:text-gray-200">Click or Drag & Drop</p>
            <p className="text-sm">Upload up to 6 waste photos</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
        <AnimatePresence>
          {images.map((file, index) => (
            <motion.div 
              key={`${file.name}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <img 
                src={URL.createObjectURL(file)} 
                alt="preview" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                    className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImageUpload;
