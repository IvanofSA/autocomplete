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
        url: 'city2.json',
        type: 'GET',
        key: 'name'
    },
    callAjaxSuccess: function (data) {

    }
});


autocomplete.init();
