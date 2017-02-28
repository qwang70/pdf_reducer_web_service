/**
 * @todo input field is always valid due to framework issues
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

    /**
     * @param {Event} ev submit event
     */
    function uploadToServer(ev) {
        event.preventDefault();
        if (isFileSelected) {
            //upload the file to the server
        }
    }
    var isFileReady = false;            //if a file has been selected
    var dropArea = document.getElementById("drop-area");
    var serverAddr = "www.pdfreducer.me";

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
        var file = ev.dataTransfer.files[0];
        validateFile(file.name);
        $("#drop-area").removeClass("drop-active");
        $("#drop-area").addClass("drop-non-active");
        $("#path-name").addClass("valid");
        $("#path-name").val(file.name);
    });

    $("#file-input").change(function (ev) {
        validateFile(ev.target.value);
    });

    $("#upload-btn").click(function (ev) { 
        ev.preventDefault();
        alert("王启雯我们来两发吧")
    });
})(this);
