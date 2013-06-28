/** @fileoverview Ainda não documentado
 */ 
 var resolutionCheck = {
	config : function(element) {
		if(resolutionCheck.check() == 0) {
			/* se altura maior que largura */
			$(element).height(1920).width(1080);
		} else {
			/* se largura maior que altura */
			$(element).height(1920).width(1080);
			//$(element).height(1080).width(1920);
			resolutionCheck.setHorizontal();
		}
	},
	check : function() {
		var w = screen.width;
		var h = screen.height;
		if(h > w) {
			/* se altura maior que largura */
			return 0;
		} else {
			/* se largura maior que altura */
			return 1;
		}
	},
	setHorizontal : function() {
		console.log($("#pagescale").children(".slide").removeClass('gh1080').addClass('gh1920'));
	}
}