'use client';
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa'; 

const EmailExtractor = () => {
  // Define the types for the state variables
  const [urls, setUrls] = useState<string[]>(['']); // Array of strings for URLs
  const [emails, setEmails] = useState<string[]>([]); // Array of strings for emails
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to send the URLs to the Flask server and get the emails
  const fetchEmails = async () => {
    setLoading(true); // Indicate that the scraping process is ongoing
    setError(null);   // Reset the error state

    try {
      // Temporary set for unique emails to avoid duplicates
      const tempEmails: string[] = [];

      for (const url of urls) {
        const response = await fetch('http://192.168.4.29:3000/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }), 
        });

        if (response.ok) {
          const data = await response.json();
          tempEmails.push(...data.emails); // Add emails to temporary array
        } else {
          throw new Error('Failed to scrape the website.');
        }
      }

      // Set the state with a unique list of emails
      setEmails(Array.from(new Set(tempEmails)));
    } catch (error:any) {
      setError(error.message); // Set the error state if an error occurs
    }

    setLoading(false); // Reset the loading state after completion
  };

  // Function to add a new URL input field
  const addUrlField = () => {
    setUrls([...urls, '']); // Add a new empty string to the list of URLs
  };

  // Function to update the URL at a specific index
  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="https://media.istockphoto.com/id/177131518/photo/ice-cubes.jpg?s=612x612&w=0&k=20&c=pUWWdEDWq_nFigrfEfMM0e7ikjaYSOi8EGedHJZqZCU="
          className="max-w-sm rounded-lg shadow-2xl"
        />
        <div>
          <h1 className="text-5xl font-bold">Cold Crawl (bad name)</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a
            id nisi.
          </p>

          <div className="relative">
            {urls.map((url, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder="Paste Website URL"
                  className="input input-bordered"
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                />
                {index === urls.length - 1 && (
                  <button
                    className="btn btn-outline ml-2"
                    onClick={addUrlField} 
                  >
                    <FaPlus /> {/* reminder : this is the plus icon */}
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            className="btn btn-primary"
            onClick={fetchEmails}
            disabled={loading}
          >
            {loading ? 'Scraping...' : 'Extract Emails'}
          </button>

          {error && <p className="error">{error}</p>}

          {emails.length > 0 && (
            <div className="emails-list">
              <h2>Extracted Emails:</h2>
              <ul>
                {emails.map((email, index) => (
                  <li key={index}>{email}</li> // Display extracted emails
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailExtractor;
