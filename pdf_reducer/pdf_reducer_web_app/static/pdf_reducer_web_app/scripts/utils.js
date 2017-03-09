/**
 * @todo check chrome's input validation scheme
 * @todo merge and reduce button
 * @todo multiple files
 * @todo add files
 * @todo remove files
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
    var serverAddr = "";
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
            url: serverAddr,
            data: uploadData,
            processData: false,  //prevent jquery from messing with data
            contentType: false,  //prevent jquery from messing with boundary
            success: function (response) {
                $("#download").css("visibility", "visible").attr("href", response);
            }
        });
    });

    /***********************************************/
    $("#FOB").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        fileDialog({ multiple: true, accept: ".pdf" })
            .then(files => {
                for (var i = 0; i < files.length; i++) {
                    //append new item to the collection
                    var li = $("<li>", { class: "collection-item" }).data("file-name", files[i])
                    var div = $("<div>").text(files[i].name);
                    var decor = $("<a>", { href: "", class: "secondary-content" });
                    var icon = $("<i>", { class: "material-icons", "data-list-item": li }).text("delete").data("list-item", li);
                    li.append(div.append(decor.append(icon)));
                    $("#file-list").append(li);
                    console.log("file appended")
                }
            })
    });

    $("#file-list").delegate("i.material-icons", "click", function (e) {
        debugger;
        e.preventDefault();
        e.stopPropagation();
        $(e.target).data("list-item").remove();
    })


})(this);
