class RemoveFromCart {
    constructor(deleteButton) {
        this.deleteButton = deleteButton;
        this.deleteFromCart();
    }
    deleteFromCart = () => {
        (this.deleteButton).click(function (e) {
            e.preventDefault();
            let self = this;
            let itemId = $(self).attr('data-itemId');
            $.ajax({
                type: "get",
                url: `/order/remove-from-cart/${itemId}`,
                success: function (data) {
                    $('#cart-total').text(`${data.amount}`);
                    let cartCount = $('#cart-count').text();
                    $('#cart-count').text(--cartCount);
                    $(`#cart-item-${itemId}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: 'Item Removed From Cart',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 2000
                    }).show();
                }, error: function (err) {
                    console.log(err);
                }
            });

        });
    }
}

let carthandler = function () {
    let cart = $('.cart-icon > a');
    cart.click((e) => { e.preventDefault() });
    cart.mouseenter(function (e) {
        $.ajax({
            type: "get",
            url: `/order/getCartItems`,
            success: function (data) {
                let table = $('#cart-table-body');
                $('#cart-table-body > tr').remove();
                $('#cart-total').text(`${data.cart.amount}`);
                data.cartItems.forEach((item) => {
                    let newRow = createCartItem(item);
                    table.prepend(newRow);
                    new RemoveFromCart($('.remove-item', newRow));
                })
            }, error: function (err) {
                new Noty({
                    theme: 'relax',
                    text: 'Please Login to See Cart Items',
                    type: 'error',
                    layout: 'topRight',
                    timeout: 2000
                }).show();
                console.log(err);
            }
        });
    })
}

let createCartItem = (data) => {
    return $(`
    <tr id="cart-item-${data.item._id}">
<td class="si-pic">
<a href="/order/buy_product/${data.item._id}">  <img src="${data.item.image}" style="width:50px;height:50px" alt="" /></a>
</td>
<td class="si-text">
    <div class="product-selected">
        <p>Rs ${data.item.price} x ${data.quantity}</p>
        <h6>${data.item.title}</h6>
    </div>
</td>
<td class="si-close">
   <span class="remove-item" data-itemId=${data.item._id}> <i class="ti-close" ></i></span>
</td>
</tr>`)
}

carthandler();

