import React, { useState } from 'react';
import axios from 'axios';
import ImageUpload from '../components/ImageUpload';
import ResultsGrid from '../components/ResultsGrid';
import ThemeToggle from '../components/ThemeToggle';
import { Loader2, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const RecycleAssessment = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (images.length === 0) {
        setError("Please upload at least one image.");
        return;
    }
    
    setLoading(true);
    setError(null);
    setResults(null); // Clear previous results to show skeleton if desired, or keep them.
    // Actually, distinct skeleton usage is better with "results=null" or a separate loading prop.
    
    // Scroll to results area immediately to show loading state
    setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });

    try {
      const port = 4000; 
      const response = await axios.post('http://localhost:' + port + '/api/recycle/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setResults({
            recommendations: response.data.recommendations,
            wasteInfo: response.data.waste_info
        });
      } else {
          setError(response.data.message || "Failed to analyze images. Please try again.");
      }

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
      } else {
          setError("An error occurred while connecting to the server. Integration services might be down.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans selection:bg-green-100 selection:text-green-800">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full p-4 md:p-6 flex justify-between items-center z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-2 rounded-xl shadow-lg shadow-green-200 dark:shadow-none">
                <Leaf className="text-white" size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-800 dark:text-white">
                Scrap<span className="text-green-600">Smart</span>
            </span>
          </div>
          <ThemeToggle />
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-green-50 to-transparent dark:from-green-900/20 dark:to-transparent -z-10" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-green-200/30 dark:bg-green-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute top-40 left-10 w-72 h-72 bg-teal-200/30 dark:bg-teal-500/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto text-center max-w-3xl relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-sm font-semibold text-green-700 dark:text-green-400 mb-8">
                    ✨ AI-Powered Recycling Assistant
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-[1.1]">
                    Turn Waste into <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient">
                        Sustainable Solutions
                    </span>
                </h1>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                    Upload a photo of your recyclables. Our AI instantly identifies materials and suggests creative DIY reuse projects.
                </p>
            </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-24 -mt-10 relative z-20">
        
        {/* Upload Container */}
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700 p-6 md:p-8 max-w-4xl mx-auto"
        >
            <div className="max-w-3xl mx-auto">
                <ImageUpload images={images} setImages={setImages} />
                
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 rounded-xl text-center text-sm font-medium"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || images.length === 0}
                        className={`
                            relative group flex items-center justify-center gap-3 px-8 py-3 rounded-full text-base font-bold transition-all duration-300 overflow-hidden
                            ${loading || images.length === 0 
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                                : 'bg-green-600 text-white hover:scale-105 hover:shadow-xl hover:shadow-green-500/20 active:scale-95'}
                        `}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" /> 
                                <span>Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <span>Analyze Waste</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>

        {/* Results Section */}
        <div id="results" className="scroll-mt-32">
            <ResultsGrid 
                recommendations={results ? results.recommendations : null} 
                wasteInfo={results ? results.wasteInfo : null}
                loading={loading}
            />
        </div>

      </main>
    </div>
  );
};

export default RecycleAssessment;
