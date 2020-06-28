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
    <input type = radio class="farmer-radio-btn" data-item=${data._id} name = "farmer-selected">
    <div class="avatar-pic">
        <img src="${data.farmer.avatar}" alt="">
    </div>
    <div class="avatar-text">
        <div class="at-rating">
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star-o"></i>
        </div>
        <h5>${data.farmer.name}</h5>
        <div class="at-reply">${data.description}</div>
    </div>
</div>`)
}

qualitySelection();

