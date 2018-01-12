# Autocomplete


## Install



## Usage
```js
import Autocomplete from './modules/autocomplete';
// or
var Autocomplete = require('./modules/autocomplete');
```


## API


### init()
Initialize autocomplete
```js
let autocomplete = new Autocomplete(config);
autocomplete.init();
```


### check

Check autocomplete

*It can be take disposable optional params*

```js
let autocomplete = new Autocomplete({
        callAjaxSuccess: function () {console.log(this); },
        callAjaxError: function () {console.log(this); },
        callSortArray: function () {console.log(this); },
        callError: function () {console.log(this); },
        callSuccess: function () {console.log(this); },
        callWarning: function () {console.log(this); }
});
```


### disable()

Disable input

*It can be take disposable optional params*

```js
    //Disable input
    autocomplete.disable();
```



### enable()

Enable input

*It can be take disposable optional params*

```js
    //Enable input
    autocomplete.enable();
```



## OPTIONS

### data

**It is necessary option**

**You can use an array or json**

Type `array`

```js
let autocomplete = new Autocomplete({
	arrayData: ['one', 2, 'two', 4, 'three']
});
```

**or**

Type `request`


Description: `customData.key the key value of which is the search in json`


```js
let autocomplete = new Autocomplete({
	customData:  {
            url: 'name.json',
            type: 'GET',
            key: 'name'
        }
});
```


### autocompleteInputClass

Type `string`

**It is necessary option**

It defines your input selector and other required dependencies
```js
let autocomplete = new Autocomplete({
	autocompleteInputClass: 'autocomplete__input'
});
```



### autocompleteContainerClass

Type `string`

Default: `'autocomplete'`

set class for main container
```js
let autocomplete = new Autocomplete({
	autocompleteContainerClass: 'autocomplete'
});
```


### autocompleteWrapClass

Type `string`

Default: `'autocomplete__wrap'`

set class for wrapper
```js
let autocomplete = new Autocomplete({
    autocompleteWrapClass: 'autocomplete__wrap'
});
```

### autocompleteResultClass

Type `string`

Default: `'autocomplete__result'`

set class for block with results
```js
let autocomplete = new Autocomplete({
    autocompleteResultClass: 'autocomplete__result'
});
```

### autocompleteLabelClass

Type `string`

Default: `'autocomplete__label'`

set class for block with results
```js
let autocomplete = new Autocomplete({
    autocompleteLabelClass: 'autocomplete__result'
});
```

### autocompleteLabelClass

Type `string`

Default: `'City'`

set the heading to the field

```js
let autocomplete = new Autocomplete({
    labelTitle: 'City'
});
```


### clearBtnSwitch

Type `boolean`

Default: `false`

enable or disable the clear button
```js
let autocomplete = new Autocomplete({
    clearBtnSwitch: false
});
```

### autocompleteClearBtnClass

Type `string`

Default: `'autocomplete__clear'`

set the class for the cleanup button input
```js
let autocomplete = new Autocomplete({
    autocompleteClearBtnClass: 'autocomplete__clear'
});
```

### message

Type `boolean`

Default: `false`

enable or disable messages
```js
let autocomplete = new Autocomplete({
    message: true
});
```

### autocompleteMessageClass

Type `string`

Default: `'autocomplete__message'`

set the class for the message block
```js
let autocomplete = new Autocomplete({
    autocompleteClearBtnClass: 'autocomplete__message'
});
```

### message text

Type `string`

Default error: `'Ошибка!'`
Default warning: `'Предупреждение!'`
Default success: `'Успех!'`

set the message to be displayed
```js
let autocomplete = new Autocomplete({
    messageErrorText: 'Ошибка!',
    messageWarningText: 'Предупреждение!',
    messageSuccessText: 'Успех!'
});
```

### timeRemoveMessage

Type `number`

Default: `2500`

sets the time through which messages are deleted

```js
let autocomplete = new Autocomplete({
    timeRemoveMessage: 1000
});
```


### controlButtons

Type `boolean`

Default: `false`

Description: 

            `ENTER` - select result
             
             `UP` - up the list
             
             `DOWN` - down the list


enable or disable keyboard management

```js
let autocomplete = new Autocomplete({
    controlButtons: true
});
```

### tooltip

Type `boolean`

Default: `false`

Description: `The tooltip is shown if the selected result does not fit into the input. be sure to enter the fontsize of your input`

enable or disable tooltip

```js
let autocomplete = new Autocomplete({
    tooltip: true,
    fontSizeInputForTooltip: 20
});
```

### showTooltipTime

Type `number`

Default: `2500`

sets the display time of the tooltip

```js
let autocomplete = new Autocomplete({
    tooltip: true
});
```

### showResultSide

Type `boolean`

Default: `false`


Description: `if the block with the result does not fit between the page and input, then it is displayed at the top or bottom`

turn on or off the selection of the block position with the result

```js
let autocomplete = new Autocomplete({
    showResultSide: true
});
```

### filterFirstLetter

Type `boolean`

Default: `false`

starts filtering from the first letter

```js
let autocomplete = new Autocomplete({
    filterFirstLetter: false
});
```

### strictComparison

Type `boolean`

Default: `false`

strict comparison

```js
let autocomplete = new Autocomplete({
    strictComparison: false
});
```

### minChars

Type `number`

Default: `1`


Sets which character begins the search

```js
let autocomplete = new Autocomplete({
    minChars: 1
});
```


### loader

Type `boolean`


Default: `false`


enable or disable the display of the download wait

```js
let autocomplete = new Autocomplete({
    loader: true
});
```


### autocompleteLoaderClass

Type `string`

Default: `loader`

sets the preloader class

```js
let autocomplete = new Autocomplete({
    autocompleteLoaderClass: 'loader'
});
```


### timeRequest

Type `number`

Default: `250`

Sets the time the request was sent after the printing was stopped

```js
let autocomplete = new Autocomplete({
    timeRequest: 300
});
```


