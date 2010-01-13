/*
---
description: CwComplete

authors:
  - Mario Fischer (http://www.chipwreck.de/blog/)

license:
  - MIT-style license

requires:
  core/1.2.3: '*'

provides:
  - CwComplete
  
version:
  0.3
...
*/
var CwAutocompleter = new Class({

	Implements: [Options,Events],
	
	options: {
		inputfield: '', 
		url: '',
		
		ajaxMethod: 'get', // use get or post for the request?
		ajaxParam: 'search', // name of parameter for the request (..url.php?search=..)
		inputMinLength: 3, // number of characters at which the auto completion starts
		
		targetfieldForKey: '', // if set, the user selected key will be written to this field as value (usually a hidden field)
		targetfieldForValue: '', // if set, the user selected item will be written to this field as value (usually a text field)
		
		suggestionBoxOuterClass: 'cwCompleteOuter', // rename css classes here if necessary
		suggestionBoxListClass: 'cwCompleteChoices', // rename css classes here if necessary
		suggestionBoxLoadingClass: 'cwCompleteLoading', // rename css classes here if necessary
		suggestionBoxHoverClass: 'cwCompleteChoicesHover', // rename css classes here if necessary

		onChoose: $empty // function to execute if the user chose an item
	},

	// initialization
	initialize: function(inputfield, url, options)
	{
		Event.Keys.shift = 16;
		Event.Keys.ctrl = 17;
		Event.Keys.alt = 18;
	
		// prepare options
		this.prevlength = 0;
		this.setOptions(options);
		this.options.inputfield = inputfield;
		this.options.url = url;
		this.textfield = $(this.options.inputfield);
		
		if (!$(this.options.inputfield)) {
			return;
		}
		
		// build elements
		var mywidth = this.textfield.getStyle('width');
		var myleft = this.textfield.getPosition().x;
		var mytop = this.textfield.getPosition().y + this.textfield.getSize().y;
/* 		console.log(this.textfield.getPosition().x+","+this.textfield.getPosition().y+","+this.textfield.getSize().y); */

		this.container = new Element('div', {
				'class': this.options.suggestionBoxOuterClass,
				'styles': {
					'width': mywidth,
					'left': myleft,
					'top': mytop,
					'height': 0
				}
		}).inject($(document.body));

		this.choices = new Element('ul', {
				id : this.options.suggestionBoxId,
				'class': this.options.suggestionBoxListClass
		}).inject($(this.container), 'inside');
/* 		this.container.hide(); */
		
		// attach events		
		
		this.textfield.setProperty('autocomplete', 'off');
		this.textfield.addEvent('keydown', this.keypressed.bind(this));
		this.textfield.addEvent('keyup', this.keypressed.bind(this));
		
		this.clearChoices();

		// prepare ajax
		this.ajax = new Request({
			url: this.options.url,
			method: this.options.ajaxMethod});
		this.ajax.addEvent('onComplete', this.ajaxComplete.bind(this));
	},
	
	// Retrieve values, given the textfield input
	getValues: function(input)
	{
		this.startLoading();
		this.ajax.send(this.options.ajaxParam+"="+input);
	},
	
	// Ajax oncomplete, eval response and fill dropdown
	ajaxComplete: function(input)
	{
		if (!input) return;
		var myvalue = JSON.decode(input, true);

		if (myvalue === false || !myvalue.length) {
			this.clearChoices();
		}
		else {
		 	this.values = myvalue;
		 	this.clearChoices();
			this.values.each( function(avalue, i) {
				if (avalue) {
					this.lielems[i] = new Element('li');
					this.lielems[i].set('html', avalue[1]);
					this.lielems[i].addEvent('click', this.enterValue.bindWithEvent(this, {id: avalue[0], value: avalue[1] }));
					this.lielems[i].injectInside(this.choices);
				}
			}.bind(this));
			this.finishedLoading();
		}
	},
	
	// Clear list of choices
	clearChoices: function(obj)
	{
		this.lielems = [];
		this.selected = 0;
		this.choices.set('html', '');
		this.container.hide( );
	},
	
	// Enter value from selection into text-field
	enterValue: function(obj, selected)
	{
		if ($(this.options.targetfieldForKey)) {
			$(this.options.targetfieldForKey).value = selected['id'];
		}
		
		if ($(this.options.targetfieldForValue)) {
			$(this.options.targetfieldForValue).value = selected['value'];
			if (this.options.inputfield != this.options.targetfieldForValue) {
				$(this.options.inputfield).value = '';
			}
		}
		else {
			$(this.options.inputfield).value = selected['value'];
		}
		
		this.fireEvent('onChoose', {'key': selected['id'], 'value': selected['value']});
		this.clearChoices();		
	},
	
	moveUp: function(el, event)
	{
		if (this.selected <= 0) return;
		this.unhighlightSelection();
		this.selected = this.selected - 1;
		this.highlightSelection();
	},
	
	moveDown: function(el, event)
	{
		if (this.selected >= (this.lielems.length - 1)) return;
		this.unhighlightSelection();
		this.selected = this.selected + 1;
		this.highlightSelection();
	},
	
	startLoading: function()
	{
		this.choices.hide();
		this.container.addClass(this.options.suggestionBoxLoadingClass);
		this.container.show();		
	},

	finishedLoading: function()
	{	
		this.container.show();	
		this.container.removeClass(this.options.suggestionBoxLoadingClass);
		this.choices.show();
		this.highlightSelection();
	},

	unhighlightSelection: function()
	{
		if (this.lielems[this.selected]) {
			this.lielems[this.selected].removeClass(this.options.suggestionBoxHoverClass);
		}
	},
	
	highlightSelection: function()
	{
		if (this.lielems[this.selected]) {
			this.lielems[this.selected].addClass(this.options.suggestionBoxHoverClass);
		}
	},
	
	// Text field key handler
	keypressed: function(event)
	{
		var myevent = new Event(event);
		if (myevent.target.id === this.textfield.id) {
		
			if (myevent.type == 'keyup') {
				if (myevent.key !== 'up' && myevent.key !== 'enter' && myevent.key !== 'down' && myevent.key !== 'left' && myevent.key !== 'right' && myevent.key !== 'esc') {
					var text = myevent.target.value;
					if (text.length != this.prevlength) {
						if (text.length >= this.options.inputMinLength) {
							this.prevlength = text.length;
							this.getValues(text);
						} else {
							this.clearChoices();
						}
						event.preventDefault();
					}
				}
				else if (myevent.key == 'enter') {
					if (this.lielems[this.selected]) {
						this.lielems[this.selected].fireEvent('click');
					}
					event.preventDefault();
				}
				else if (myevent.key == 'down') {
					this.moveDown();
					event.preventDefault();
				}
				else if (myevent.key == 'up') {
					this.moveUp();	
					event.preventDefault();
				}
				else if (myevent.key == 'esc') {
					this.clearChoices();
				}
			} else if (myevent.key == 'up' || myevent.key == 'enter' || myevent.key == 'down' || myevent.key == 'esc') { 
				event.preventDefault();
			}
			else {
				var text = myevent.target.value;
				this.prevlength = text.length;
			}
		}
	}
});
