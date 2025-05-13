import React from 'react';

const ProjectPage = () => {
    // This is a placeholder for your projects data
    const projects = [
        {
            title: "Portfolio Universe",
            description: "A space-themed portfolio website built with React",
            technologies: ["React", "JavaScript", "Tailwind CSS"],
            githubUrl: "https://github.com/adrian1131/portfolio-universe",
            liveUrl: null
        },
        // Add more projects here as needed
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">My Projects</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <h2 className="text-2xl font-semibold mb-4">{project.title}</h2>
                        <p className="text-gray-600 mb-4">{project.description}</p>
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Technologies Used:</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech, techIndex) => (
                                    <span 
                                        key={techIndex}
                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    GitHub
                                </a>
                            )}
                            {project.liveUrl && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    Live Demo
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectPage;
