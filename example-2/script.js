var m = {t:50,r:0,b:50,l:0},
    w = d3.select('.plot').node().clientWidth - m.l - m.r,
    h = d3.select('.plot').node().clientHeight - m.t - m.b;

var plot = d3.select('.plot').append('svg')
    .attr({
        width: w + m.l + m.r,
        height: h + m.t + m.b
    })
    .append('g')
    .attr('transform','translate('+ m.l+','+ m.t+')');

var globalDispatcher = d3.dispatch('changetimeextent');

globalDispatcher.on('changetimeextent',function(extent){
    console.log(extent);
    d3.select('.controls').select('.start-date').html(extent[0].getFullYear()+'/'+(extent[0].getMonth()+1)+'/'+extent[0].getDate());
    d3.select('.controls').select('.end-date').html(extent[1].getFullYear()+'/'+(extent[1].getMonth()+1)+'/'+extent[1].getDate());
});

d3.csv('../data/hubway_trips_reduced.csv',parse,dataLoaded);

function dataLoaded(err,rows){

    var timeExtent = [new Date(2011,6,15),new Date(2012,6,15)],
        binSize = d3.time.day,
        bins = d3.time.day.range(timeExtent[0],timeExtent[1]);
    bins.push(timeExtent[1]);

    //Scales and axis
    var scaleX = d3.time.scale().domain(timeExtent).range([0,w]),
        scaleY = d3.scale.linear().range([h,0]);

    var axisX = d3.svg.axis()
        .scale(scaleX)
        .orient('bottom')
        .tickFormat(function(tick){
            if(tick.getMonth()===0) return tick.getFullYear() + ' / ' + (tick.getMonth()+1);
            return tick.getMonth()+1;
        })

    //Draw a time series
    var layout = d3.layout.histogram()
        .value(function(d){return d.startTime})
        .range(timeExtent)
        .bins(bins);
    var data = layout(rows),
        maxY = d3.max(data,function(d){return d.y});

    scaleY.domain([0,maxY]);

    //Draw
    var bars = plot.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect').attr('class','bar')
        .attr('x',function(d){return scaleX(d.x)})
        .attr('y',function(d){return scaleY(d.y)})
        .attr('width',1)
        .attr('height',function(d){return h-scaleY(d.y)});

    plot.append('g').attr('class','axis axis-x')
        .attr('transform','translate(0,'+h+')')
        .call(axisX);

    //Brush
    var brush = d3.svg.brush()
        .x(scaleX)
        .on('brush',brushmove);

    plot.append('g').attr('class','brush')
        .call(brush)
        .selectAll('rect')
        .attr('height',h);

    function brushmove(){
        var extent = brush.extent();

        bars
            .attr('class','bar')
            .attr('width',1)
            .filter(function(d){
                return d.x > extent[0] && d.x < extent[1]
            })
            .attr('class','bar highlight')
            .attr('width',2)

        globalDispatcher.changetimeextent(extent);
    }
}

function parse(d){
    if(+d.duration<0) return;

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn
    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}

