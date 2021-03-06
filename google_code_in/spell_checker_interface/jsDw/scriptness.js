﻿// bugs:
// bug 1: the interface freaks out with multiwords on more than one line
// activate it by typing first word of multiword on one line, hit return, and type the second word
// (slightly fixed)bug 2: the interface freaks out with more than one space between words
// activate by putting more than one space between words
// (i think it is fixed)bug 3: the interface freaks out when the first line is a newline
// activate by hitting return once or multiple times before typeing any text into the textarea
// (i think it is fixed)bug 4: the interface freaks out when same word is present multiple times in one line, and you make a newline
// activate by typing "blah blah blah" and then hitting enter in the textarea
// bug 5: the interface freaks out when the same incorrect words are in the textarea and you try to correct them not in order of first to last
// activate by typing "blah blah blah" and then correcting the last "blah"

//add this to var part of js
var corrected_words = [];
var dummy_words = ["hello", "my", "name", "is", "and", "I", "like", "nothing", "but", "bacon", "toy car"];
var text_area_focus = false;
var mouse_down = false;
var multiword = ["record player", "toy car", "baby carrage"];
var multiword_checker = "";
var is_multiword = false;
var misspelled_width = 0;
var width_dif = 0;
var newline_array = [];

//add this to document ready part of js
$(document).ready(function(){
	$('.spell_check_editor').mousedown(function(){
		$(this).css('z-index','-10');
		mouse_down = true;
	})
	.mouseup(function(){
		$(this).css('z-index', '20')
		mouse_down = false;
	});
	$('#textAreaId').bind('input propertychange', function() {
		spell_checker();
		$('.spell_check_editor span').css('background-color', 'rgba(0,0,0,0)');
	});
	// $('#textAreaId').keyup(function(){
	// })
	// .keydown(function(){
	// 	spell_checker();
	// 	$('.spell_check_editor span').css('background-color', 'rgba(0,0,0,0)');
	// })
	// .keypress(function(){
	// 	spell_checker();
	// 	$('.spell_check_editor span').css('background-color', 'rgba(0,0,0,0)');
	// });
	$('#textAreaId').focus(function() {
		//spell_checker();
		$('.spell_check_editor span').css('background-color', 'rgba(0,0,0,0)');
		$('.spell_check_editor').css("z-index","20");
		// $('.spell_check_editor span').mouseover(function(){
		// 	if ($(this).hasClass('misspelled')){
		// 		$(this).css({'background-color':'yellow', 'cursor':'pointer'});
		// 	}
		// })
		// .mouseout(function(){
		// 	$(this).css('background-color', 'white');
		// });
	});
	$('#textAreaId').focusout(function() {
		$('.spell_check_editor').css("z-index","-10");
		$('textAreaId').focus();
	});
});

