import difflib
import glob
import sys
import argparse
from io import FileIO as file
from PyPDF2 import PdfFileWriter, PdfFileReader, PdfFileMerger

def mergeFile(files):
    """
        input:
        files: a list of file to merge
    """
    merger = PdfFileMerger()
    for f in (files):
		# check if file can be opened
        try:
			# read and merge pdf with pypdf2
            merger.append(PdfFileReader(file(f, 'rb')))
        except IOError as e:
            print ("I/O error: Please input an existing pdf file")
        except:
            print ("Unexpected error:", sys.exc_info()[0])
            raise
    #TODO: need to change output path later
    merger.write("output/output.pdf")

def reduceFile(fp):
    """
        input:
        fp: a file to reduce
    """
    # check if file can be opened
    try:
		# read pdf with pypdf2
        PDF = PdfFileReader(file(fp, 'rb'))
    except IOError as e:
        print ("I/O error: Please input an existing pdf file")
    except:
        print ("Unexpected error:", sys.exc_info()[0])
        raise
    output = PdfFileWriter()

    # rtn is the page to be outputed
    rtn = []
    idx = PDF.getNumPages()-1
    prev = ""
    for i in range(PDF.getNumPages()-1,-1,-1):
        page = PDF.getPage(i)
        curr =  page.extractText()
        if not curr:
            if idx > i:
                rtn.append(idx)
            rtn.append(i)
            idx = i - 1
            continue
        # set the page length of last idxed page
        if len(curr)>len(prev):
            length = len(prev)
        else:
            length = len(curr)
        # calculate the similarity btw last page and curr page
        seq=difflib.SequenceMatcher(lambda x: x == " ",
                curr[0:length], prev[0:length])
        ratio = seq.ratio()
        # print "page is {}, ratio is {}".format(i, ratio)
        # decision making, update index
        if(ratio<0.8):
            rtn.append(idx)
            idx = i
        prev = curr
    if 0 not in rtn:
        rtn.append(0)
    #print rtn 

    # backward idx to forward idx
    rtn.reverse()
    # add page numbers to output
    for i in rtn:
        p = PDF.getPage(i)
        output.addPage(p)

    #TODO: need to change output path later
    newfile = fp[0:-4]+"_reduced.pdf"
    with open(newfile, 'wb') as f:
       output.write(f)

def main():
    # input checking and utility
    parser = argparse.ArgumentParser(description='Reduce duplicated PDF pages')
    parser.add_argument('-m', '--merge',action='store_true',help='merge PDF files')
    parser.add_argument('filenames',type=str, nargs='+',
                    help='PDF files to be reduced or merged')
    args = parser.parse_args()
    # list of files
    files = []
    for i in args.filenames:
        files = files + glob.glob(i)

    # merge
    if args.merge:
        mergeFile(files);
    else:
        for a_file in files:
            reduceFile(a_file);

if __name__ == '__main__':
    main()

