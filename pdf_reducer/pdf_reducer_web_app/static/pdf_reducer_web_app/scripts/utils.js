/**
 * @todo input field is always valid due to framework issues
 * @todo check chrome's input validation scheme
 */

(function (globals) {
    /**
     * Validate if the selected file is in pdf format superficially
     * @param {String} fileName name of the input file
     */
    function validateFile(fileName) {
        var extensionName = fileName.split(".").slice(-1)[0];
        if (extensionName !== "pdf") {
            $("#upload-btn").text("Please upload pdf files");
            $("#upload-btn").addClass("disabled");
        } else {
            $("#upload-btn").text("Upload");
            $("#upload-btn").removeClass("disabled");
        }
    }

    var isFileReady = false;            //if a file has been selected
    var dropArea = document.getElementById("drop-area");
    var serverAddr = "/test_upload";
    var fileInputName = "file_input";
    var pathInputName = "path_name";
    var tokenName = "csrfmiddlewaretoken";
    var uploadFile;

    $("#drop-area").on("dragover", function (ev) {
        ev.preventDefault();
        $("#drop-area").removeClass("drop-non-active");
        $("#drop-area").addClass("drop-active");
    });

    $("#drop-area").on("dragleave", function (ev) {
        $("#drop-area").removeClass("drop-active");
        $("#drop-area").addClass("drop-non-active");
    });

    $("#drop-area").on("drop", function (ev) {
        ev.preventDefault();
        var file = ev.originalEvent.dataTransfer.files[0];
        validateFile(file.name);
        $("#drop-area").removeClass("drop-active");
        $("#drop-area").addClass("drop-non-active");
        $("#path-name").addClass("valid");
        $("#path-name").val(file.name);
        uploadFile = file;
    });

    $("#file-input").change(function (ev) {
        validateFile(ev.target.value);
        uploadFile = ev.target.files[0];
    });

    $("#upload-btn").click(function (ev) { 
        ev.preventDefault();
       /*
        *drop and upload events:
        1.create a function wise global variable to store form data
        2.create a function wise variable to store file data
        3.let html5 file input and drop event do its own thing
       */ 
       var uploadData = new FormData();
       uploadData.set(pathInputName, uploadFile.name);
       uploadData.set(fileInputName, uploadFile);
       uploadData.set(tokenName, $("[name='csrfmiddlewaretoken']").val());
       $.ajax({
           type: "POST",
           url: serverAddr ,
           data: uploadData,
           processData: false,  //prevent jquery from messing with data
           contentType: false,  //prevent jquery from messing with boundary
           success: function (response) {
               $("#download").css("visibility", "visible").attr("href", response);
           }
       });
    });
})(this);
