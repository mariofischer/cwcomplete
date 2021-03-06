Class: CwAutocompleter {#CwAutocompleter}
=========================================



### Implements:

Options, Events




CwAutocompleter Method: constructor {#CwAutocompleter:constructor}
-------------------------------------------------------------------

### Notes:

- More information, live demo etc. here: [http://www.chipwreck.de/blog/software/cwcomplete/](http://www.chipwreck.de/blog/software/cwcomplete/) 


### Syntax:

	var myCwAutocompleter = new CwAutocompleter(inputfield, url, options);

### Arguments:

1. inputfield - (*string*) ID of the input field
2. url - (*string*) URL of the backend ajax script
3. options - (*object*, optional) Initial options for the class.

### Options:

* ajaxMethod - (*string*) either get (default) or post
* ajaxParam - (*string*) name of the parameter which is sent to the ajax script (defaults to 'search')
* inputMinLength - (*integer*) number of characters entered after which the auto complete starts
* pause - (*integer*) milliseconds to wait before autocomplete (via ajax) starts. 0 = immediately
* targetfieldForKey - (*string*) optional, an element id into which the user selected key is written
* targetfieldForValue - (*string*) optional, an element id into which the user selected value is written. Leave empty to use the input field therefore
* suggestionBoxOuterClass - (*string*) css-classname, change if necessary
* suggestionBoxListClass - (*string*) css-classname, change if necessary
* suggestionBoxLoadingClass - (*string*) css-classname, change if necessary
* suggestionBoxHoverClass - (*string*) css-classname, change if necessary
* clearChoicesOnBlur - (*boolean*) whether to clear choices when the choises container loses focus
* clearChoicesOnEsc - (*boolean*) whether to clear choices when the choises container loses focus
* clearChoicesOnChoose - (*boolean*) whether to clear choices when a value is chosen
* setValuesOnChoose - (*boolean*) whether to set values when a choice is selected
* suggestionContainer - (*string*) an exiting element to contain the suggestions (may be empty)
* choiceContainer - (*string*) the element used to encapsulate all choices, UL by default
* choiceElement - (*string*) the element used to encapsulate the actual choice text, LI by default

### Events:

* onChoose - triggered if the user selects an item, parameter is an object with "key" and "value"

### Returns:

* (*object*) A new *CwComplete* instance.






CwAutocompleter Method: getValues {#CwAutocompleter:getValues}
---------------------------------------------------------------


### Syntax:



### Arguments:

1. input - (**)


CwAutocompleter Method: ajaxComplete {#CwAutocompleter:ajaxComplete}
---------------------------------------------------------------------


### Syntax:



### Arguments:

1. input - (**)

### Returns:





CwAutocompleter Method: setValues {#CwAutocompleter:setValues}
---------------------------------------------------------------


### Syntax:



### Arguments:

1. values - (**)


CwAutocompleter Method: clearChoices {#CwAutocompleter:clearChoices}
---------------------------------------------------------------------


### Syntax:



### Arguments:

1. obj - (**)


CwAutocompleter Method: enterValue {#CwAutocompleter:enterValue}
-----------------------------------------------------------------


### Syntax:



### Arguments:

1. obj - (**)
2. selected - (**)


CwAutocompleter Method: moveUp {#CwAutocompleter:moveUp}
---------------------------------------------------------


### Syntax:



### Arguments:

1. el - (**)
2. event - (**)


CwAutocompleter Method: moveDown {#CwAutocompleter:moveDown}
-------------------------------------------------------------


### Syntax:



### Arguments:

1. el - (**)
2. event - (**)


CwAutocompleter Method: keypressed {#CwAutocompleter:keypressed}
-----------------------------------------------------------------


### Syntax:



### Arguments:

1. event - (**)

