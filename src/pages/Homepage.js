import React, { useState, useEffect } from 'react';
import { planetData } from '../components/cardsData';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Homepage = () => {
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPlanets, setFilteredPlanets] = useState(planetData);

    // Filter planets based on search
    useEffect(() => {
        const filtered = Object.entries(planetData).reduce((acc, [key, data]) => {
            if (data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                data.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                acc[key] = data;
            }
            return acc;
        }, {});
        setFilteredPlanets(filtered);
    }, [searchTerm]);

    // Intersection Observer hook for scroll animations
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            {/* Hero Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative py-20 px-4 text-center"
            >
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Welcome to My Universe
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    Explore the planets to discover my journey, skills, and aspirations in the tech universe
                </p>
                
                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-12">
                    <input
                        type="text"
                        placeholder="Search planets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-400"
                    />
                </div>
            </motion.div>

            {/* Planets Grid */}
            <motion.div
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="container mx-auto px-4 py-8"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(filteredPlanets).map(([planet, data]) => (
                        <motion.div
                            key={planet}
                            variants={itemVariants}
                            whileHover={{ 
                                scale: 1.03,
                                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
                            }}
                            className="relative group bg-gray-800 rounded-xl overflow-hidden backdrop-blur-lg bg-opacity-50 border border-gray-700 hover:border-purple-500 transition-all duration-300"
                        >
                            {/* Planet Card Content */}
                            <div className="p-6">
                                <motion.h2 
                                    className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    {data.title}
                                </motion.h2>
                                <p className="text-gray-300 mb-6 whitespace-pre-line leading-relaxed">
                                    {data.description}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {data.links.map((link, index) => (
                                        <motion.a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300"
                                        >
                                            {link.text}
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* Hover Effect Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>
                    ))}
                </div>

                {/* No Results Message */}
                <AnimatePresence>
                    {Object.keys(filteredPlanets).length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center py-12"
                        >
                            <p className="text-xl text-gray-400">No planets found matching your search.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Homepage;
