from flask import Flask, request, jsonify
import subprocess
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/scrape', methods=['POST'])
def scrape():
    data = request.json
    if 'url' not in data:
        return jsonify({'error': 'No URL provided'}), 400
    
    # Inputted URL
    url = data['url']
    
    # Running subprocess and capture output
    process = subprocess.run(
        ['python', 'scraper.py', url],  # Pass the URL to the scraper script
        capture_output=True, text=True
    )
    
    # Log error if subprocess fails
    if process.returncode != 0:
        print("Subprocess failed with error:", process.stderr)
        return jsonify({'error': 'Scraping failed', 'details': process.stderr}), 500
    
    # Read results
    try:
        with open('emails.json', 'r') as f:
            emails = json.load(f)
    except FileNotFoundError:
        return jsonify({'error': 'Emails file not found'}), 500
    except json.JSONDecodeError:
        return jsonify({'error': 'Error decoding JSON'}), 500
    
    return jsonify({'emails': emails})  # Return extracted emails

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=3000)  # reminder : don't give away ur ip charles
