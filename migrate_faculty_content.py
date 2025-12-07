#!/usr/bin/env python3
"""
Script to fetch all content from old faculty pages and update new pages
"""

import requests
from bs4 import BeautifulSoup
import re

# Faculty mapping: filename -> old URL
FACULTY = {
    'chinmaya': 'https://vedavishtaram.in/team/chinmaya.html',
    'chaitanya': 'https://vedavishtaram.in/team/chaitanya.html',
    'prasanna': 'https://vedavishtaram.in/team/prasanna.html',
    'surya': 'https://vedavishtaram.in/team/surya.html',
    'prasad': 'https://vedavishtaram.in/team/prasad.html',
    'omkar': 'https://vedavishtaram.in/team/omkar.html',
    'kerala': 'https://vedavishtaram.in/team/kerala.html',
    'naresh': 'https://vedavishtaram.in/team/naresh.html',
}

def fetch_old_content(url):
    """Fetch and parse old page content"""
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract all text content
    content = {}
    
    # Get main content area
    main_content = soup.get_text(separator='\n', strip=True)
    
    return main_content

def read_new_page(filename):
    """Read current new page content"""
    with open(f'team/{filename}.html', 'r', encoding='utf-8') as f:
        return f.read()

def main():
    print("Fetching content from old pages...\n")
    
    for name, url in FACULTY.items():
        print(f"\n{'='*60}")
        print(f"Processing: {name}")
        print(f"{'='*60}")
        
        # Fetch old content
        old_content = fetch_old_content(url)
        
        # Read new content
        new_content = read_new_page(name)
        
        # Save old content to file for review
        with open(f'team/{name}_old_content.txt', 'w', encoding='utf-8') as f:
            f.write(old_content)
        
        print(f"✓ Saved old content to team/{name}_old_content.txt")
        print(f"  Old content length: {len(old_content)} chars")
        print(f"  New content length: {len(new_content)} chars")
        
        # Show first 500 chars of old content
        print(f"\nFirst 500 chars of old content:")
        print(old_content[:500])

if __name__ == '__main__':
    main()
