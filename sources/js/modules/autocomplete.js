import throttle from './throttle.module';


class Autocompelte {

    constructor(data) {

        this.body = document.querySelector('body');
        this.inputClass = data.autocompleteInputClass;
        this.input = document.querySelector('.' + this.inputClass);
        this.containerClass = data.autocompleteContainerClass || 'autocomplete';
        this.resultClass = data.autocompleteResultClass || 'autocomplete__result';
        this.labelClass = data.autocompleteLabelClass || 'autocomplete__label';
        this.wrapperClass = data.autocompleteWrapClass || 'autocomplete__inputbox';
        this.clearBtnClass = data.autocompleteClearBtnClass || 'autocomplete__clear';
        this.clearBtnSwitch = data.clearBtnSwitch || false;
        this.labelTitle = data.labelTitle || false;

        this.addWrapper();

        this.inputFontSize = data.fontSizeInputForTooltip || 18;
        this.container = document.querySelector('.' + this.containerClass);
        this.result = document.querySelector('.' + this.resultClass);
        this.clearBtn = document.querySelector('.' + this.clearBtnClass);

        this.classMessage = data.autocompleteMessageClass || 'autocomplete__msg';
        this.useMessage = data.message || false;
        this.messageErrorText = data.messageErrorText || 'Ошибка!';
        this.messageWarningText = data.messageWarningText || 'Предупреждение!';
        this.messageSuccessText = data.messageSuccessText || 'Успех!';
        this.timeRemoveMessage = data.timeRemoveMessage || 1000;

        this.strictComparison = data.strictComparison || false;
        this.filterFirstLetter = data.filterFirstLetter || false;

        this.tooltipUse = data.tooltip || false;
        this.showTooltipTime = data.showTooltipTime || 2500;

        this.loader = data.loader || false;
        this.loaderClass = data.autocompleteLoaderClass || 'loader';

        this.requestThrottle = data.requestThrottle || false;
        this.requestDebounce = data.requestDebounce || false;
        this.timeRequest = data.timeRequest || 1000;

        this.callError = (typeof data.callError === 'function') ? data.callError : '';
        this.callSuccess = (typeof data.callSuccess === 'function') ? data.callSuccess : '';
        this.callWarning = (typeof data.callWarning === 'function') ? data.callWarning : '';
        this.callAjaxError = (typeof data.callAjaxError === 'function') ? data.callAjaxError : '';
        this.callAjaxSuccess = (typeof data.callAjaxSuccess === 'function') ? data.callAjaxSuccess : '';
        this.callSortArray = (typeof data.callSortArray === 'function') ? data.callSortArray : '';

        this.arrayData = (Array.isArray(data.arrayData)) ? data.arrayData : '';
        this.customData = (typeof data.customData === 'object') ? data.customData : '';

        this.showResultSide = data.showResultSide || false;
        this.controlButtons = data.controlButtons || false;
        this.minChars = data.minChars || 0;
        this.curentIndex = 0;
        this.moveScroll = 0;
        this.ARROWUP = 38;
        this.ENTERCODE = 13;
        this.ARROWDOWN = 40;
        this.resultHeight = 0;
        this.itemHeightSum = 0;
        this.arrResult = []
    }

    addWrapper() {
        let that = this,
            elMainContainer = document.createElement('div'),
            elInputWrapper = document.createElement('div'),
            elResult = document.createElement('ul'),
            container = that.input.parentElement;

        elMainContainer.setAttribute('class', this.containerClass);
        elInputWrapper.setAttribute('class', this.wrapperClass);
        elResult.setAttribute('class', this.resultClass);

        if (that.labelTitle) {
            let elInputLabel = document.createElement('laber');
            elInputLabel.setAttribute('class', this.labelClass);
            elInputLabel.textContent = this.labelTitle;
            elMainContainer.appendChild(elInputLabel);
        }
        elMainContainer.appendChild(elInputWrapper);
        elMainContainer.appendChild(elResult);
        elInputWrapper.appendChild(that.input);

        if (that.clearBtnSwitch) {
            let elClear = document.createElement('i');
            elClear.setAttribute('class', this.clearBtnClass);
            elInputWrapper.appendChild(elClear);
        }

        container.appendChild(elMainContainer);

    }

