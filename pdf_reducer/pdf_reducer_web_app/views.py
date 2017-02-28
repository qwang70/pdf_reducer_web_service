from django.shortcuts import render

# Create your views here.
def index(request):
    """return home page"""
    return render(request, 'pdf_reducer_web_app/index.html')
