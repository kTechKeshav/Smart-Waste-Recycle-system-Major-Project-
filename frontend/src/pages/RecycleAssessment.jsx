import ImageUpload from '../components/ImageUpload';
import ResultsGrid from '../components/ResultsGrid';
import ThemeToggle from '../components/ThemeToggle';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import axios from 'axios';

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
    setResults(null);

    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });

    try {
      const port = 4000; 
      const response = await axios.post(`http://localhost:${port}/api/recycle/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setResults({
            recommendations: response.data.recommendations,
            wasteInfo: response.data.waste_info
        });
        // Scroll to results
        setTimeout(() => {
            document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-outfit">
      
      {/* Navbar / Header */}
      <nav className="absolute top-0 w-full p-4 flex justify-between items-center z-50">
          <div className="font-bold text-xl text-white tracking-wider">ScrapSmart</div>
          <ThemeToggle />
      </nav>

      {/* Hero Section */}
      {/* UI FIX: Added 'pb-32' to extend background, removed 'mb-8' */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-800 text-white py-20 pb-32 px-4 rounded-b-[3rem] shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="container mx-auto relative z-10 text-center max-w-3xl">
            <motion.h1 
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
            >
                Give Waste a <span className="text-yellow-300 inline-block transform hover:scale-105 transition-transform">New Life</span>
            </motion.h1>
            <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl opacity-90 leading-relaxed"
            >
                Upload photos of your recyclables and get instant AI-powered DIY projects and reuse guides.
            </motion.p>
        </div>
      </div>

      {/* UI FIX: Added '-mt-24' and 'relative z-10' to pull card up over the green background */}
      <div className="container mx-auto px-4 -mt-24 relative z-10 pb-20 space-y-12">
        
        {/* Upload Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-100 dark:border-gray-700"
        >
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-700 dark:text-gray-200">Start Assessment</h2>
            <ImageUpload images={images} setImages={setImages} />
            
            {error && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-center rounded-lg border border-red-100 dark:border-red-800 text-sm font-medium"
                >
                    {error}
                </motion.div>
            )}

            <div className="mt-8 flex justify-center">
                <button
                    onClick={handleAnalyze}
                    disabled={loading || images.length === 0}
                    className={`
                        group flex items-center gap-3 px-10 py-4 rounded-full text-lg font-bold shadow-lg transform transition-all
                        ${loading || images.length === 0 
                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-500 text-white hover:scale-105 active:scale-95 hover:shadow-green-500/30'}
                    `}
                >
                    {loading ? (
                          <>
                             <Loader2 className="animate-spin" /> Analyzing...
                          </>
                    ) : (
                          "Analyze Waste"
                    )}
                </button>
            </div>
        </motion.div>

        {/* Results Section */}
        <div id="results">
            {results && <ResultsGrid recommendations={results.recommendations} wasteInfo={results.wasteInfo} />}
        </div>

      </div>
    </div>
  );
};

export default RecycleAssessment;