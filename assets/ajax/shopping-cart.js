class CartFill {
    constructor(adder) {
        this.adder = adder;
        this.addTocart();

    }
    addTocart() {
        $(this.adder).click(function (e) {
            e.preventDefault();
            let self = this;

            let itemId = $(self).attr('id').split("-")[1];
            $.ajax({
                type: "post",
                url: '/add-to-cart',
                data: {
                    itemId: itemId
                },

                success: function (data) {
                    let cartCount = $('#cart-count').html();
                    cartCount = parseInt(cartCount);
                    if (data.data.added == true) {
                        cartCount++;
                        $(self).html('Add to cart');
                    } else {
                        if (cartCount > 0) {
                            cartCount--;
                        }
                        $(self).html('remove from cart');
                    }
                    $('#cart-count').html(cartCount);
                }, error: function (err) {
                    console.log(err);
                }
            });
        });

    }
}