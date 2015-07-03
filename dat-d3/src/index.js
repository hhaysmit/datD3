var d3 = require('d3')
var histo = require('./stackedHistogram.js')
var grouped = require('./groupedHistogram.js')

function datD3(element, data, type){
		var chart = d3.select(element)
		if(data) chart.datum(data)
		if(type) chart.call(type)

		chart.update = function update(newChart){
			if(newChart) type = newChart;
			this.call(type)
			return this; 
		};
		return chart
	}
datD3.groupedHistogram = grouped
datD3.stackedHistogram= histo

window._datD3 = datD3;
module.exports = datD3;
