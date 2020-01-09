// var user=require("../../models/User");

$('#lock-buyer').click(function(){
    let BuyerForm = $('#chat-message-lock-container');
    BuyerForm.submit(function(e){
    e.preventDefault();})
    $('#lock-farmer').click(function(){
        let FarmerForm = $('#farmer-form');
        FarmerForm.submit(function(e){
        e.preventDefault();
        })
        if($('#final-price').value==$('#final-farmer-price').value){
            
            $.ajax({
                type:'post',
                url:'/shop/:id',
                data:BuyerForm.serialize(),
                success: function(data){
                    // show tick
                }, 
                error:function(error){
                    console.log(error.responseText);
                }})
                
            $.ajax({
                    type:'post',
                    url:'/sell/:id',
                    data:FarmerForm.serialize(),
                    success: function(data){
                        // show tick
                    }, 
                    error:function(error){
                        console.log(error.responseText);
                    }
        })
    }else{
            alert("you or person on other side is adding wrong price");
        }
    })
})
$('#lock-farmer').click(function(){
    let FarmerForm = $('#farmer-form');
        FarmerForm.submit(function(e){
        e.preventDefault();
        })
    $('#lock-buyer').click(function(){
        let BuyerForm = $('#chat-message-lock-container');
    BuyerForm.submit(function(e){
    e.preventDefault();})
        if($('#final-price').value==$('#final-farmer-price').value){
            $.ajax({
                type:'post',
                url:'/shop/:id',
                data:BuyerForm.serialize(),
                success: function(data){
                    // show tick
                }, 
                error:function(error){
                    console.log(error.responseText);
                }})
                
            $.ajax({
                    type:'post',
                    url:'/sell/:id',
                    data:FarmerForm.serialize(),
                    success: function(data){
                        // show tick
                    }, 
                    error:function(error){
                        console.log(error.responseText);
                    }
        })
        }else{
            alert("you or person on other side is adding wrong price");
        }
    })
})
