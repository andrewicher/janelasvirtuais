var animator = {
	numSlides:0,
	slides: null,
	times: new Array(),
	durations: new Array(),
	page: null,
	getSlides : function(){
		console.log('getSlides()');
		animator.page = $('#pagescale');
		animator.numSlides=0;
		animator.slides = $('#pagescale .slide');
		$('#pagescale').find('.slide').each(function(){
			animator.numSlides++;
		});
		animator.times=new Array();
		animator.durations=new Array();
		var tmp=$('#pagescale .slide');
		for(var i=0;i<animator.numSlides;i++){
			animator.times.push($(tmp[i]).attr('data-time'));
			animator.durations.push($(tmp[i]).attr('data-duration'));
		}
		setTimeout(function(){animator.animate(0);},1000);
	},
	counter:0,
	animate:function(a){
		console.log('animate('+a+')');
		animator.page.animate({
			'margin-left': a*-1080,
		}, parseInt(animator.durations[animator.counter])*1000,function(){
			animator.counter++;
			animator.counter%=animator.numSlides;
			setTimeout(function(){animator.animate(animator.counter)},parseInt(animator.times[animator.counter])*1000);
		});
	}
}
$(document).ready(function(){
	setTimeout(function(){animator.getSlides()},500);
});