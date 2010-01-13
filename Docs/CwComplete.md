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

* ajaxMethod - (**) either get (default) or post
* ajaxParam - (**) name of the parameter which is sent to the ajax script (defaults to 'search')
* inputMinLength - (**) number of characters entered after which the auto complete starts
* targetfieldForKey - (**) optional, an element id into which the user selected key is written
* targetfieldForValue - (**) optional, an element id into which the user selected value is written. Leave empty to use the input field therefore
* suggestionBoxOuterClass - (**) css-classname, change if necessary
* suggestionBoxListClass - (**) css-classname, change if necessary
* suggestionBoxLoadingClass - (**) css-classname, change if necessary
* suggestionBoxHoverClass - (**) css-classname, change if necessary

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

