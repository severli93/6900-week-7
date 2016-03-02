var m = {t:0,r:0,b:0,l:0},
    w = d3.select('.plot').node().clientWidth - m.l - m.r,
    h = d3.select('.plot').node().clientHeight - m.t - m.b;

var globalDispatch = d3.dispatch('mousepos');//global dispatch object

d3.selectAll('.plot')//selection of all .plot (three )elements in HTML
    .append('svg')
    .attr('width',w)
    .attr('height',h)
    .on('mousemove',function(){
//broadcast x,y mouse position
        //this: svg element
        var xy=d3.mouse(this);//[x,y]
        globalDispatch.mousepos(xy);
    })
    .each(function(d,i){
//each plots and do something
        //runs three times
        //value of i : 0,1,2

        //create circle
        var circle=d3.select(this).append('circle').attr('r',15).style('fill','pink').style('opacity',0)

//listener of the dispatcher
        globalDispatch.on('mousepos.'+i,function(xy){
            console.log(xy)
            circle.attr('cx',function(d){ return xy[0]})
                .attr('cy',function(d){ return xy[1]})
                .style('opacity',1)
        })
    });

d3.selectAll('input')
.on('change',function(){
        //do something
        var x = d3.select('#pos-x').node() //.node() : go from selection to DOM elements
            .value;
        var y = d3.select('#pos-y').node().value;
        globalDispatch.mousepos([x,y])
    })
globalDispatch.on('mousepos.input',function(xy){
    //var xy=d3.mouse(this)
    d3.select('#pos-x').node().value = xy[0]
    d3.select('#pos-y').node().value = xy[1]
})