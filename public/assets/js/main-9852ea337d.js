"use strict";!function(a){a(window).on("load",(function(){a("#preloader").fadeOut("slow",(function(){a(this).remove()}))})),a(".set-bg").each((function(){var t=a(this).data("setbg");a(this).css("background-image","url("+t+")")})),a(".mobile-menu").slicknav({prependTo:"#mobile-menu-wrap",allowParentLinks:!0}),a(".hero-items").owlCarousel({loop:!0,margin:0,nav:!0,items:1,dots:!1,animateOut:"fadeOut",animateIn:"fadeIn",navText:['<i class="ti-angle-left"></i>','<i class="ti-angle-right"></i>'],smartSpeed:1200,autoHeight:!1,autoplay:!0}),a(".product-slider").owlCarousel({loop:!0,margin:25,nav:!0,items:4,dots:!0,navText:['<i class="ti-angle-left"></i>','<i class="ti-angle-right"></i>'],smartSpeed:1200,autoHeight:!1,autoplay:!0,responsive:{0:{items:1},576:{items:2},992:{items:2},1200:{items:3}}}),a(".logo-carousel").owlCarousel({loop:!1,margin:30,nav:!1,items:5,dots:!1,navText:['<i class="ti-angle-left"></i>','<i class="ti-angle-right"></i>'],smartSpeed:1200,autoHeight:!1,mouseDrag:!1,autoplay:!0,responsive:{0:{items:3},768:{items:5}}}),a(".ps-slider").owlCarousel({loop:!1,margin:10,nav:!0,items:3,dots:!1,navText:['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],smartSpeed:1200,autoHeight:!1,autoplay:!0});var t=new Date,e=String(t.getDate()).padStart(2,"0"),s=String(t.getMonth()+1).padStart(2,"0"),i=t.getFullYear();12==s?(s="01",i+=1):(s=parseInt(s)+1,s=String(s).padStart(2,"0"));var n=s+"/"+e+"/"+i;console.log(n),a("#countdown").countdown(n,(function(t){a(this).html(t.strftime("<div class='cd-item'><span>%D</span> <p>Days</p> </div><div class='cd-item'><span>%H</span> <p>Hrs</p> </div><div class='cd-item'><span>%M</span> <p>Mins</p> </div><div class='cd-item'><span>%S</span> <p>Secs</p> </div>"))})),a(document).ready((function(t){try{var e=a("#pages").msDropdown({on:{change:function(a,t){var e=a.value;""!=e&&(window.location=e)}}}).data("dd"),s=document.location.pathname.toString();s=s.split("/"),e.setIndexByValue(s[s.length-1]),a("#ver").html(msBeautify.version.msDropdown)}catch(t){}a("#ver").html(msBeautify.version.msDropdown),a(".language_drop").msDropdown({roundedBorder:!1}),a("#tech").data("dd")}));var o=a(".price-range"),l=a("#minamount"),r=a("#maxamount"),c=o.data("min"),d=o.data("max");o.slider({range:!0,min:c,max:d,values:[c,d],slide:function(a,t){l.val("$"+t.values[0]),r.val("$"+t.values[1])}}),l.val("$"+o.slider("values",0)),r.val("$"+o.slider("values",1)),a(".fw-size-choose .sc-item label, .pd-size-choose .sc-item label").on("click",(function(){a(".fw-size-choose .sc-item label, .pd-size-choose .sc-item label").removeClass("active"),a(this).addClass("active")})),a(".sorting, .p-show").niceSelect(),a(".product-thumbs-track .pt").on("click",(function(){a(".product-thumbs-track .pt").removeClass("active"),a(this).addClass("active");var t=a(this).data("imgbigurl");t!=a(".product-big-img").attr("src")&&(a(".product-big-img").attr({src:t}),a(".zoomImg").attr({src:t}))})),a(".product-pic-zoom").zoom();var p=a(".pro-qty");p.prepend('<span class="dec qtybtn">-</span>'),p.append('<span class="inc qtybtn">+</span>'),p.on("click",".qtybtn",(function(){var t=a(this),e=t.parent().find("input").val();if(t.hasClass("inc"))var s=parseFloat(e)+1;else if(e>0)s=parseFloat(e)-1;else s=0;t.parent().find("input").val(s)}))}(jQuery);