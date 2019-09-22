var intervalNumber;
var syncIntervalNumber;
var timezone = 'Europe/Moscow';

$(document).ready(function() {
	
	startDateTime()

	$(".city-choice").on('click', function(){
		$("#city")[0].innerHTML = $(this).text();
	    timezone = $(this).attr('value');
	    startDateTime();
	})

	$("select").change(function () {
	    var citySelect = $(this).find("option:selected");
	    var cityValue  = citySelect.val();
	    var cityText   = citySelect.text();
	    $("#city")[0].innerHTML = cityText;
	    timezone = cityValue;
	    startDateTime();
	});

});


function startDateTime() {
	$("#time-spinner").show();
	$("#time").hide();
	getDateTime()
	syncronizedDateTime()
}


function getDateTime() {
	$.ajax({
		url: 'https://worldtimeapi.org/api/timezone/' + timezone,
		type: 'GET',
		success: function(data) {
			let api_datetime = data['datetime'];
			let datetime = new Date(Date.parse(api_datetime))
			startClocks(datetime)

		},
		error: function (argument) {
			console.log("ERROR");
		}
	})
}


function getBeautyDateTime(datetime) {
	let h12 = $("input[name='clock']:checked").val() === "one";
	return datetime.toLocaleString('ru-RU', { 
			timeZone: timezone, 
			year: 'numeric',
	        month: 'long',
	        day: 'numeric',
	        hour: 'numeric',
	        minute: 'numeric',
	        second: 'numeric',
	        hour12: h12,
		});
}


function startClocks(datetime) {
	clearInterval(intervalNumber)
	
	intervalNumber = setInterval(function(){
		$("#time")[0].innerHTML = getBeautyDateTime(datetime);
		datetime.setSeconds(datetime.getSeconds() + 1);
		$("#time-spinner").hide();
		$("#time").show();
	}, 1000);
}


function syncronizedDateTime() {
	clearInterval(syncIntervalNumber);
	syncIntervalNumber = setInterval(function() {
		getDateTime();
	}, 60000)
}