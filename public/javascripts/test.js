/* eslint-disable */
$(function(){
	$('.options').attr('disabled', false)
	var currTime = new Date().getTime() //the current time as given by the user's browser
	// if the startTime from the server is zero, initialize it and save it to the server, else use the saved value
	var startTime = $('#timer').attr('startTime') * 1 == 0 ? (new Date().getTime()) + 2 * 60 * 1000: $('#timer').attr('startTime') * 1
	
	// Timer
	function timer() {
		var countDownDate = startTime;
		var now = new Date().getTime();
		var distance = countDownDate - now;
		var min = Math.floor((distance % (1000*60*60))/(1000*60))
		var minutes = min < 10 ? '0' + min : min;
		var sec = Math.floor((distance % (1000*60))/1000);
		var seconds = sec < 10 ? '0' + sec : sec;
		//console.log(distance);
		distance > 0 ? document.getElementById("timer").innerHTML = minutes + ":" + seconds : '' ;
		var audio = document.getElementById("audio");
		if(distance < 30000 && distance > 0){ // play clock sound when the time is less than 30sec
			audio.play()
		}
		if(distance < 0){
			clearInterval(myInterval);
			audio.pause(); // pause the sound
			document.getElementById("timer").innerHTML = "EXPIRED";
			$('.prevent').css({display:'block',background:'white', width:'100%', height:$('window').height(), position:'fixed',zIndex:'999999', opacity:'1'})
			$('.containr').css({visiblity:'none'})
			$('.options').attr('disabled', true)
			window.location.href = '/quiz/completed'
		}
	}
	var myInterval = setInterval(timer, 1000);


	$('.options').on('click', function(){
		var $this = $(this)
		console.log('theirChoice ' + $this.text())
		$('.options').attr('disabled', true) //disable the buttons
		$('.disturb').show(0,function(){ //show a spinner
			$('body').css({cursor:'loading'})
			$.post('/quiz/next',{thierChoice:$this.text(),startTime:startTime,currTime:currTime}, function(data,status){
				if(data.currQuestNo == 5 && data.completed == true){
					$('.prevent').css({display:'block',background:'white', width:'100%', height:$('window').height(), position:'fixed', zIndex:'999999', opacity:'1'})
					$('.containr').css({visiblity:'none'})
					window.location.href = '/quiz/completed'
					$('.options').attr('disabled', true) 
				}
				else{ 
					console.log(data);
					console.log(status)
					//console.log(JSON.parse(data))
					$('.thequestion').text(data.question.theQuestion);
					$('.option1').text(data.question.option1);
					$('.option2').text(data.question.option2);
					$('.option3').text(data.question.option3);
					$('.option4').text(data.question.option4);
					$('#currQuestNo').text(data.currQuestNo + ' / 4')
					$('#questions').text(data.question.theQuestion);
					$('.disturb').hide(0);
					$('body').css({cursor:'default'})
					$('.options').attr('disabled', false)
				}
				
			})
			
		})
		
	})
	
})
