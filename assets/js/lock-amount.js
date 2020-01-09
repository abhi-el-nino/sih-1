// var user=require("../../models/User");

$('#lock-buyer').click(function () {
    let BuyerForm = $('#chat-message-lock-container');
    BuyerForm.submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/shop/:id',
            data: BuyerForm.serialize(),
            success: function (data) {
                // show tick
            },
            error: function (error) {
                console.log(error.responseText);
            }
        })
    })
})


