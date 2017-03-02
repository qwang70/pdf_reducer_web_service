"""
service functions in the web app
"""
from pdb import set_trace
from django.core.files import File

def dummy_service(request):
    '''
    HACK: file size is not really calculated
    '''
    with open('upload.pdf', 'wb') as f:
        myfile = File(f)
        for chunk in request.FILES['file_input'].chunks():
            myfile.write(chunk)
