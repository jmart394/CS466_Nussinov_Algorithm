from flask import Flask, request, jsonify, render_template
from nussinov_algorithm import * 

app = Flask(__name__)

@app.route('/')
def index():
    # Display the main web page with the control buttons
    return render_template('index.html')
@app.route("/nussinov", methods=["POST"])
def run_nussinov():
    try:
        data = request.get_json()
        sequence = data["sequence"]

        # Run the Nussinov algorithm
        dp, structure, visited_cells = nussinov_algorithm(sequence)

        return jsonify({
            "dp_table": dp,
            "visited_cells": visited_cells,
            "structure": structure
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
