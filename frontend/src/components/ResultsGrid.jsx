import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink, Leaf, Recycle, PenTool, Youtube } from 'lucide-react';
import Skeleton from './Skeleton';

const ResultsGrid = ({ recommendations, wasteInfo, loading }) => {
  
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!recommendations || !recommendations.guides) return null;

  return (
    <div className="w-full mt-16 max-w-6xl mx-auto">
      
      {/* Waste Info Section */}
      {wasteInfo && Object.keys(wasteInfo).length > 0 && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
        >
            <div className="text-center mb-10">
                <span className="inline-block p-3 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
                    <Recycle size={32} />
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                    Material Insights
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(wasteInfo).map(([material, info], idx) => (
                    <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300"
                    >
                        <h3 className="text-xl font-bold capitalize text-green-700 dark:text-green-400 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
                            {material}
                        </h3>
                        {info.error ? (
                            <p className="text-red-400 text-sm bg-red-50 dark:bg-red-900/10 p-3 rounded-lg">Info unavailable</p>
                        ) : (
                            <div>
                                {info.recycling_instructions && (
                                    <div className="mb-2">
                                        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                            Recycling Steps
                                        </h4>
                                        <ul className="space-y-3">
                                            {info.recycling_instructions.slice(0, 4).map((inst, i) => (
                                                <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-3">
                                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-[10px] font-bold text-green-700 dark:text-green-400 mt-0.5">
                                                        {i+1}
                                                    </span>
                                                    <span className="leading-snug">{inst}</span>
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

      {/* Project Ideas Section */}
      <div className="mb-10 text-center">
         <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Eco-Friendly <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-400">Project Ideas</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400">Creative ways to reuse your items</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.guides.map((guide, index) => (
          <RecommendationCard key={index} guide={guide} index={index} />
        ))}
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
    <div className="w-full mt-16 max-w-6xl mx-auto">
        <div className="flex justify-center mb-12">
             <Skeleton className="h-10 w-64 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
             <Skeleton className="h-64 w-full rounded-2xl" />
             <Skeleton className="h-64 w-full rounded-2xl" />
             <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
        <div className="flex justify-center mb-8">
             <Skeleton className="h-10 w-48 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <Skeleton className="h-96 w-full rounded-2xl" />
             <Skeleton className="h-96 w-full rounded-2xl" />
             <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
    </div>
);

const RecommendationCard = ({ guide, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-green-900/10 dark:hover:shadow-green-900/20 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full transition-all duration-300"
    >
      <div className="p-6 md:p-8 flex-grow">
        <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-bold px-3 py-1 rounded-full border border-green-100 dark:border-green-800">
                {guide.material}
            </span>
            <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-medium px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                {guide.difficulty}
            </span>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 leading-tight group-hover:text-green-600 transition-colors">
            {guide.suggested_product}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
            {guide.purpose}
        </p>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Time</p>
                 <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{guide.estimated_time_minutes} mins</p>
            </div>
             <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Cost</p>
                 <p className="text-sm font-bold text-gray-700 dark:text-gray-200 capitalize">{guide.approx_cost_estimate}</p>
            </div>
        </div>
      </div>

      <div className="px-6 md:px-8 pb-8 mt-auto">
        <button
            onClick={() => setExpanded(!expanded)}
            className={`
                w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl transition-all font-semibold text-sm
                ${expanded 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200' 
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200 dark:shadow-none hover:-translate-y-0.5'}
            `}
        >
            {expanded ? (
                <>Hide Instructions <ChevronUp size={16} /></>
            ) : (
                <>Start Building <ChevronDown size={16} /></>
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
            <div className="p-6 md:p-8 space-y-8">
                
                {/* Steps */}
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                         <Leaf size={16} className="text-green-500"/> Steps
                    </h4>
                    <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-6">
                        {guide.step_by_step_instructions.map((step, i) => (
                        <li key={i} className="mb-2 ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-white dark:bg-gray-800 rounded-full -left-3 border border-green-200 dark:border-green-800">
                                <span className="text-green-600 dark:text-green-400 text-[10px] font-bold">{i+1}</span>
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{step}</p>
                        </li>
                        ))}
                    </ol>
                </div>

                {/* Materials */}
                <div>
                     <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                        <PenTool size={16} className="text-blue-500" /> Tools & Materials
                     </h4>
                     <div className="flex flex-wrap gap-2">
                        {guide.materials_needed.map((mat, i)=>(
                            <span key={i} className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 rounded-md text-gray-600 dark:text-gray-300">
                                {mat}
                            </span>
                        ))}
                     </div>
                </div>
                
                 {/* Tutorials */}
                 {guide.youtube_tutorials && guide.youtube_tutorials.length > 0 && (
                     <div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                             <Youtube size={16} className="text-red-500" /> Video Guides
                        </h4>
                         <div className="space-y-3">
                            {guide.youtube_tutorials.map((video, idx) => (
                                <a 
                                    key={idx} 
                                    href={video.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center text-red-600">
                                        <ExternalLink size={14} />
                                    </div>
                                    <div className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400 text-sm line-clamp-1">
                                        {video.title}
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
