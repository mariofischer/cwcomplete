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
 
...
*/
var CwAutocompleter = new Class({

	Implements: [Options,Events],
	
	options: {		
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

	// initialization : css class of the input field, url for ajax query, options
	initialize: function(inputfield, url, options)
	{
		// prepare options
		this.setOptions(options);
		if (!$(inputfield) || !url) { return; }
		
		this.prevlength = 0;
		this.textfield = $(inputfield);
		this.url = url;
		
		// build elements
		var mywidth = this.textfield.getStyle('width');
		var myleft = this.textfield.getPosition().x;
		var mytop = this.textfield.getPosition().y + this.textfield.getSize().y;

		this.container = new Element('div', {
			'class': this.options.suggestionBoxOuterClass,
			'styles': { 'width': mywidth, 'left': myleft, 'top': mytop, 'height': 0 }
		}).inject($(document.body));

		this.choices = new Element('ul', {
			'class': this.options.suggestionBoxListClass
		}).inject($(this.container), 'inside');
		this.clearChoices();
		
		// attach events		
		this.textfield.setProperty('autocomplete', 'off');
		this.textfield.addEvents( {'keydown': this.keypressed.bind(this), 'keyup': this.keypressed.bind(this) } );
		
		// prepare ajax
		this.ajax = new Request({
			url: this.url,
			method: this.options.ajaxMethod});
		this.ajax.addEvent('onComplete', this.ajaxComplete.bind(this));
	},
	
	// Retrieve values given the textfield input and show "loading..."
	getValues: function(input)
	{
		this.choices.hide();
		this.container.addClass(this.options.suggestionBoxLoadingClass);
		this.container.show();
		
		this.ajax.send(this.options.ajaxParam+"="+input);
	},
	
	// Ajax oncomplete, eval response and fill dropdown, remove "loading"-classes
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
					this.lielems[i] = new Element('li', { 'html': avalue[1] });
					this.lielems[i].addEvent('click', this.enterValue.bindWithEvent(this, {id: avalue[0], value: avalue[1] }));
					this.lielems[i].injectInside(this.choices);
				}
			}.bind(this));
			
			this.container.show();	
			this.container.removeClass(this.options.suggestionBoxLoadingClass);
			this.choices.show();
			this.lielems[this.selected].addClass(this.options.suggestionBoxHoverClass);
		}
	},
	
	// Clear list of choices
	clearChoices: function(obj)
	{
		this.lielems = [];
		this.selected = 0;
		this.choices.set('html', '');
		this.container.hide();
	},
	
	// Enter value from selection into text-field and fire onChoose-event
	enterValue: function(obj, selected)
	{
		if ($(this.options.targetfieldForKey)) {
			$(this.options.targetfieldForKey).value = selected['id'];
		}
		if ($(this.options.targetfieldForValue)) {
			$(this.options.targetfieldForValue).value = selected['value'];
		}
		else {
			this.textfield.value = selected['value'];
		}
		
		this.fireEvent('onChoose', {'key': selected['id'], 'value': selected['value']});
		this.clearChoices();		
	},
	
	moveUp: function(el, event)
	{
		if (this.lielems[this.selected] && this.lielems[this.selected - 1]) {
			this.lielems[this.selected].removeClass(this.options.suggestionBoxHoverClass);
			this.selected = this.selected - 1;
			this.lielems[this.selected].addClass(this.options.suggestionBoxHoverClass);
		}		
	},
	
	moveDown: function(el, event)
	{
		if (this.lielems[this.selected] && this.lielems[this.selected + 1]) {
			this.lielems[this.selected].removeClass(this.options.suggestionBoxHoverClass);
			this.selected = this.selected + 1;
			this.lielems[this.selected].addClass(this.options.suggestionBoxHoverClass);
		}
	},

	// Text field key handler
	keypressed: function(event)
	{
		var myevent = new Event(event);
		if (myevent.target.id === this.textfield.id) {
			if (myevent.type == 'keyup') {
				switch (myevent.key) {
					case 'enter':
						if (this.lielems[this.selected]) {
							this.lielems[this.selected].fireEvent('click');
						}
						event.preventDefault();
						break;
					case 'down':
						this.moveDown();
						event.preventDefault();
						break;
					case 'up':
						this.moveUp();	
						event.preventDefault();
						break;
					case 'esc':
						this.clearChoices();
						break;
					default:
						var text = myevent.target.value;
						if (text.length != this.prevlength) { // text length has changed
							if (text.length >= this.options.inputMinLength) { // ..and is long enough
								this.prevlength = text.length;
								this.getValues(text);
							} else {
								this.clearChoices();
							}
							event.preventDefault();
						}
				}
			} else if (myevent.key == 'enter' || myevent.key == 'esc') { // keydown disabled for those
				event.preventDefault();
			}
			else {
				this.prevlength = myevent.target.value.length; // any other keydown
			}
		}
	}
});