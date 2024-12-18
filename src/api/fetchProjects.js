const fetchGitHubProjects = async () => {
    const response = await fetch(
      'https://api.github.com/users/Adrian1131/repos'
    );
    const data = await response.json();
    return data;
  };