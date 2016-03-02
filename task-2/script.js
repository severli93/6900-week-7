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

globalDispatcher.on('changetimeextent',function(E){
    d3.select('.start-date').html(E[0])//inject in the span (HTML element)
    d3.select('.end-date').html(E[1])
})

var trips;//global variable

d3.csv('../data/hubway_trips_reduced.csv',parse,dataLoaded);

function dataLoaded(err,rows){

    //1.create crossfilter
    //! crossfilter dont deal with N/A or Null very well
     trips = crossfilter(rows);
    //in order to filter by column, create a dimension for the column
    var tripsbyTime=trips.dimension(function(row){return row.startTime;})//run row by row //.getFullyear() create an artificial

    globalDispatcher.on('changetimeextent.crossfilter',function(E){
        //E-->[a,b]
        //console.log('E',E);
        tripsbyTime.filter(E);//filter
        tripsbyTime.top(5) //
        console.log('tripsbyTime',tripsbyTime.top(Infinity).length);
    })
    var timeExtent = [new Date(2011,6,15),new Date(2012,6,15)],
        binSize = d3.time.day,
        bins = d3.time.day.range(timeExtent[0],timeExtent[1]);
    bins.push(timeExtent[1]);//add a new element at the end of the array    unshift shift push pop

    //Scales and axis
    var scaleX = d3.time.scale().domain(timeExtent).range([0,w]),
        scaleY = d3.scale.linear().range([h,0]);


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
       // .call(axisX);
    var newBrush= d3.svg.brush()
        .x(scaleX)
        .on('brush',function(){
            var E=newBrush.extent();
                //console.log(newBrush.extent())
           // console.log(newBrush.empty())//see if newBrush is empty
            globalDispatcher.changetimeextent(E)//[a,b]
        })
    plot.append('g').attr('class','brush')
        .call(newBrush)
        .selectAll('rect').attr('height',h)
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

