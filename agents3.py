from scholarly import scholarly
import csv
from scholarly import ProxyGenerator, scholarly
import os
import requests

api_key = os.getenv('ELSEVIER_API_KEY')
# Initialize a global variable to track if the proxy setup has been done
proxy_setup_done = False

def setup_proxy():
    global proxy_setup_done
    # Check if the proxy setup has already been done
    if not proxy_setup_done:
        # Set up a ProxyGenerator object to use free proxies
        pg = ProxyGenerator()
        pg.FreeProxies()
        scholarly.use_proxy(pg)
        
        # Mark the setup as done
        proxy_setup_done = True
        print("Proxy setup completed.")
    else:
        print("Proxy setup was already completed earlier in this session.")

# Example usage
setup_proxy()




def fetch_papers(search_string, min_results=8):
    search_query = scholarly.search_pubs(search_string)
    papers_details = []
    for _ in range(min_results):
        try:
            paper = next(search_query)
            paper_details = {
                'title': paper['bib']['title'],
                'author': paper['bib'].get('author'),
                'pub_year': paper['bib'].get('pub_year'),
                'publication_url': paper.get('pub_url', 'Not Available'),
                'journal_name': paper['bib'].get('journal', 'Not Available'),
                # Attempting to extract DOI, publication date, and making an educated guess on paper type
                'doi': paper.get('doi', 'Not Available'),
                'publication_date': paper['bib'].get('pub_year', 'Not Available'), # Simplified to publication year
                'paper_type': 'Journal' if 'journal' in paper['bib'] else 'Conference' if 'conference' in paper['bib'] else 'Primary Study' # Simplistic categorization
            }
            papers_details.append(paper_details)
        except StopIteration:
            break  # Exit if there are no more results
    return papers_details


def save_papers_to_csv(papers_details, filename='papers.csv'):
    fieldnames = ['title', 'author', 'pub_year', 'publication_url', 'journal_name', 'doi', 'publication_date', 'paper_type']
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for paper in papers_details:
            writer.writerow(paper)




def search_elsevier(search_string, start_year, end_year, limit):
    
    url = "https://api.elsevier.com/content/search/scopus"
    headers = {
        "X-ELS-APIKey": api_key,
        "Accept": "application/json"
    }
    
    query = f"TITLE-ABS-KEY({search_string}) AND PUBYEAR = {start_year}"
    params = {
        "query": query,
        "count": limit,
    }
    

    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        response_data = response.json()
        papers = response_data.get('search-results', {}).get('entry', [])
        parsed_papers = []
        for paper in papers:
            parsed_paper = {
                "affiliation-country": next((affil.get("affiliation-country", "Not Available") for affil in paper.get("affiliation", [])), "Not Available"),
                "affilname": next((affil.get("affilname", "Not Available") for affil in paper.get("affiliation", [])), "Not Available"),
                "creator": paper.get("dc:creator", "Not Available"),
                "identifier": paper.get("dc:identifier", "Not Available"),
                "title": paper.get("dc:title", "Not Available"),
                "link": next((link["@href"] for link in paper.get("link", []) if link["@ref"] == "scopus"), "Not Available"),
                "year": paper.get("prism:coverDate", "Not Available").split("-")[0],
                "openaccess": paper.get("openaccess", "0") == "1",
                "publicationName": paper.get("prism:publicationName", "Not Available"),
                "aggregationType": paper.get("prism:aggregationType", "Not Available"),
                "volume": paper.get("prism:volume", "Not Available"),
                "doi": paper.get("prism:doi", "Not Available")
            }
            parsed_papers.append(parsed_paper)
        return parsed_papers
    else:
        print(f"Failed to fetch papers: {response.status_code} {response.text}")
        return {"error": "Failed to fetch papers from Elsevier", "status_code": response.status_code, "message": response.text}