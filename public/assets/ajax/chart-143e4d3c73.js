function chartDisplayFunction(a){$.ajax({type:"GET",url:"/maps/chart?District="+a,success:function(t){addPieChart(t,a),addRadarChart(t,a),addBarChart(t,a)},error:function(a){console.log(a)}})}function addBarChart(a,t){$("#barChart").remove(),$("#bar-chart-container").append('<canvas id="barChart" height="50px" width="50px"></canvas>');var r=document.getElementById("barChart").getContext("2d");let o=r.createLinearGradient(0,0,0,450);o.addColorStop(.2,"#051937"),o.addColorStop(.4,"#004d7a"),o.addColorStop(.6,"#008793"),o.addColorStop(.8,"#00bf72"),o.addColorStop(1,"#a8eb12");new Chart(r,{type:"bar",data:{labels:a.bar.labels,datasets:[{label:"Area (acres)",backgroundColor:o,data:a.bar.areaData}]},options:{maintainAspectRatio:!1,legend:{display:!1},title:{display:!0,fontSize:20,text:`Area Under Cultivation For Top 5 Crops(${t})`}}})}function addRadarChart(a,t){$("#radarChart").remove(),$("#radar-chart-container").append('<canvas id="radarChart" height="50px" width="50px"></canvas>');var r=document.getElementById("radarChart").getContext("2d");new Chart(r,{type:"radar",data:{labels:a.radar.labels,datasets:[{label:"2014",fill:!0,backgroundColor:"rgba(179,181,198,0.2)",borderColor:"rgba(179,181,198,1)",pointBorderColor:"#fff",pointBackgroundColor:"rgba(179,181,198,1)",data:a.radar.production14Data},{label:"2013",fill:!0,backgroundColor:"rgba(255,99,132,0.2)",borderColor:"rgba(255,99,132,1)",pointBorderColor:"#fff",pointBackgroundColor:"rgba(255,99,132,1)",pointBorderColor:"#fff",data:a.radar.production13Data}]},options:{maintainAspectRatio:!1,title:{display:!0,fontSize:20,text:`Variation In Production Of Major Crops Over Years(${t})`}}})}function addPieChart(a,t){var r=[];for(let t=0;t<a.pie.labels.length;t++){var o=Math.round,e=Math.random;let a="rgba("+o(255*e())+","+o(255*e())+","+o(255*e())+",0.7)";r.push(a)}$("#pieChart").remove(),$("#pie-chart-container").append('<canvas id="pieChart" height="50px" width="50px"></canvas>');var i=document.getElementById("pieChart").getContext("2d");new Chart(i,{type:"doughnut",data:{labels:a.pie.labels,datasets:[{backgroundColor:r,borderColor:"white",data:a.pie.productionData}]},options:{maintainAspectRatio:!1,legend:{display:!1},title:{display:!0,fontSize:20,text:`Various Crop's Production In The District (${t})`}}})}$(document).ready((function(){$.ajax({type:"GET",url:"/maps/markers",success:function(a){!function(a){for(i in a){let t=L.marker([a[i].Latitude,a[i].Longitude]).addTo(map);t._icon.district=a[i].District,t.bindTooltip(""+a[i].District).openTooltip(),t._icon.setAttribute("data-district",a[i].District)}$(".leaflet-marker-icon").on("mouseenter",(function(a){var t=$(a.srcElement||a.target);district=t.attr("data-district"),chartDisplayFunction(district)}))}(a),chartDisplayFunction("DEHRADUN")},error:function(a){console.log(a)}})}));