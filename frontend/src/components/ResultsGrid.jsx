import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink, Leaf, Recycle } from 'lucide-react';

const ResultsGrid = ({ recommendations, wasteInfo }) => {
  if (!recommendations || !recommendations.guides) return null;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 mt-8">
      
      {/* Waste Info Section */}
      {wasteInfo && Object.keys(wasteInfo).length > 0 && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
        >
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8 flex items-center justify-center gap-3">
                <Recycle className="text-green-600 dark:text-green-400" size={32} /> 
                Material Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(wasteInfo).map(([material, info], idx) => (
                    <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-green-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                        <h3 className="text-xl font-bold capitalize text-green-700 dark:text-green-400 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                            {material}
                        </h3>
                        {info.error ? (
                            <p className="text-red-400 text-sm">Info unavailable</p>
                        ) : (
                            <div>
                                {info.recycling_instructions && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Recycling Steps:</h4>
                                        <ul className="space-y-2">
                                            {info.recycling_instructions.slice(0, 4).map((inst, i) => (
                                                <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                                    <span className="min-w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></span>
                                                    {inst}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
      )}

      <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-10">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">Eco-Friendly</span> Project Ideas
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.guides.map((guide, index) => (
          <RecommendationCard key={index} guide={guide} index={index} />
        ))}
      </div>
    </div>
  );
};

const RecommendationCard = ({ guide, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="p-8 flex-grow">
        <div className="flex items-center gap-3 mb-4">
            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {guide.material}
            </span>
            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-medium px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900">
                {guide.difficulty}
            </span>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 leading-tight">
            {guide.suggested_product}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
            {guide.purpose}
        </p>
        
        <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400 mb-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <div className='flex justify-between items-center'>
                <span>⏱ Estimated Time</span> 
                <span className='font-semibold text-gray-700 dark:text-gray-200'>{guide.estimated_time_minutes} mins</span>
            </div>
             <div className='flex justify-between items-center'>
                <span>💰 Cost Estimate</span> 
                <span className='font-semibold text-gray-700 dark:text-gray-200 capitalize'>{guide.approx_cost_estimate}</span>
            </div>
        </div>
      </div>

      <div className="px-8 pb-8 mt-auto">
        <button
            onClick={() => setExpanded(!expanded)}
            className={`
                w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl transition-all font-semibold text-sm
                ${expanded 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200' 
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200 dark:shadow-none'}
            `}
        >
            {expanded ? (
                <>Hide Instructions <ChevronUp size={18} /></>
            ) : (
                <>Start Project <ChevronDown size={18} /></>
            )}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-8 space-y-8">
                
                {/* Steps */}
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2 text-lg">
                         <Leaf size={20} className="text-green-500"/> Step-by-Step
                    </h4>
                    <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-6">
                        {guide.step_by_step_instructions.map((step, i) => (
                        <li key={i} className="mb-2 ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full -left-3 ring-4 ring-white dark:ring-gray-900">
                                <span className="text-green-800 dark:text-green-300 text-xs font-bold">{i+1}</span>
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{step}</p>
                        </li>
                        ))}
                    </ol>
                </div>

                {/* Materials */}
                <div>
                     <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-lg">Tools & Materials</h4>
                     <div className="flex flex-wrap gap-2">
                        {guide.materials_needed.map((mat, i)=>(
                            <span key={i} className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-md text-gray-600 dark:text-gray-300 shadow-sm">{mat}</span>
                        ))}
                     </div>
                </div>
                
                 {/* Tutorials */}
                 {guide.youtube_tutorials && guide.youtube_tutorials.length > 0 && (
                     <div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-lg">Video Guides</h4>
                         <div className="space-y-3">
                            {guide.youtube_tutorials.map((video, idx) => (
                                <a 
                                    key={idx} 
                                    href={video.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="block p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group shadow-sm"
                                >
                                    <div className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400 flex items-center justify-between text-sm">
                                        <span className="line-clamp-1">{video.title}</span> 
                                        <ExternalLink size={14} className="flex-shrink-0"/>
                                    </div>
                                </a>
                            ))}
                         </div>
                     </div>
                 )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResultsGrid;
