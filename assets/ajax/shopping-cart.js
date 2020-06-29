
class CartFill {
    constructor(adder) {
        this.adder = adder;
        this.addTocart();
    }
    addTocart() {
        $(this.adder).click(function (e) {
            e.preventDefault();
            let self = this;
            console.log(self);
            let quantity = ($("#item-quantity")[0].value);
            let itemId = $('input[name="farmer-selected"]:checked').attr("data-item");
            if(itemId == null || itemId == undefined || itemId==""){
                new Noty({
                    theme: 'relax',
                    text: 'Please Select a seller',
                    type: 'error',
                    layout: 'topRight',
                    timeout: 2000
                }).show();
            }
            else if (quantity !== "") {
                $.ajax({
                    type: "post",
                    url: '/order/add-to-cart',
                    data: {
                        itemId: itemId,
                        quantity: quantity
                    },

                    success: function (data){
                        $('#cart-count').text(`${data.data.added}`);
                        new Noty({
                            theme: 'relax',
                            text: 'Item added to cart',
                            type: 'success',
                            layout: 'topRight',
                            timeout: 2000
                        }).show();
                    }, error: function (err) {
                        console.log(err);
                    }
                });
            } else {
                new Noty({
                    theme: 'relax',
                    text: 'Please add quantity',
                    type: 'error',
                    layout: 'topRight',
                    timeout: 2000
                }).show();
              
            }
        });

    }
}
