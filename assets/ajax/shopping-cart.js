
class CartFill {
    constructor(adder) {
        this.adder = adder;
        this.addTocart();
    }
    addTocart() {
        $(this.adder).click( function(e){
            e.preventDefault();
            let self = this;
            console.log(self);
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

class RemoveFromCart{
    constructor(deleteButton){
        this.deleteButton=deleteButton;
        this.deleteFromCart();
    }

deleteFromCart=()=>{
    (this.deleteButton).click(function(e){

    let self=this;
    let itemId = $(self).attr('id').split("-")[1];
    $.ajax({
        type: "get",
        url: `/order/remove-from-cart/${itemId}`,
          success: function (data) {
            console.log(data);
            $(`#cart-item-${itemId}`).remove();    

        }, error: function (err) {
            console.log(err);
        }
    });
       
    });
}

}