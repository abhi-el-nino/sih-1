class ChangeQuantity{
    constructor(qunatity){
        this.qunatity=quantity;
    }

    Change(quantity){
        $.ajax({
            type: "post",
            url: '/update-item-quantity',
            data: {
                    quantity:this.qunatity
            },

            success: function (data) {
                console.log(data);
            }, error: function (err) {
                console.log(err);
            }
        });
    }
    
}