    addEventListners() {
        let that = this;

        this.input.addEventListener('keyup', throttle.debounce(function (e) {
            if (!that.checkKeys(e)) {
                that.arrResult = [];
                that.eventThrottle(e, this);
            }
        }, this.timeRequest));

        this.result.addEventListener('click', function (e) {
            let target = e.target;
            if (target.tagName != 'LI') {
                return;
            }
            that.chooseItem(e.target);
        });

        if (that.clearBtnSwitch) {
            this.clearBtn.addEventListener('click', function () {
                that.input.value = '';
                that.removeMessage();
                that.removeTooltip();
            });
        }

        this.body.addEventListener('click', function () {
            that.result.style.visibility = 'hidden';
        });

        this.body.addEventListener('keyup', function (e) {
            if (that.controlButtons) {
                that.shiftKeys(e);
            }
        });

        this.result.addEventListener('mouseover', function (e) {
            let target = e.target;
            let tooltip = that.container.getElementsByClassName('autocomplete__tooltip');

            if (target.tagName != 'LI') {
                return;
            }

            that.hover(e.target);

            if (tooltip.length <= 0) {
                if (that.shrinkToFill()) {
                    that.tooltip(this.value);
                }
            }
        });

        this.input.addEventListener('mouseover', function () {
            let tooltip = that.container.getElementsByClassName('autocomplete__tooltip');

            if (tooltip.length <= 0) {
                if (that.shrinkToFill()) {
                    that.tooltip(this.value);
                }
            }
        });
    }

    eventThrottle(e, t) {
        let that = this;
        let value = t.value.trim();
        that.success(value, e);
    }


    success(value) {
        let that = this;
        that.result.style.visibility = 'visible';

        if (value && value.length >= this.minChars) {
            that.curentIndex = 0;
            that.removeMessage();

            if (that.arrayData) {
                that.sortArrayResult(that.arrayData, value);

            } else if (that.customData) {

                that.onLoad(value);

            } else {
                if (this.callError) {
                    this.callError();
                }

                that.choiceMessage('error');
            }
            that.overflowResult();

        } else {
            that.curentIndex = 0;
            that.removeMessage();
            that.result.style.visibility = 'hidden';
        }
    }

    overflowResult() {
        let that = this,
            itemArr = that.result.getElementsByTagName('li');

        that.resultHeight = this.getHeight(that.result);
        that.itemHeightSum = 0;

        for (let i = 0; i < itemArr.length; i++) {
            that.itemHeightSum += this.getHeight(itemArr[i]);
        }

        if (that.resultHeight < that.itemHeightSum) {
            that.result.style.overflowY = 'scroll';

        } else {
            that.result.style.overflow = 'hidden';
        }
    }

    onLoad(value) {
        let that = this,
            xhr = new XMLHttpRequest();

        if (that.loader) {
            that.container.classList.add(that.loaderClass);
        }

        xhr.open(that.customData.type, that.customData.url, false);

        if (that.customData.type == 'GET') {
            xhr.send();
        } else {
            xhr.send(value);
        }

        if (xhr.status != 200) {
            that.container.classList.remove(that.loaderClass);
            that.choiceMessage('error');

            if (this.callAjaxError) {
                this.callAjaxError();
            }

        } else {
            that.container.classList.remove(that.loaderClass);
            let data = JSON.parse(xhr.responseText);
            that.sortResult(data, value);
            if (this.callAjaxSuccess) {
                this.callAjaxSuccess(data, value);
            }
        }
    }

    sortResult(data, item) {
        let that = this;
        that.result.innerHTML = "";
        this.deepEqual(data);

        if (this.callSortArray) {
            this.callSortArray(data);
        }

        that.sortArrayResult(that.arrResult, item);
    }

    deepEqual(a, answer) {
        let that = this;

        if (answer == 'result') {
            that.arrResult.push(a);
            return true;

        } else {
            let keysA = Object.keys(a);
            keysA.forEach(function (key) {
                that.equal(a[key], key);
            });
        }
    }

    equal(a, key) {
        let that = this,
            typeA = that.getType(a);

        switch (typeA) {
            case 'object':
                return that.deepEqual(a);
            case 'array':
                return that.eqArray(a);
            default:
                if (key == that.customData.key) {
                    that.deepEqual(a, 'result');
                }
        }
    }

    getType(a) {
        if (typeof a === "object") {
            if (Array.isArray(a)) {
                return 'array';
            } else {
                return 'object';
            }
        } else {
            return typeof a;
        }
    }

    eqArray(a) {
        let that = this;
        for (let i = 0; i < a.length; i++) {
            switch (that.getType(a[i])) {
                case 'object':
                    return that.deepEqual(a);
                case 'array':
                    return that.eqArray(a);
                default:
            }
        }
    }

