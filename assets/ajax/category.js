let qualitySelection = function () {
    $('.quality-selector').each(function () {
        let self = this;
        $(self).click(function (e) {
            e.preventDefault();
            $.ajax({
                type: "get",
                url: `/order/getSellers/?category=${$(self).attr('data-category')}&quality=${$(self).attr('data-quality')}`,
                success: function (data) {
                    let table = $('#list-sellers');
                    $('#list-sellers > div').remove();
                    $('#number-of-sellers').text(`${data.sellers.items.length}`);
                    data.sellers.items.forEach((seller) => {
                        let newRow = addSeller(seller);
                        table.prepend(newRow);
                        addRating(`#rating-${seller._id}`)
                        showInfo(`#radio-${seller._id}`,seller)
                    })
                    new Noty({
                        theme: 'relax',
                        text: 'Select a Seller',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 2000
                    }).show();
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
    })
}

let addSeller = (data) => {
    return $(`
    <div class="co-item" id = ${data.farmer._id}>
    <input type = radio class="farmer-radio-btn" data-item=${data._id} name = "farmer-selected" id="radio-${data._id}">
    <label for="radio-${data._id}">Rs.${data.price}</label>
    <div class="avatar-pic">
        <img src="${data.image}" alt="">
    </div>
    <div class="avatar-text">
        <div class="at-rating" id="rating-${data._id}" data-rating=${4}>
        </div>
        <h5>${data.farmer.name}<span>${data.createdAt}</span></h5>
        <div class="at-reply">${data.description}</div>
    </div>
</div>`)
}

function addRating(element){
   var rating = $(element).attr('data-rating') 
   for(let i =0 ;i<rating;i++){
       $(element).append('<i class="fa fa-star"></i> ')
   } 
   $(element).append(' <i class="fa fa-star-o"></i>')
}

function showInfo(element,product){
    $(element).click(function(){
        $('.specification-table table').remove()
        $('.specification-table').append(`<table>
        <tr>
            <td class="p-catagory">Description</td>
            <td>
                <p>${product.description}</p>
            </td>
        </tr>
        <tr>
            <td class="p-catagory">Availability</td>
            <td>
                <div class="p-stock">${product.quantity} in stock</div>
            </td>
        </tr>
        <tr>
            <td class="p-catagory">Weight</td>
            <td>
                <div class="p-weight">1,3kg</div>
            </td>
        </tr>
    </table>`)
    })
}
qualitySelection();

