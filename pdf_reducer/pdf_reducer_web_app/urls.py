from django.conf.urls import url

from . import views

app_name ='pdf_reducer'
urlpatterns = [
    url(r'^$', views.FileUploadView.as_view(), name="index"),
    url(r'^test_upload', views.test_upload, name="test_upload")
]
