/**
 * @todo merge and reduce button
 * @todo remove files
 * @todo fileDialog is buggy ==
 */

(function (globals) {
    var isFileReady = false;            //if a file has been selected
    var dropArea = document.getElementById("drop-area");
    var serverAddr = "test_upload";
    var fileInputName = "file_input";
    var pathInputName = "path_name";
    var tokenName = "csrfmiddlewaretoken";
    var uploadFile;
    var preloader = "<div class='preloader-wrapper tiny active'>" +
        "<div class='spinner-layer spinner-green-only'>" +
        "<div class='circle-clipper left'>" +
        "<div class='circle'></div>" +
        "</div><div class='gap-patch'>" +
        "<div class='circle'></div>" +
        "</div><div class='circle-clipper right'>" +
        "<div class='circle'></div>" +
        "</div>" +
        "</div>" +
        "</div>"

    /**
    * Update the contents in the main area
    * @function updateContents
    * @param  {FileList} files {FileList to be appended}
    */
    function updateContents(files) {
        for (var i = 0; i < files.length; i++) {
            //append new item to the collection
            var extension = files[i].name.split(".").splice(-1)[0];
            if (extension == "pdf") {
                var li = $("<li>", { class: "collection-item" })
                    .data("file-content", files[i])
                var div = $("<div>").text(files[i].name);
                var decor = $("<a>", { href: "", class: "secondary-content" });
                var delIcon = $("<i>", {
                    class: "material-icons small del-btn",
                    "data-list-item": li
                }).text("delete").data("list-item", li);
                var upIcon = $("<i>", {
                    class: "material-icons small upload-btn",
                    "data-list-item": li
                }).text("file_upload").data("list-item", li);
                li.append(div.append(decor.append(upIcon).append(delIcon)));
                $("#file-list").append(li);
            }
        }
        for (var i = 0; i < files.length; i++) {
            var extension = files[i].name.split(".").splice(-1)[0];
            if (extension != "pdf") {
                Materialize.toast('Oh we only cash in PDFs :p', 4000)
                break;
            }
        }
        if ($(".collection-item").length > 0) {
            $(".msg-ctn").hide()
            $("#file-list").show();
        }
    }

    /**
    * @function uploadToServer
    * @param  {Boolean} mode {reduce or merge}
    * @todo this function is not finished
    */
    function uploadToServer(mode) {
        var uploadData = new FormData();
        uploadData.set("service-mode", mode);
        uploadData.set(tokenName, $("[name=csrfmiddlewaretoken]").val());
        $(".collection-item").each(function (i) {
            uploadData.append("file-input", $(this).data("file-content"));
        });
        $.ajax({
            type: "POST",
            url: serverAddr,
            data: uploadData,
            processData: false,  //prevent jquery from messing with data
            contentType: false,  //prevent jquery from messing with boundary
            success: function (response) {
                console.log("success");
            }
        });
    }

    $("#FOB").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        fileDialog({ multiple: true, accept: ".pdf" }, updateContents)
    });

    //Delete delegate
    $("#file-list").delegate(".del-btn", "click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(e.target).data("list-item").remove();
        if ($(".collection-item").length == 0) {
            $(".msg-ctn").show()
            $("#file-list").hide();
        }
    })

    //Uplaod delegate
    $("#file-list").delegate(".upload-btn", "click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        console.log("upload btn clicked");
        $(e.target).replaceWith(preloader);
    })

    //prevent container from opening a link
    $("#file-list").delegate(".secondary-content", "click", function (e) {
        e.stopPropagation();
        e.preventDefault();
    });

    //Drag and Drop handler
    $("body").on("dragenter dragleave", function (e) {
        e.stopPropagation();
        e.preventDefault();
        $("body").toggleClass('active');
    });

    $("body").on("dragover", function (e) {
        e.stopPropagation();
        e.preventDefault();
    });

    $("body").on("drop", function (e) {
        e.stopPropagation();
        e.preventDefault();
        $("body").toggleClass('active');
        var files = e.originalEvent.dataTransfer.files;
        updateContents(files);
    });

    $("#file-list").hide();

    //Below is test code
    $("#test-reduce").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        uploadToServer(false);
    });

    $("#test-merge").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        uploadToServer(true);
    });
})(this);
