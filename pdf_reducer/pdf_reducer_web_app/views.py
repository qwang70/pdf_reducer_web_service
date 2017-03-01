from django.shortcuts import render
from .forms import UploadForm

# Create your views here.
def index(request):
    """return home page"""
    upload_form = UploadForm() 
    return render(request, 'pdf_reducer_web_app/index.html', {'upload_form': upload_form})
