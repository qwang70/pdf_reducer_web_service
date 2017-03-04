"""
Service functions for the web app.
"""

from django.core.files import File
from django.conf import settings
from io import FileIO as file
import sys
import difflib
from .utilities.PyPDF2 import PdfFileReader, PdfFileWriter


def dummy_service(request):
    '''

    HACK: file size is not really calculated
    HACK: the path to the file is manually set to be MEDIA_ROOT
    TODO: each file name should be different
    '''
    file_name = 'test_file.pdf'
    path_to_file = 'media/'
    with open(path_to_file + file_name, 'wb') as in_file:
        myfile = File(in_file)
        for chunk in request.FILES['file_input'].chunks():
            myfile.write(chunk)
    # chreate the download link for the file
    link = settings.MEDIA_URL + file_name
    return link


def pdf_reduce(request):
    '''
    Reduce the pdf file from `django.http.HttpRequest`.

    It returns a link to the reduced file
    '''
    file_name = 'test_file.pdf'
    path_to_file = settings.MEDIA_ROOT
    file_pointer = path_to_file + file_name
    with open(file_pointer, 'wb') as in_file:
        myfile = File(in_file)
        for chunk in request.FILES['file_input'].chunks():
            myfile.write(chunk)
    # check if file can be opened
    try:
                # read pdf with pypdf2
        pdf = PdfFileReader(file(file_pointer, 'rb'))
    except IOError:
        print("I/O error: Please input an existing pdf file")
    except:
        print("Unexpected error:", sys.exc_info()[0])
        raise
    output = PdfFileWriter()

    # rtn is the page to be outputed
    rtn = []
    idx = pdf.getNumPages() - 1
    prev = ""
    for i in range(pdf.getNumPages() - 1, -1, -1):
        page = pdf.getPage(i)
        curr = page.extractText()
        if not curr:
            if idx > i:
                rtn.append(idx)
            rtn.append(i)
            idx = i - 1
            continue
        # set the page length of last idxed page
        if len(curr) > len(prev):
            length = len(prev)
        else:
            length = len(curr)
        # calculate the similarity btw last page and curr page
        seq = difflib.SequenceMatcher(lambda x: x == " ",
                                      curr[0:length], prev[0:length])
        ratio = seq.ratio()
        # print "page is {}, ratio is {}".format(i, ratio)
        # decision making, update index
        if ratio < 0.8:
            rtn.append(idx)
            idx = i
        prev = curr
    if 0 not in rtn:
        rtn.append(0)
    # print rtn

    # backward idx to forward idx
    rtn.reverse()
    # add page numbers to output
    for i in rtn:
        curr_page = pdf.getPage(i)
        output.addPage(curr_page)

    new_file_name = file_name[0:4] + "_reduced.pdf"
    with open(path_to_file + new_file_name, 'wb') as curr_file:
        output.write(curr_file)
    return settings.MEDIA_URL + new_file_name