    sortArrayResult(arrayData, inputVal) {
        let that = this,
            flag = '',
            context = '',
            allSearch = '',
            arrSortNew = [];

        that.result.innerHTML = "";
        arrayData.sort();

        if (that.filterFirstLetter) {
            flag = 'i';
            context = '^';

            if (that.strictComparison) {
                flag = 'g';
            }

        } else {
            flag = 'g';
            context = '';
            allSearch = true;
            if (that.strictComparison) {
                allSearch = false;
            }
        }
        arrSortNew = arrayData.filter(function (value) {
            if (allSearch) {
                value = value.toLowerCase();
                inputVal = inputVal.toLowerCase();
            }
            return value.match(that.generateRegex(inputVal, flag, context, allSearch));
        });

        if (arrSortNew.length == 0) {
            that.result.style.visibility = 'hidden';

            if (this.callWarning) {
                this.callWarning();
            }
            that.choiceMessage('warning');
        }
        that.addItem(arrSortNew);
    }

    generateRegex(input, flag, context,) {

        let string = context;
        let arr = input.trim().split(' ');

        arr.forEach(function (chars, i) {
            string += chars + '\\w*' + (arr.length - 1 > i ? '\\s+' : '');
        });

        return new RegExp(string, flag);
    }

    addItem(arrKey) {
        let that = this,
            contentItem = '';
        for (let i = 0; i < arrKey.length; i++) {
            contentItem = (contentItem ? contentItem : '') + '<li data-number="' + i + '" >' + arrKey[i] + '</li>';
        }

        that.result.innerHTML = contentItem;
        that.resultHeight = this.getHeight(that.result);
        let positionResult = that.positionResult('result');

        if (that.showResultSide) {
            if (positionResult == 'top') {
                that.result.style.display = 'block';
                that.result.style.position = 'absolute';
                that.result.style.bottom = '40px';
                that.result.classList.remove(this.resultClass + '_bottom');
                that.result.classList.add(this.resultClass + '_top');

            } else {
                that.result.style.display = 'block';
                that.result.style.position = 'static';
                that.result.classList.remove(this.resultClass + '_top');
                that.result.classList.add(this.resultClass + '_bottom');
            }
        } else {
            that.result.style.display = 'block';
        }

        let list = that.result.getElementsByTagName('li');

        for (let i = 0; i < list.length; i++) {
            list[0].classList.add('active_item');
        }
    }

    getHeight(el) {

        let el_style = window.getComputedStyle(el),
            el_display = el_style.display,
            el_position = el_style.position,
            el_visibility = el_style.visibility,
            el_max_height = el_style.maxHeight.replace('px', '').replace('%', ''),
            wanted_height = 0;

        if (el_display !== 'none' && el_max_height !== '0') {
            return el.offsetHeight;
        }

        el.style.position = 'absolute';
        el.style.visibility = 'hidden';
        el.style.display = 'block';

        wanted_height = el.offsetHeight;
        el.style.display = el_display;
        el.style.position = el_position;
        el.style.visibility = el_visibility;

        return wanted_height;
    }

    positionResult(type) {

        let winHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
            posInput = this.input.getBoundingClientRect().top;

        if (type == 'result') {

            if (posInput > winHeight - this.resultHeight) {
                return 'top';
            } else {
                return 'bottom';
            }

        }

        else if (type == 'tooltip') {

            if (posInput > winHeight / 6) {
                return 'top';
            } else {
                return 'bottom';
            }
        }
    }

    hover(item) {
        let numberLi = item.getAttribute('data-number'),
            list = this.result.getElementsByTagName('li');

        this.curentIndex = +numberLi;

        for (let i = 0; i < list.length; i++) {
            list[i].classList.remove('active_item');
        }


        item.classList.add('active_item');
    }

    checkKeys(e) {
        if (e.keyCode == this.ARROWDOWN || e.keyCode == this.ARROWUP || e.keyCode == this.ENTERCODE) {
            return true;
        } else {
            return false;
        }
    }

    shiftKeys(e) {

        let that = this,
            items = that.result.getElementsByTagName('li'),
            currentItem = items[this.curentIndex];

        if (that.checkKeys(e)) {

            if (items.length) {
                let dataItem = currentItem.getAttribute('data-number');

                switch (e.keyCode) {

                    case +this.ARROWDOWN:
                        this.choiceMove('down', items, dataItem, currentItem);
                        break;

                    case +this.ARROWUP:
                        this.choiceMove('up', items, dataItem, currentItem);
                        break;

                    case +this.ENTERCODE:
                        this.chooseItem(currentItem);
                        break;

                    default:

                }
            }
        }
    }

