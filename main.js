// Переменные для интервалов и текущего часового пояса
var intervalNumber;
var syncIntervalNumber;
var timezone = 'Europe/Moscow';

$(document).ready(function() {
	
	// при загрузке страницы запускаем часы
	startDateTime()

	// обработчик смены города
	$(".city-choice").on('click', function(){
		$("#city")[0].innerHTML = $(this).text();
	    timezone = $(this).attr('value');
	    startDateTime();
	})

});


/*
* Скрываем время и запускаем spinner
* Выполняем ajax запрос
* запускаем синхронизатор
*/
function startDateTime() {
	$("#time-spinner").show();
	$("#time").hide();
	getDateTime()
	syncronizedDateTime()
}

// ajax-запрос и обработка ответа
function getDateTime() {
	$.ajax({
		url: 'https://worldtimeapi.org/api/timezone/' + timezone,
		type: 'GET',
		success: function(data) {
			let api_datetime = data['datetime'];
			let datetime = new Date(Date.parse(api_datetime))
			startClocks(datetime)
		},
		error: function () {
			console.log("ERROR");
		}
	})
}

// Форматируем Date в нужный вид для отображения
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

// запускаем интервал обновления времени на 1 секунду
function startClocks(datetime) {
	clearInterval(intervalNumber)
	intervalNumber = setInterval(function(){
		$("#time")[0].innerHTML = getBeautyDateTime(datetime);
		datetime.setSeconds(datetime.getSeconds() + 1);
		$("#time-spinner").hide();
		$("#time").show();
	}, 1000);
}

// интервал для синхронизации времени один раз в минтут
function syncronizedDateTime() {
	clearInterval(syncIntervalNumber);
	syncIntervalNumber = setInterval(function() {
		getDateTime();
	}, 60000)
}