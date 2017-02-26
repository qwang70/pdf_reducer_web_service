from pdf_reducer import reduceFile
from pdf_reducer import mergeFile 

@app.route('/quickreduce', methods=['GET', 'POST'])
def quickreduce():
    file_path = get_file()
    url = reduceFile(fp) 
    return redern_template(...)

@app.route('/uploads/<path:filename>')
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename, as_attachment=True)
