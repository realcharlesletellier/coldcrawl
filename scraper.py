import re
import json
import sys
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

if len(sys.argv) < 2:
    raise ValueError("No URL provided. Please pass a URL as a command-line argument.")

# Extract URL from cmd
url = sys.argv[1]

chrome_options = Options()
chrome_options.add_argument("--headless")

service = Service(executable_path="chromedriver.exe")
driver = webdriver.Chrome(service=service, options=chrome_options)

driver.get(url)
time.sleep(5)

# Get HTML
page_source = driver.page_source

# Regex to find email addresses
email_pattern = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"

# Find all addresses HTML
emails_found = re.findall(email_pattern, page_source)

# Set to remove duplicates
unique_emails = set(emails_found)

# Only unique emails accepted
with open("emails.json", "w") as f:
    json.dump(list(unique_emails), f, indent=2)

driver.quit()
