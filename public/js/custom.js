$(document).ready(function () {
    $("[data-toggle=tooltip]").tooltip();
});


function toast(msg,type){
    if (type == "success"){
        iziToast.success({
            title: "Success",
            message: msg,
            position: 'topRight',
        });
    }else {
        iziToast.error({
            title: "Error",
            message: msg,
            position: 'topRight',
        });
    }
}


$('.token').click(function (e) {
    e.preventDefault();

    var copy_data = $(this).data('token');

    document.addEventListener('copy', function(e) {
        e.clipboardData.setData('text/plain', copy_data);
        e.preventDefault();
    }, true);

    document.execCommand('copy');
    toast('Meter token copied : ' + copy_data,"success");
});


$('.tag').click(function (e) {
    e.preventDefault();

    var copy_data = $(this).data('tag');
    var title = $(this).data("title");

    document.addEventListener('copy', function(e) {
        e.clipboardData.setData('text/plain', copy_data);
        e.preventDefault();
    }, true);

    document.execCommand('copy');
    toast(title +' : ' + copy_data + " copied successfully","success");
});


function toast_alert(msg,type){
    if (type == "error"){
        return toastr.error(msg,'Alert',{
            "positionClass": "toast-top-right",
            timeOut: 5000,
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "preventDuplicates": true,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
            "tapToDismiss": false
        });
    }else {
        return toastr.success(msg,'Alert',{
            timeOut: 5000,
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": true,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
            "tapToDismiss": false

        })
    }
}

function sweet_alert(msg,type){
    return swal({
        title: "Alert",
        text: msg,
        icon: type,
    })
}