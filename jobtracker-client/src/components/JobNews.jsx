import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/JobNews.css';

function JobNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobNews();
  }, []);

  const fetchJobNews = async () => {
    try {
      // Using NewsAPI - Get your free API key from https://newsapi.org/
      const API_KEY = '6e8b9acb35eb4706a74c94fba06e88c7'; // Replace with your API key
      
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=job+market+OR+employment+OR+hiring+trends&sortBy=publishedAt&language=en&pageSize=5&apiKey=${API_KEY}`
      );
      
      setNews(response.data.articles);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching job news:', err);
      setError('Unable to load news at the moment');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="job-news-container">
        <h3 className="news-title">📰 Job Market News</h3>
        <p className="loading-text">Loading latest news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-news-container">
        <h3 className="news-title">📰 Job Market News</h3>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="job-news-container">
      <h3 className="news-title">📰 Job Market News</h3>
      
      <div className="news-list">
        {news.slice(0, 5).map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="news-item"
          >
            <div className="news-content">
              <h4 className="news-headline">{article.title}</h4>
              <p className="news-source">
                {article.source.name} · {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
            {article.urlToImage && (
              <img 
                src={article.urlToImage} 
                alt={article.title}
                className="news-thumbnail"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
          </a>
        ))}
      </div>

      <button 
        className="refresh-button"
        onClick={fetchJobNews}
      >
        🔄 Refresh News
      </button>
    </div>
  );
}

export default JobNews;