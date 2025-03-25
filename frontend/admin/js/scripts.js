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

		// login page js 

		// form password show hide fuction 
		
		$('.password-show-button').click(function() {
			// Get the password input element
			var passwordField = $('#password');
			
			// Check if the input type is 'password' or 'text'
			if (passwordField.attr('type') === 'password') {
				// Change type to 'text' to show the password
				passwordField.attr('type', 'text');
				$(this).html('<i class="fa-regular fa-eye-slash"></i>'); // Change the icon to eye-slash
			} else {
				// Change type back to 'password' to hide the password
				passwordField.attr('type', 'password');
				$(this).html('<i class="fa-regular fa-eye"></i>'); // Change the icon to eye
			}
		});
				
		
		// profile dropdown menu 
		let profile = document.querySelector('.profile-viewer');
		let menu = document.querySelector('.profile-menu');
		let icon = document.querySelector('.profile-viewer i');

		profile.onclick = function (event) {
			event.stopPropagation();
			menu.classList.toggle('active');
			icon.classList.toggle('rotate');
			notificationDrop.classList.remove('active');
		};

		document.addEventListener('click', function (event) {
			if (!profile.contains(event.target) && !menu.contains(event.target)) {
				menu.classList.remove('active');
				icon.classList.remove('rotate');
			}
		});


		// notification dropdown menu 
		let notificationBox = document.querySelector('.notification-box');
		let notificationDrop = document.querySelector('.ntifon-area');

		notificationBox.onclick = function (event) {
			event.stopPropagation();
			notificationDrop.classList.toggle('active');
			menu.classList.remove('active');
			icon.classList.remove('rotate');
		};

		document.addEventListener('click', function (event) {
			if (!notificationBox.contains(event.target) && !notificationDrop.contains(event.target)) {
				notificationDrop.classList.remove('active');
			}
		});



		const sidebarToggleIcon = document.querySelector(".sidebar-toggle-icon");
		const sidebarWrap = document.querySelector(".sidebar-wrap");

		sidebarToggleIcon.addEventListener("click", function() {
			sidebarWrap.classList.toggle("sidebar-active");
		});

		const humbergerIcon = document.querySelector(".humberger-menu");
		const sidebarCloseIcon = document.querySelector(".close-sidebar-icon");

		humbergerIcon.addEventListener("click", function (event) {
			event.stopPropagation();
			sidebarWrap.classList.add("sidebar-active");
		});

		sidebarCloseIcon.addEventListener("click", function () {
			sidebarWrap.classList.remove("sidebar-active");
		});

		document.addEventListener("click", function (event) {
			if (!sidebarWrap.contains(event.target) && !humbergerIcon.contains(event.target)) {
				sidebarWrap.classList.remove("sidebar-active");
			}
		});



		
		
		
	});
})(jQuery);


// play circle chart js 

$(document).ready(function () {
	var options = {
	  startAngle: 0,
	  size: 150, 
	  value: 0.83,
	  fill: "#826AED",
	  emptyFill: "#B5ECFF", 
	  thickness: 20, 
	  lineCap: "round" 
	};
  
	$(".circle .bar")
	  .circleProgress(options)
	  .on("circle-animation-progress", function (event, progress, stepValue) {
		$(this)
		  .parent()
		  .find("span")
		  .text(Math.round(stepValue * 100) + "%"); // Updates percentage
	  });
  
	$(".circle .bar canvas").css({
	  transform: "scale(0.9)", 
	  transformOrigin: "center",
	});
  });
  

  $("#earn-chart3").circlesProgress({
    size: "188",
    borderSize: "0",
    progress: "75",
    initialProgress: "25",
    innerColor: "#826AED",
});

