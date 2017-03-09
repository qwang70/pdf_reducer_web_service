from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.generic.edit import FormView
from .forms import UploadForm
from .service import pdf_reduce

# Create your views here.
def index(request):
    """return home page"""
    upload_form = UploadForm()
    return render(request, 'pdf_reducer_web_app/index.html', {'upload_form': upload_form})

def test_upload(request):
    """test if the upload works"""
    if request.method == 'POST':
        #put your function here
        pass
    return HttpResponse()

class FileUploadView(FormView):
    '''
    TODO form validation
    '''
    form_class = UploadForm
    template_name = 'pdf_reducer_web_app/index.html'

    def form_valid(self, form):
        link = pdf_reduce(self.request)
        data = {'download-url': link}
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        files = request.FILES.getlist('file_input')
        service_method = request.POST['service-method']
        if service_method == "reduce_and_merge":
            pass
        elif service_method == "reduce":
            pass
