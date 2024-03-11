from dotenv import load_dotenv
import os
import tempfile
from flask import Flask, render_template,send_file, send_from_directory, request, jsonify
import datetime
from agents import generate_research_questions_and_purpose_with_gpt, generate_abstract_with_openai, generate_summary_conclusion, generate_introduction_summary_with_openai
import json
from agents2 import generate_search_string_with_gpt
from agents3 import fetch_papers, save_papers_to_csv, search_elsevier
from agents4 import filter_papers_with_gpt_turbo, generate_response_gpt4_turbo
from flask_cors import CORS
import requests
from datetime import datetime

load_dotenv()
# x = datetime.datetime.now()

key = os.getenv("ELSEVIER_API_KEY")

app = Flask(__name__, static_folder='dist')
CORS(app)
@app.route('/api/generate_search_string', methods=['POST'])
def generate_search_string_route():
    data = request.json
    objective = data.get('objective')
    research_questions = data.get('research_questions', [])  # Default to an empty list if not provided

    if not objective or not research_questions:
        return jsonify({"error": "Objective and research questions are required."}), 400

    search_string = generate_search_string_with_gpt(objective, research_questions)
    return jsonify({"search_string": search_string})
@app.route('/api/generate_research_questions_and_purpose', methods=['POST'])

def generate_research_questions_and_purpose():
    print("request:", request.method)
    data = request.json
    objective = data.get('objective')
    num_questions = int(data.get('num_questions', 1))  # Ensure num_questions is treated as an integer

    # Validate input
    if not objective:
        return jsonify({"error": "Objective is required"}), 400
    if num_questions < 1:
        return jsonify({"error": "Number of questions must be at least 1"}), 400

    questions_and_purposes = generate_research_questions_and_purpose_with_gpt(objective, num_questions)
    print(questions_and_purposes)
    return jsonify({"research_questions": questions_and_purposes})


# Agent 4 

@app.route('/api/filter_papers', methods=['POST'])
def filter_papers_route():
    data = request.json
    search_string = data.get('search_string', '')
    papers = data.get('papers', [])  # Expecting only titles in papers
    
    filtered_papers = filter_papers_with_gpt_turbo(search_string, papers)
    return jsonify({"filtered_papers": filtered_papers})


@app.route('/api/answer_question', methods=['POST'])
def answer_question():
    data = request.json
    questions = data.get('questions')  # This should now be a list of questions
    papers_info = data.get('papers_info', [])
 
    if not questions or not papers_info:
        return jsonify({"error": "Both questions and papers information are required."}), 400
    
    answers = []
    for question in questions:
        answer = generate_response_gpt4_turbo(question, papers_info)
        answers.append({"question": question, "answer": answer})
    
    return jsonify({"answers": answers})


@app.route('/api/generate-summary-abstract', methods=['POST'])
def generate_summary_abstract():
    try:
        data = request.json
        
        research_questions = data.get('research_questions', 'No research questions provided.')
        objective = data.get('objective', 'No objective provided.')
        search_string = data.get('search_string', 'No search string provided.')

        # Constructing the prompt for AI abstract generation
        prompt = f"Based on the research questions '{research_questions}', the objective '{objective}', and the search string '{search_string}', generate a comprehensive abstract."

        # Generate the abstract using OpenAI's GPT model
        summary_abstract = generate_abstract_with_openai(prompt)

        return jsonify({"summary_abstract": summary_abstract})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/generate-summary-conclusion", methods=["POST"])
def generate_summary_conclusion_route():
    data = request.json
    papers_info = data.get("papers_info", [])
    try:
        summary_conclusion = generate_summary_conclusion(papers_info)
        return jsonify({"summary_conclusion": summary_conclusion})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-introduction-summary', methods=['POST'])
def generate_introduction_summary():
    try:
        data = request.json
        total_papers = len(data.get("all_papers", []))
        filtered_papers_count = len(data.get("filtered_papers", []))
        research_questions = data.get("research_questions", [])
        objective = data.get("objective", "")
        search_string = data.get("search_string", "")
        answers = data.get("answers", [])

        # Constructing the introduction based on the provided data
        prompt_intro = f"This document synthesizes findings from {total_papers} papers related to \"{search_string}\". Specifically, {filtered_papers_count} papers were thoroughly examined. The primary objective is {objective}."
        
        prompt_questions = "\n\nResearch Questions:\n" + "\n".join([f"- {q}" for q in research_questions])
        
        prompt_answers = "\n\nSummary of Findings:\n" + "\n".join([f"- {ans['question']}: {ans['answer'][:250]}..." for ans in answers])  # Brief summary of answers
        
        prompt = prompt_intro + prompt_questions + prompt_answers + "\n\nGenerate a coherent introduction and summary based on this compilation."

        # Generating the introduction summary using OpenAI's GPT model
        introduction_summary = generate_introduction_summary_with_openai(prompt)

        return jsonify({"introduction_summary": introduction_summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/generate-summary-all", methods=["POST"])
def generate_summary_all_route():
    data = request.json
    abstract_summary = data.get("abstract_summary", "")
    intro_summary = data.get("intro_summary", "")  # Corrected key to "intro_summary"
    conclusion_summary = data.get("conclusion_summary", "")  # Corrected key to "conclusion_summary"

    try:
        # Assuming you have a LaTeX template named 'latex_template.tex' in the 'templates' folder
        print("inside")
        latex_content = render_template(
            "latex_template.tex",
            abstract=abstract_summary,
            introduction=intro_summary,
            conclusion=conclusion_summary,
        )

        # Save the LaTeX content to a file in the same directory as this script
        current_time = datetime.now().strftime('%Y%m%d%H%M%S')
        milliseconds = datetime.now().microsecond // 1000
        file_path = os.path.join(os.path.dirname(__file__), f"{current_time}_{milliseconds}summary.tex")
        print(file_path)
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(latex_content)
        with tempfile.NamedTemporaryFile(mode='w+', suffix='.tex', delete=False, encoding='utf-8') as temp_file:
            temp_file.write(latex_content)
            temp_file_path = temp_file.name
        return send_file(temp_file_path, as_attachment=True, download_name='paper_summary.tex')
        # return jsonify({"latex_file_path": file_path})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# # Route for serving static files (like manifest.json)
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')
@app.route('/<path:path>')
def serve(path):
    print("filename:", app.static_folder+ "/" + path)
    if path != "" and os.path.exists(app.static_folder+ "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
    # return send_from_directory('templates/static/', filename)
# # Route for rendering the React app
# @app.route('/')
# def index():
#     print("calling")
#     return render_template('index.html')





@app.route('/api/search_papers', methods=['POST'])
def search_papers():
    data = request.json
    search_string = data.get('search_string', '')
    start_year = data.get('start_year', '')
    end_year = data.get('end_year', '')
    limit = data.get('limit', 4)  # Default limit to 10 papers if not specified
    
    if not search_string or not start_year:
        return jsonify({'error': 'Search string and start year are required.'}), 400
    
    results = search_elsevier(search_string, start_year, end_year, limit)
    return jsonify(results)

# Running app
if __name__ == '__main__':
    app.run(debug=True)
