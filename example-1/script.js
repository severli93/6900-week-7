var m = {t:0,r:0,b:0,l:0},
    w = d3.select('.plot').node().clientWidth - m.l - m.r,
    h = d3.select('.plot').node().clientHeight - m.t - m.b;

var globalDispatch = d3.dispatch('mousepos');

d3.selectAll('.plot')
    .append('svg')
    .attr('width',w)
    .attr('height',h)
    .on('mousemove',function(){
        globalDispatch.mousepos(d3.mouse(this));
    })
    .each(function(d,i){

        var circle = d3.select(this).append('circle').style('fill','red').attr('r',8);

        globalDispatch.on('mousepos.'+i,function(xy){
            circle.attr('cx',xy[0]).attr('cy',xy[1]);
        })
    });

d3.selectAll('input').on('change',function(){
    var x = d3.select('#pos-x').node().value,
        y = d3.select('#pos-y').node().value;

    globalDispatch.mousepos([+x,+y]);
})

globalDispatch.on('mousepos.input',function(xy){
    d3.select('#pos-x').node().value = xy[0];
    d3.select('#pos-y').node().value = xy[1];
});