$(document).ready(function(){

	const data = {
		game1: {
			lastYear: {
				earnings: [ 0, 5000, 4900, 5300, 5000, 3000, 5600, 5300, 5700, 5900, 2900, 6100 ],
				users: [4000, 4500, 4600, 4800, 5100, 4000, 5600, 4900, 5000, 3000, 5700, 5900]
			},
			2024: {
				earnings: [5200, 5500, 5300, 5600, 5700, 5900, 6000, 6100, 6200, 6300, 6400, 6500],
				users: [4200, 4500, 4600, 4900, 5100, 5300, 5600, 5400, 5500, 5700, 5900, 6100]
			}
		},
		game2: {
			lastYear: {
				earnings: [6000, 400, 6100, 5900, 6300, 6100, 6500, 6400, 6700, 6600, 6900, 7000, 7100],
				users: [0, 3500, 3700, 3800, 4000, 3900, 4200, 4300, 4400, 4500, 4600, 4700, 5000]
			},
			2024: {
				earnings: [6200, 6300, 6100, 6400, 6500, 6700, 6900, 7000, 7100, 7200, 7400, 7500],
				users: [3700, 3900, 4100, 4200, 4400, 4500, 4600, 4800, 4900, 5100, 5300, 5500]
			}
		},
		game3: {
			lastYear: {
				earnings: [0,7000, 7100, 7300, 7500, 7400, 7700, 7800, 7500, 7600, 7800, 7900, 8100],
				users: [3000, 8000, 3200, 3100, 3300, 3500, 7790, 3300, 3400, 3500, 3600, 3800, 3900]
			},
			2024: {
				earnings: [7300, 7400, 7600, 7700, 7800, 8000, 8100, 7800, 7900, 8000, 8100, 8200],
				users: [3200, 3300, 3400, 3600, 3700, 3800, 3900, 3700, 3900, 4000, 4100, 4300]
			}
		}
	};
	
	
	
	// Default game and year
	let currentGame = "game1";
	let currentYear = "lastYear";
	
	// Initial chart options
	let options = {
		series: [
			{
				name: "", // Remove series name
				data: data[currentGame][currentYear].earnings
			},
			{
				name: "Users", // Keep for chart but hide in tooltip
				data: data[currentGame][currentYear].users
			}
		],
		chart: {
			height: 300,
			type: "line",
			toolbar: { show: false }
		},
		legend: { show: false }, // Hide legend
		dataLabels: { enabled: false },
		stroke: { 
			curve: "smooth" ,
			width: [3, 3]
		},
		xaxis: {
			categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			title: { text: undefined } // Remove x-axis title
		},
		yaxis: {
			labels: {
				formatter: function (value) {
					if (value >= 1000) {
						return Math.round(value / 1000) + "k"; // No decimal points
					}
					return Math.round(value); // No decimal points
				}
			}
		},
		tooltip: {
			shared: false, // Show only one value (earnings)
			intersect: false,
			marker: { show: false }, // Remove dot
			y: {
				formatter: function (value, { seriesIndex }) {
					// Only show earnings (seriesIndex 0) without any label
					if (seriesIndex === 0) {
						return "$" + value.toLocaleString(); // Format as $12,345
					}
					return ""; // Hide user info
				}
			}
		},
		colors: ["#7F807D", "#826AED"]
	};
	
	// Render the chart
	var chart = new ApexCharts(document.querySelector("#chart"), options);
	chart.render();
	
	// Update chart based on game selection
	document.getElementById("game-selector").addEventListener("change", function (e) {
		currentGame = e.target.value;
		updateChart();
	});
	
	// Update chart based on time range selection
	document.getElementById("time-range-selector").addEventListener("change", function (e) {
		currentYear = e.target.value;
		updateChart();
	});
	
	// Function to update the chart with selected data
	function updateChart() {
		options.series = [
			{
				name: "", // Remove series name
				data: data[currentGame][currentYear].earnings
			},
			{
				name: "Users", // Keep for chart but hide in tooltip
				data: data[currentGame][currentYear].users
			}
		];
		chart.updateOptions(options);
	}
	
	
	
	
	

});