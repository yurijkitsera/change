$(document).ready(function () {
    $('#btn-send2').click(function () {
        var ref = $('#ref').val();
        if (ref !== '') {
            $('span').removeClass('hidden')
        }
        if (ref !== '') {
            $.ajax({
                type: "POST", //метод передачи данных
                url: 'https://0-570-0.app.nr.it.loc/change',
                data: {
                    ref: ref,
                }, //передаваемые данные
                success: function (data) { //получение результата
                    $("span").addClass("hidden");
                    var old = $('.modal-header').html(); //получаем содежимое div
                    $('.modal-header').html(old +
                        data.status); //добавляем сообщение об отправке
                }
            });
        }

    });
});