//add this at bottom of js outside of document ready
function spell_checker() {
	//this part is data handeling code, this you can change any way you like
	$('.spell_check_editor').html('');
	var corrected_words_num = 0;
	var myinterval;
	var seconds = 0;
	var newtext = "";
	var this_text = "";
	var nthchild = 0;
	var word_spelled_correct = false;
	var text = $("#textAreaId").val();
	// bug 2 has something to do with the fact that i split text by newlines and spaces. 
	// it doesn't take into acount more than one space
	var words = text.split( /\s+/ );
	for (var re = 0; re < (words.length-1); re++) {
		multiword_checker = words[re]+" "+words[re+1];
		for (var r_e = 0; r_e < multiword.length; r_e++){
			if (multiword_checker == multiword[r_e]) {
				is_multiword = true
			}
		}
		if (is_multiword){
			words.splice(re,2,multiword_checker);
			is_multiword = false;
		}
	}
	newline_array = text.split( "\n" );
	// $('.test').remove();
	// $('h1').after('<p class="test">'+newline_array+'</p>');
	for (var ind = 0; ind < newline_array.length; ind++){
		if (newline_array[ind]==""){
			var sample_text = ""
			var last_text = ""
			var counter = 0;
			while(last_text == ""){
				if (ind-(counter+1)<0) {
					break;
				}
				sample_text = newline_array[(ind-(counter+1))].split(/\s+/);
				last_text = sample_text[sample_text.length-1];
				if (last_text != ""){
					break;
				}
				else {
					counter++;
				}
			}
			var inde = words.indexOf(last_text)+1;
			words.splice(inde,0,"")
		}
	}
	var x_add = 0;
	for (var rep = 0; rep < newline_array.length; rep++){
		var newline_words = newline_array[rep].split(/\s+/);
		var newline_words_space = newline_array[rep].match(/\s+/g);
		if (newline_words_space !== null) {
			for (var indexe = 0; indexe < newline_words_space.length; indexe++){
				var samp_str = newline_words_space[indexe];
				if (samp_str.length > 1){
					for (var samp = 1; samp < samp_str.length; samp++){
						newline_words[indexe+1] = newline_words[indexe+1]+' ';
					}
				}
			}
		}
		for (var re = 0; re < (newline_words.length-1); re++) {
			multiword_checker = newline_words[re]+" "+newline_words[re+1];
			for (var r_e = 0; r_e < multiword.length; r_e++){
				if (multiword_checker == multiword[r_e]) {
					is_multiword = true
				}
			}
			if (is_multiword){
				newline_words.splice(re,2,multiword_checker);
				is_multiword = false;
			}
		}
		var text_back = newline_words.join( "</span> <span>" );
		if (rep > 0){
			$('.spell_check_editor').append('\n');
		}
		$('.spell_check_editor').append('<span>'+text_back+'</span');
		// this for loop checks the spelling of all the single words and multiwords
		for (var x = 0; x < newline_words.length; x++){
			spelled_correct = false;
			for (var xx = 0; xx < dummy_words.length; xx++){
				if (newline_words[x] == dummy_words[xx] || newline_words[x] == dummy_words[xx]+"," || newline_words[x] == dummy_words[xx]+"." || newline_words[x] == ""){
					spelled_correct = true;
				}
			}
			if (!spelled_correct) {
				corrected_words[corrected_words_num] = newline_words[x];
				corrected_words_num++;
				$('.spell_check_editor span:nth-child('+(x+x_add+1)+')').addClass('misspelled');
			}
			if (spelled_correct) {
				corrected_words.splice(x,1)
			}
		}
		x_add+=newline_words.length;
	}
	// $('.test').remove();
	// $('h1').after('<p class="test">'+newline_array+'</p>');
	// for (var x = 0; x < words.length; x++){
	// 	spelled_correct = false;
	// 	for (var xx = 0; xx < dummy_words.length; xx++){
	// 		if (words[x] == dummy_words[xx] || words[x] == dummy_words[xx]+"," || words[x] == dummy_words[xx]+"." || words[x] == ""){
	// 			spelled_correct = true;
	// 		}
	// 	}
	// 	if (!spelled_correct) {
	// 		corrected_words[corrected_words_num] = words[x];
	// 		corrected_words_num++;
	// 		$('.spell_check_editor span:nth-child('+(x+1)+')').addClass('misspelled');
	// 	}
	// 	if (spelled_correct) {
	// 		corrected_words.splice(x,1)
	// 	}
	// }
	// this part is UI code, leave this mostly as is
	$('.spell_check_editor span').mouseover(function(e){
		misspelled_width = $(this).width();
		if (!mouse_down) {
		if ($(this).hasClass('misspelled')){
			myinterval = setInterval(function(){
				seconds++;
				if (seconds > 2){
					clearInterval(myinterval);
					seconds = 0;
					var xwin = e.pageX-40;
				    var ywin = e.pageY-34;
				    if (misspelled_width > 72) {
				    	width_dif = misspelled_width - 72;
				    }
				    else {
				    	width_dif = 0;
				    }
					$('.spell_recomendations').css({'display':'inline', 'top': ywin+'px', 'left': xwin+'px', 'z-index':'30', 'width':''+(100+width_dif)+''});
					$('.spell_recomendations').html('');
					$('.spell_recomendations').append('<div class="spell_recomendations_word" style="width:'+(78+width_dif)+'px;">'+this_text+'</div>')
					$('.spell_recomendations').append('<div class="spell_recomendations_ignore" style="top:0; left:'+(81+width_dif)+'px;">&#x2714</div>')
					$('.spell_recomendations').append('<div class="line"></div>');
					// this function gets the spelling suggestions for the dropdown
					for(var z = 0; z < dummy_words.length; z++){
						$('.spell_recomendations').append('<div class="spell_recomendations_item" style="width:'+(96+width_dif)+'px;">'+dummy_words[z]+'</div>')
					}
					$('.spell_recomendations div:nth-child(4)').css('background-color','lightgray');
					$('.spell_recomendations div:nth-child(4)').mouseenter(function(){
						$(this).css('background-color','lightgray');
					})
					.mouseout(function(){
						$(this).css({'background-color':'white','color':'black'});
					});
					$('.spell_recomendations').mouseleave(function(){
						$('.spell_recomendations').css('display', 'none');
						$('.spell_check_editor span').css('background-color', 'rgba(0,0,0,0)');
					});
					$('.spell_recomendations_item').click(function(){
						//this is a data retreval and data handeling function
						$('.spell_recomendations').css('display', 'none');
						$('.spell_check_editor').html('');
						newtext = $(this).html();
						var index = 0;
						// this for loop sends changed word to the spell_check_editor
						for (var repe = 0; repe < newline_array.length; repe++){
							var array_check = newline_array[repe].split(/\s+/);
							for (var re = 0; re < (array_check.length-1); re++) {
								multiword_checker = array_check[re]+" "+array_check[re+1];
								for (var r_e = 0; r_e < multiword.length; r_e++){
									if (multiword_checker == multiword[r_e]) {
										is_multiword = true
									}
								}
								if (is_multiword){
									array_check.splice(re,2,multiword_checker);
									is_multiword = false;
								}
							}
							index = array_check.indexOf(this_text);
							if (index >= 0){
								array_check.splice(index, 1, newtext);
								var string_back = array_check.join(" ");
								newline_array[repe] = string_back;
								for (var rep1 = 0; rep1 < newline_array.length; rep1++){
									var newline_words1 = newline_array[rep1].split(/\s+/);
									var text_back = newline_words1.join( "</span> <span>" );
									if (rep1 > 0){
										$('.spell_check_editor').append('\n');
									}
									$('.spell_check_editor').append('<span>'+text_back+'</span');
								}
								break;
							}
						}
						text_back = "";
						// this for loop and following lines sends chaged text to textarea
						for (var rep2 = 0; rep2 < newline_array.length; rep2++) {
							if (rep2 > 0){
								text_back = text_back+'\n';
							}
							text_back = text_back+newline_array[rep2];
						}
						$('#textAreaId').val(text_back);
						index = corrected_words.indexOf(this_text);
						corrected_words.splice(index, 1);
						$('#textAreaId').focus();
						spell_checker();
					});
					// this is an ignore function and you can modify this any way you like, as long as it achieves the same result
					$('.spell_recomendations_ignore').click(function(){
						$('#textAreaId').focus();
						dummy_words.push(this_text);
						spell_checker();
						$('.spell_recomendations').css('display', 'none');
					});
				}
			},200);
			this_text = $(this).html();
			$(this).css({'background-color':'yellow', 'cursor':'pointer', 'color':'black', 'z-index':'25'});
		}
	}
	})
	.mouseleave(function(){
		$('.spell_check_editor span').css({'background-color':'rgba(0,0,0,0)', 'z-index':'30', 'color':'rgba(0,0,0,0)'});
		clearInterval(myinterval);
		seconds = 0;
	});
	//check_spelling();
	$('h1').after('<div class="dummy_height" style="width:342px; white-space: pre-wrap; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word;"></div>');
	$('h1').after('<div id="textAreaId1"></div>');
	var prev_val = $('#textAreaId').val();
	$('#textAreaId1').val(prev_val);
	$('#textAreaId1').val(($('#textAreaId1').val()+'AA'));
	newline_array = $("#textAreaId1").val().split("\n");
	for (var re_dum = 0; re_dum < newline_array.length; re_dum++){
		if (re_dum > 0){
			$('.dummy_height').append('\n');
		}
		$('.dummy_height').append('<span>'+newline_array[re_dum]+'<span>')
	}
	var h = $('.dummy_height').height();
	if (h>=175) {
		$('#textAreaId').css('height',h);
		$('.spell_check_editor').css('top','-'+(165+(h-175))+'px');
	}
	$('.dummy_height').remove();
	$('#textAreaId1').remove();
	newline_array = $("#textAreaId").val().split("\n");
}