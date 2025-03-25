(function($){
	$(document).ready(function() {	

		// Scroll to Top
		jQuery('.scrolltotop').click(function(){
			jQuery('html').animate({'scrollTop' : '0px'}, 400);
			return false;
		});
		
		jQuery(window).scroll(function(){
			var upto = jQuery(window).scrollTop();
			if(upto > 500) {
				jQuery('.scrolltotop').fadeIn();
			} else {
				jQuery('.scrolltotop').fadeOut();
			}
		});


		// owl carousel here
		$('.newgame_card_slider.newgame_2').owlCarousel({
			loop:true,
			margin:14,
			nav:true,
			dots: true,
			autoplay:false,
			smartSpeed: 500,
			navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
			responsive:{
				0:{
					items:2,
					center: true,
					margin:10,
				},
				576:{
					items:3,
					margin:14,
				},
				768:{
					items:4,
					margin:14,
				},
				992:{
					items:5,
					margin:14,
				},
				
				1200:{
					items:6
				},
				1400:{
					items:8
				},
			}
		})

		$('.newgame_card_slider').owlCarousel({
			loop:true,
			margin:30,
			nav:true,
			dots: true,
			autoplay:false,
			smartSpeed: 500,
			navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
			responsive:{
				0:{
					items:1.2,
					center: true,
					margin:10,
				},
				576:{
					items:2,
					margin:15,
				},
				768:{
					items:3,
					margin:15,
					center: true,
				},
				992:{
					items:4,
					margin:15,
				},
				
				1200:{
					items:4
				},
				1400:{
					items:4
				},
			}
		})

		$('.supportive_slider').owlCarousel({
			loop:true,
			margin:10,
			nav:true,
			dots: true,
			autoplay:false,
			smartSpeed: 500,
			navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
			responsive:{
				0:{
					items:1.2,
					center: true,
				},
				576:{
					items:2,
					center: true,
				},
				768:{
					items:2,
					center: true,
				},
				992:{
					items:2,
					center: true,
				},
				
				1200:{
					items:3
				},
				1400:{
					items:3
				},
			}
		})
		
		
		$('.gp_card_slider').owlCarousel({
			loop:true,
			margin:5,
			nav:true,
			dots: false,
			autoplay:false,
			smartSpeed: 1000,
			center: true,
			navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
			responsive:{
				0:{
					items:1.5
				},
				576:{
					items:2
				},
				768:{
					items:3
				},
				992:{
					items:4
				},
				
				1200:{
					items:4
				},
				1400:{
					items:6
				},
			}
		})
		
		
		// accorodion scrip here
		$('.accordion_header').on('click', function() {
			const content = $(this).next('.accordion_content');
			const isActive = $(this).hasClass('active');

			$('.accordion_header').removeClass('active');
			$('.accordion_content').slideUp();

			if (!isActive) {
				$(this).addClass('active');
				content.slideDown();
			}
		});


		

		
	});
})(jQuery);


$(document).ready(function () {

	// timer start stop script here
    let timerInterval = null;
    let isPaused = true;
    let seconds = 0;


    function formatTime(seconds) {
      const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
      const secs = String(seconds % 60).padStart(2, "0");
      return { mins, secs };
    }


    function updateTimerDisplay() {
      const time = formatTime(seconds);
      $(".leaderboard_timer_content .minute").text(time.mins);
      $(".leaderboard_timer_content .second").text(time.secs);
    }


    function startTimer() {
      timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
      }, 1000);
    }

    function stopTimer() {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    $(".play_pause").on("click", function () {
      if (isPaused) {

        startTimer();
        isPaused = false;
        $(this).html('<i class="fa-solid fa-pause"></i>'); 
      } else {
  
        stopTimer();
        isPaused = true;
        $(this).html('<i class="fa-solid fa-play"></i>');
      }
    });

    $(".reset").on("click", function () {
      stopTimer();
      seconds = 0;
      isPaused = true;
      updateTimerDisplay();
      $(".play_pause").html('<i class="fa-solid fa-play"></i>'); 
    });

    updateTimerDisplay();
    $(".play_pause").html('<i class="fa-solid fa-play"></i>');


	// play pause toggle
	$('.play_pause_toggle').on('click', function (e) {
		e.preventDefault();
		const icon = $(this).find('i');

		if (icon.hasClass('fa-pause')) {
			icon.removeClass('fa-pause').addClass('fa-play');
		} else {
			icon.removeClass('fa-play').addClass('fa-pause');
		}
	});


  });

 
// hamburger script
function toggleHamburger(element) {
	element.classList.toggle("open");
}

$(document).ready(function () {


// Counter Control script
$(".newgame3_increase_decrease button").click(function () {
	let inputField = $(this).siblings("input");
	let currentValue = parseInt(inputField.val());

	if ($(this).text() === "+") {
		inputField.val(currentValue + 1);
	} else if ($(this).text() === "-" && currentValue > 0) {
		inputField.val(currentValue - 1);
	}
});



	// hamburger script
	$('.hamburger').click(function() {
		$('.menu_wrapper').slideToggle();
	});


});


$(document).ready(function () {
    $(".hlc_buy_bundle_img, .hlc_cart_img").on("click", function () {
        $(".hero_card_overlay").toggleClass("d-none");
    });
});

