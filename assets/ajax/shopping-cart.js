console.log("carter called");
class CartFill {
    constructor(adder) {
        this.adder = adder;
        this.addTocart();
       

    }
    addTocart() {
        $(this.adder).click(function (e) {
            e.preventDefault();
            let self = this;
            let quantity=($("#item-quantity")[0].value);
            console.log("qq",quantity);
            let itemId = $(self).attr('id').split("-")[1];
          if(quantity!==""){
            $.ajax({
                type: "post",
                url: '/order/add-to-cart',
                data: {
                    itemId: itemId,
                    quantity:quantity
                },

                success: function (data) {
                    console.log("data",data);
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
          }else{
              console.log('chal be');
          }
        });

    }
}