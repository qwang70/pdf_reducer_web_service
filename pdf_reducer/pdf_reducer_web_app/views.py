from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.generic.edit import FormView
from .forms import UploadForm
from .service import pdf_reduce
from .service import pdf_merge

# Create your views here.
def index(request):
    """return home page"""
    upload_form = UploadForm()
    return render(request, 'pdf_reducer_web_app/index.html', {'upload_form': upload_form})

def test_upload(request):
    """test if the upload works"""
    if request.method == 'POST' and len(request.FILES.getlist("file-input")) > 0:
        merge_mode = request.POST["service-mode"]
        # call function reduce or merge
        if merge_mode == 'true':
            #TODO: should have options between reduce and reduce and merge
            download_link = pdf_merge(request)

        else:
            download_link = pdf_reduce(request)

        return HttpResponse(download_link)
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
