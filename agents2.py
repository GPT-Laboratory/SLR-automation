# agents2.py
import requests
import json
import os
key = os.getenv("API-KEY")
api_key = key
def extract_search_string(content):
    possible_operators = ['AND', 'OR', 'NOT', '"']
    for line in content.split('\n'):
        if any(op in line for op in possible_operators):
            return line
    return content
def generate_search_string_with_gpt(objective, research_questions):
   
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    # Removed the explicit instruction for logical operators
    combined_prompt = f"Given the research objective: '{objective}', and the following research questions: {', '.join(research_questions)}, generate two concise search string for identifying relevant literature for literature review.Do not include AND, OR and where AND is needed add OR."
    data = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": combined_prompt}
        ],
        "temperature": 0.7
    }
    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, data=json.dumps(data))
    if response.status_code == 200:
        result = response.json()
        content = result['choices'][0]['message']['content']
        search_string = extract_search_string(content)
        return search_string.strip()
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return "An error occurred while generating the search string."