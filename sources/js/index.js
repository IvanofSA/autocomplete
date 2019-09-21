import style from "../css/style.scss";

if(process.env.NODE_ENV === 'development') {
    console.log('Working in development mode');
}

import Autocomplete from './modules/autocomplete';

let autocomplete = new Autocomplete({
    autocompleteInputClass: 'input',
    labelTitle: 'Города',
    autocompleteLoaderClass: 'loader',
    fontSizeInputForTooltip: 20,
    controlButtons: true,
    clearBtnSwitch: true,
    message: true,
    messageErrorText: 'Ошибка!',
    messageWarningText: 'Предупреждение!',
    messageSuccessText: 'Успех!',
    timeRemoveMessage: 11000,
    tooltip: true,
    showTooltipTime: 2000,
    showResultSide: true,
    filterFirstLetter: false,
    strictComparison: false,
    minChars: 1,
    loader: true,
    timeRequest: 1100,
    customData: {
        url: '/test-autocomplete-module/static/city2.json',
        type: 'GET',
        key: 'name'
    },
    callAjaxSuccess: function (data) {

    }
});


autocomplete.init();
