var m = {t:0,r:0,b:0,l:0},
    w = d3.select('.plot').node().clientWidth - m.l - m.r,
    h = d3.select('.plot').node().clientHeight - m.t - m.b;

var globalDispatch = d3.dispatch('mousepos');

d3.selectAll('.plot')
    .append('svg')
    .attr('width',w)
    .attr('height',h)
    .on('mousemove',function(){

    })
    .each(function(d,i){

    });

