import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Editions = () => {
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/editions'); // Update the URL to match the backend
        setEditions(response.data);
        setLoading(false);
        console.log('Fetched editions successfully:', response.data);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error('Error fetching editions:', err.message, err.stack);
      }
    };

    fetchEditions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Editions Page</h2>
      <p>Here you can see all the editions.</p>
      <ul>
        {editions.map((edition) => (
          <li key={edition.id}>
            <Link to={`/editions/${edition.id}`}>{edition.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Editions;