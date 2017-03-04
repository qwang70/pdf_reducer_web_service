from django.shortcuts import render
from .forms import UploadForm
from .service import pdf_reduce
from django.http import HttpResponse

# Create your views here.
def index(request):
    """return home page"""
    upload_form = UploadForm()
    return render(request, 'pdf_reducer_web_app/index.html', {'upload_form': upload_form})

def test_upload(request):
    """test if the upload works"""
    if request.method == 'POST':
        link = pdf_reduce(request)
    return HttpResponse(link)
