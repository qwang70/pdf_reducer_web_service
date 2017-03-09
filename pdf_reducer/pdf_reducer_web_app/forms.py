from django import forms


class UploadForm(forms.Form):
    file_input = forms.FileField(required=False)
    file_input.widget = forms.FileInput(
        attrs={'id': 'file-input', 'accept': '.pdf', 'multiple': True})
    path_name = forms.CharField(required=False)
    path_name.widget = forms.TextInput(
        attrs={'id': 'path-name', 'class': 'file-path validate'})
