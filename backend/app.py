from flask import Flask, request, jsonify
from flask_cors import CORS
from code_refactor.converter import Python2to3Converter

app = Flask(__name__)
CORS(app)

@app.route('/convert', methods=['POST'])
def convert_code():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Read the file content
        content = file.read().decode('utf-8')
        
        # Convert the code
        converter = Python2to3Converter()
        converted_code = converter.convert_source(content)
        
        return jsonify({
            'converted_code': converted_code
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 