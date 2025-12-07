#!/usr/bin/env python3
"""
Compare old and new faculty pages to find missing content
"""

import os
from difflib import SequenceMatcher

FACULTY = ['chinmaya', 'chaitanya', 'prasanna', 'surya', 'prasad', 'omkar', 'kerala', 'naresh']

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read().lower()

def similarity(a, b):
    return SequenceMatcher(None, a, b).ratio()

def main():
    print("Content Comparison Report")
    print("=" * 70)
    
    for name in FACULTY:
        old_file = f'team/{name}_old_content.txt'
        new_file = f'team/{name}.html'
        
        if not os.path.exists(old_file):
            print(f"\n{name}: Old content file not found")
            continue
            
        old_content = read_file(old_file)
        new_content = read_file(new_file)
        
        # Calculate similarity
        sim = similarity(old_content, new_content) * 100
        
        print(f"\n{name.upper()}")
        print(f"  Old content: {len(old_content):,} chars")
        print(f"  New content: {len(new_content):,} chars")
        print(f"  Difference: {len(new_content) - len(old_content):+,} chars")
        print(f"  Similarity: {sim:.1f}%")
        
        # Check for key sections in old content
        sections = {
            'educational': 'educational' in old_content or 'education' in old_content,
            'occupation': 'occupation' in old_content or 'assignment' in old_content,
            'experience': 'experience' in old_content,
            'specialization': 'special' in old_content,
            'awards': 'award' in old_content or 'felicitation' in old_content,
            'parayanam': 'parayanam' in old_content,
            'publications': 'publication' in old_content or 'literary' in old_content,
        }
        
        new_sections = {
            'educational': 'educational' in new_content or 'education' in new_content,
            'occupation': 'occupation' in new_content or 'assignment' in new_content,
            'experience': 'experience' in new_content,
            'specialization': 'special' in new_content,
            'awards': 'award' in new_content or 'felicitation' in new_content,
            'parayanam': 'parayanam' in new_content,
            'publications': 'publication' in new_content or 'literary' in new_content,
        }
        
        missing = []
        for section, exists in sections.items():
            if exists and not new_sections[section]:
                missing.append(section)
        
        if missing:
            print(f"  ⚠️  Missing sections: {', '.join(missing)}")
        else:
            print(f"  ✓ All sections present")

if __name__ == '__main__':
    main()
