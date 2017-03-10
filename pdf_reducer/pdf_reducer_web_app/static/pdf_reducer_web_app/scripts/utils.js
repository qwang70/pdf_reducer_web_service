/**
 * @todo merge and reduce button
 * @todo remove files
 * @todo fileDialog is buggy ==
 */

(function (globals) {
    var serverAddr = "test_upload";
    var filesKey = "file_input";
    var modeKey = "service_mode";
    var tokenName = "csrfmiddlewaretoken";
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
                li.append(div.append(decor.append(delIcon)));
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
            collectionAvailabe();
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
            uploadData.append(filesKey, $(this).data("file-content"));
        });
        $.ajax({
            type: "POST",
            url: serverAddr,
            data: uploadData,
            processData: false,  //prevent jquery from messing with data
            contentType: false,  //prevent jquery from messing with boundary
            success: function (response) {
                console.log("success");
                $("#download-btn").toggleClass("disabled").attr("href", response);
                console.log("what");
            }
        });
    }

    function collectionAvailabe() {
        $("#msg-ctn").hide()
        $("#file-list").show();
        $("#btn-ctn").show();
    }

    function collectionNa() {
        $("#msg-ctn").show()
        $("#file-list").hide();
        $("#btn-ctn").hide();
    }

    function uploading() {
        $("#uploading-cover").show();
    }

    function noUploading() {
        $("#uploading-cover").hide();
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
            collectionNa();
        }
    })

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

    $("#uploading-cover").hide();
    $(document).
        ajaxStart(function () {
            $("#uploading-cover").show()
        })
        .ajaxStop(function () {
            $("#uploading-cover").hide()
        });

    $("#upload-btn").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        uploadToServer(false);
    });

    collectionNa();

    //Below is test code

})(this);
