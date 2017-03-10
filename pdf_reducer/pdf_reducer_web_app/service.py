"""
Service functions for the web app.
"""
# lib input django 
from django.core.files import File
from django.conf import settings
# lib input PyPdf2
from .utilities.PyPDF2 import PdfFileReader, PdfFileWriter, PdfFileMerger
# common lib input
from io import FileIO as file
import sys
import os
import difflib
import glob
import zipfile
import random

def pdf_reduce(request):
    '''
    Reduce the pdf file from `django.http.HttpRequest`.

    It returns a link to the reduced file
    '''
    file_list = request.FILES.getlist("file-input")
    file_name = list(map(lambda x: x.name, file_list))
    random_dir = "%032x" % random.getrandbits(128)
    path_to_file = "{}{}/".format(settings.MEDIA_ROOT,random_dir)
    try:
        os.makedirs(path_to_file)
    except: 
        pass

    newfiles = reduceFile(file_list,path_to_file)

    if len(newfiles) == 1:
        return newfiles[0]
    else:
        # compress file into a tar file
        comp_fn = path_to_file + "reduced_files.zip"
        # name_zip = [(reduced_pdf_path, pdf_name)]
        name_zip = list(zip(newfiles, file_name))
        with zipfile.ZipFile(comp_fn, "w") as myzip:
            for path_fn, fn in name_zip:
                myzip.write(path_fn, arcname = fn)
    
        return comp_fn

def pdf_merge(request):
    '''
    Merge a list of pdf files from `django.http.HttpRequest`.

    It returns a link to the merged file
    '''
    file_list = request.FILES.getlist("file-input")
    file_name = list(map(lambda x: x.name, file_list))
    
    random_dir = "%032x" % random.getrandbits(128)
    path_to_file = "{}{}/".format(settings.MEDIA_ROOT,random_dir)
    try:
        os.makedirs(path_to_file)
    except: 
        pass

    merger = PdfFileMerger()
    for fp in file_list:
        print("Merging file \"{}\"...".format(fp))
        # check if file can be opened
        try:
            # read and merge pdf with pypdf2
            merger.append(PdfFileReader(fp))
        except IOError as e:
            print("I/O error: Please input an existing pdf file:", fp)
            raise
        except:
            print(fp, ": Unexpected error - ", sys.exc_info()[0])
            raise
    # TODO: need to change output path later
    newfile = path_to_file+"merged.pdf"
    merger.write(newfile)
    return newfile


def reduceFile(files, path_to_file):
    """
        input:
        fp: a list of file to reduce
        return:
        keepPage: pages to keep
    """
    newfiles = []
    for fp in files:
        print("Reducing file \"{}\"...".format(fp))
        # check if file can be opened
        try:
                    # read pdf with pypdf2
            PDF = PdfFileReader(fp)
        except IOError as e:
            print("I/O error: Please input an existing pdf file:", fp)
            raise
        except:
            print(fp, ": Unexpected error - ", sys.exc_info()[0])
            raise
        output = PdfFileWriter()

        # keepPage is the page to be outputed
        keepPage = []
        idx = PDF.getNumPages() - 1
        prev = ""
        for i in range(PDF.getNumPages() - 1, -1, -1):
            page = PDF.getPage(i)
            curr = page.extractText()
            if not curr:
                if idx > i:
                    keepPage.append(idx)
                keepPage.append(i)
                idx = i - 1
                page = PDF.getPage(idx)
                prev = page.extractText()
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
                keepPage.append(idx)
                idx = i
            prev = curr
        if 0 not in keepPage:
            keepPage.append(0)
        # print keepPage

        # backward idx to forward idx
        keepPage.reverse()
        # add page numbers to output
        for i in keepPage:
            p = PDF.getPage(i)
            output.addPage(p)

        # TODO: need to change output path later
        # rename file
        newfile = path_to_file + fp.name[0:-4] + "_reduced.pdf"
        # add file into returned filename list
        newfiles.append(newfile)
        # write file into pdf
        with open(newfile, 'wb') as f:
            output.write(f)

    return newfiles