    choiceMove(direction, items, dataItem, currentItem) {

        let numberElem = items.length - 1,
            heightCurrentElem = this.getHeight(currentItem),
            numDataItem = +dataItem;

        if (direction == 'down') {
            if (this.curentIndex >= numberElem) {
                this.curentIndex = 0;
                this.moveScroll = 0;

            } else {
                this.moveScroll += heightCurrentElem;
                this.curentIndex = numDataItem + 1;
            }
        }

        if (direction == 'up') {
            if (this.curentIndex <= 0) {
                this.curentIndex = items.length - 1;
                this.moveScroll = numberElem * heightCurrentElem;
            } else {
                this.curentIndex = numDataItem - 1;
                this.moveScroll -= heightCurrentElem;
            }
        }

        this.result.scrollTop = this.moveScroll;
        this.addClassForItems(items, this.curentIndex);

    }

    addClassForItems(items, index) {
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('active_item');
        }
        items[index].classList.add('active_item');
    }

    chooseItem(item) {

        this.choiceMessage('success');
        this.input.value = item.innerHTML;
        this.result.innerHTML = '';
        this.result.style.visibility = 'hidden';
        this.curentIndex = 0;

        if (this.shrinkToFill()) {

            this.tooltip(this.input.value);
        }

        if (this.callSuccess) {
            this.callSuccess();
        }
    }

    shrinkToFill() {

        if (this.input.value) {
            let fontSize = this.input.style.fontSize,
                that = this,
                inputVal = this.input.value,
                maxWidth = this.input.clientWidth,
                textWidth = that.measureText(inputVal, this.inputFontSize).width;

            if (textWidth > maxWidth) {
                return true;
            } else {
                return false;
            }
        }

    }

    measureText(txt, font) {
        let id = 'text-width-tester',
            span = document.createElement('span');

        span.id = id;
        span.style.fontSize = font;
        span.style.visibility = 'hidden';
        span.style.fontSize = font + 'px';
        span.innerHTML = txt;

        if (!span.length) {
            this.body.appendChild(span);

        } else {
            span.style.fontSize = font + 'px';
            span.innerHTML = txt;
        }

        let obj = {
            width: span.offsetWidth,
            height: span.offsetHeight
        };
        this.body.removeChild(span);

        return obj;

    }

    tooltip(text) {

        let that = this;

        if (that.tooltipUse) {

            let posTooltip = that.positionResult('tooltip'),
                tooltip = document.createElement('div');

            if (posTooltip == 'top') {
                tooltip.className = 'autocomplete__tooltip autocomplete__tooltip_top';
                tooltip.innerHTML = text;
                that.container.appendChild(tooltip);

            } else {
                tooltip.className = 'autocomplete__tooltip autocomplete__tooltip_bottom';
                tooltip.innerHTML = text;
                that.container.appendChild(tooltip);
            }

            setTimeout(function () {
                that.removeTooltip();
            }, this.showTooltipTime)
        }
    }

    removeTooltip() {
        let tooltip = this.container.getElementsByClassName('autocomplete__tooltip');

        if (tooltip.length) {
            this.container.removeChild(tooltip[0]);
        }

    }

    checkMessage(type) {
        let message = this.container.getElementsByClassName(this.classMessage);

        if (message.length) {
            let messageClass = this.classMessage + type;

            if (message[0].classList.contains(messageClass)) {
                return false;
            }
        }
        return true;
    }

    choiceMessage(type) {
        let that = this;

        if (that.checkMessage(type)) {
            if (this.useMessage) {
                switch (type) {
                    case 'error':
                        that.addMessage('error', that.messageErrorText);
                        break;

                    case 'warning':
                        that.addMessage('warning', that.messageWarningText);
                        break;

                    case 'success':

                        that.addMessage('success', that.messageSuccessText);
                        break;

                    default:
                        console.log('');
                }
            }
        }
    }

    addMessage(type, textError) {
        let that = this,
            message = document.createElement('div');

        message.className = that.classMessage + ' ' + that.classMessage + '_' + type;
        message.innerHTML = textError;
        that.container.insertBefore(message, null);
        that.timerRemoveMessage(that.timeRemoveMessage);
    }

    timerRemoveMessage(timer) {
        let that = this;

        setTimeout(function () {
            that.removeMessage();
        }, timer);
    }

    removeMessage() {
        let message = this.container.getElementsByClassName(this.classMessage);

        if (message.length) {
            this.container.removeChild(message[0]);
        }
    }

    disable() {
        this.input.classList.add('disabled');
        this.input.setAttribute('disabled', 'disabled');
    }

    enable() {
        this.input.classList.remove('disabled');
        this.input.removeAttribute('disabled');
    }

    init() {
        this.addEventListners();
    }
}

export default Autocompelte;


