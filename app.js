//IIFE module to all functionality
var budgetController = (function() {
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Expanse = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expanse.prototype.calculatePercentage = function (totalInc) {
        console.log(totalInc);
        totalInc > 0 ? this.percentage = Math.floor((this.value / totalInc) * 100) : this.percentage = -1;
    };

    Expanse.prototype.getPercentage = function () {
        return this.percentage;
    };

    var data = {
        allItems: {
            inc: [],
            exp: [],
        },

        totals: {
            inc: 0,
            exp: 0,
        },
        budget: 0,
        percentages: 0,

    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (element) {
            sum += element.value;
        });
        data.totals[type] = sum;
    };

    return {
        addItem: function(type, desc, val) {
            var newItem, ID;

            if (data.allItems[type].length > 0) {
                ID =
                    data.allItems[type][
                        data.allItems[type].length - 1
                    ].id + 1;
            } else {
                ID = 0;
            }

            if (type === 'inc') {
                newItem = new Income(ID, desc, val);
            }

            if (type === 'exp') {
                newItem = new Expanse(ID, desc, val);
            }

            data.allItems[type].push(newItem);

            return newItem;
        },
        deleteItem: function(type, id) {
            var arrayOfIDs, index;

            arrayOfIDs = data.allItems[type].map(function (element) {
                return element.id;
            });
            index = arrayOfIDs.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function(typeInput){
            calculateTotal(typeInput);

            data.budget = data.totals.inc - data.totals.exp;

            if(data.totals.exp > 0 && data.totals.inc > 0) {
                data.percentages = Math.floor((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentages = -1;
            }
        },
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentages: data.percentages,
            }
        },
        calculatePercentages: function() {
            data.allItems.exp.forEach(function (element) {
                element.calculatePercentage(data.totals.inc);
            })
        },
        getPercentages: function() {
            var allPerc;
            allPerc = data.allItems.exp.map(function (element) {
                return element.getPercentage();
            });
            return allPerc;
        },
        showAllItems: function() {
            console.log(data);
        },
    };
})();

//IIFE module to all user interface dom manipulation
var UIController = (function() {
    var DOMstrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputVal: '.add__value',
        buttonAdd: '.add__btn',
        budgetValue: '.budget__value',
        budgetIncome: '.budget__income--value',
        budgetExpenses: '.budget__expenses--value',
        budgetPercentage: '.budget__expenses--percentage',
        contrainerDelete: '.container',
        expensesPerc: '.item__percentage',
        date: '.budget__title--month',
    };

    var formatNumber = function(number, type){
        // + or - before a number, exactly 2 decimal points, comma separating the thousands
        var numberSplit, int, dec;
        number = Math.abs(number);
        number = number.toFixed(2);
        numberSplit = number.split('.');
        int = numberSplit[0];
        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + '.' + int.substr(int.length - 3,3);
        }
        dec = numberSplit[1];
        return (type === 'exp' ? '-' : '+') + ' ' + int +','+ dec;

    };
    return {
        getInput: function() {
            return {
                type: document.querySelector(
                    DOMstrings.inputType
                ).value,
                description: document.querySelector(
                    DOMstrings.inputDesc
                ).value,
                value: parseFloat(
                    document.querySelector(
                        DOMstrings.inputVal
                    ).value
                ),
            };
        },
        addListItem: function(item, type) {
            var html, newHtml, element;

            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = '.income__list';
                html =
                    '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            if (type === 'exp') {
                element = '.expenses__list';
                html =
                    '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', item.id);
            newHtml = newHtml.replace(
                '%description%',
                item.description
            );
            newHtml = newHtml.replace(
                '%value%',
                formatNumber(item.value, type)
            );

            //Insert the HTML into the dom
            document
                .querySelector(element)
                .insertAdjacentHTML('beforeend', newHtml);
        },
        clearInputs: function() {
            var inputs, files, fieldsArray;
            inputs = [
                DOMstrings.inputDesc,
                DOMstrings.inputVal,
            ];
            files = document.querySelectorAll(inputs);
            fieldsArray = Array.prototype.slice.call(files);
            fieldsArray.forEach(function(field) {
                field.value = '';
            });
            fieldsArray[0].focus();
            fieldsArray[0].classList.toggle('error');
            fieldsArray[1].classList.toggle('error');
        },
        showProfit: function(profit) {

            var type = profit.budget >= 0 ? 'inc' : 'exp';

            document.querySelector(DOMstrings.budgetValue).textContent =  formatNumber(profit.budget, type);
            document.querySelector(DOMstrings.budgetIncome).textContent = formatNumber(profit.totalInc, 'inc');
            document.querySelector(DOMstrings.budgetExpenses).textContent = formatNumber(profit.totalExp, 'exp');
            if (profit.percentages > 0) {
                document.querySelector(DOMstrings.budgetPercentage).textContent = profit.percentages + '%';

            } else {
                document.querySelector(DOMstrings.budgetPercentage).textContent = '---';
            }
        },
        deleteListItem: function(itemID) {
            var element;
            element = document.getElementById(itemID);
            element.parentNode.removeChild(element);
        },
        showPercentage: function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expensesPerc);

            var nodeListForEach = function(list, callback){
              for(var i = 0; i< list.length; i++) {
                  callback(list[i], i);
              }
            };

            nodeListForEach(fields, function (current, index) {
                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                }else {
                    current.textContent = '---';
                }
            });
        },
        diplayDate: function () {
            var date, month, monthNow, dayNow, dateNow;
            month = [];
            month[0] = "January";
            month[1] = "February";
            month[2] = "March";
            month[3] = "April";
            month[4] = "May";
            month[5] = "June";
            month[6] = "July";
            month[7] = "August";
            month[8] = "September";
            month[9] = "October";
            month[10] = "November";
            month[11] = "December";

            date = new Date().toLocaleDateString();
            var dateSplit = date.split('.');
            dayNow = dateSplit[0];
            monthNow = month[dateSplit[1]-1];
            dateNow = dayNow + ' ' + monthNow;
            document.querySelector(DOMstrings.date).textContent = dateNow;

        },
        errorHandle: function() {
            var element, elements, elementsArray, type;
            elements = [DOMstrings.inputDesc, DOMstrings.inputVal];
            element = document.querySelectorAll(elements);

            elementsArray = Array.prototype.slice.call(element);
            elementsArray[0].classList.add('error');
            elementsArray[1].classList.add('error');
        },
        getDOMstrings: function() {
            return DOMstrings;
        },
    };
})();

//IIFE module to callout budget module functions and ui module functions and connect them
var controller = (function(budgetCon, UICon) {
    var DOMstrings = UICon.getDOMstrings();

    var setUpEventListeners = function() {
        var addBtn = document.querySelector(
            DOMstrings.buttonAdd
        );

        //Add click event listener when someone click on add button
        addBtn.addEventListener('click', handleAddItem);

        //Add return key listener when some click it
        document.addEventListener('keypress', function(
            event
        ) {
            if (
                event.keyCode === 13 ||
                event.which === 13
            ) {
                handleAddItem();
            }
        });

        //document.querySelector(DOMstrings.contrainerDelete).addEventListener('click', handleDeleteItem);
        document.querySelector(DOMstrings.contrainerDelete).addEventListener('click', handleDeleteItem)

    };

    var updateBudget = function (type) {
        var budget;
        // 1. Calculate the budget
            budgetCon.calculateBudget(type);
        // 2. Return the budget
            budget = budgetCon.getBudget();
        // 3. Display the budget
            UICon.showProfit(budget);
    };

    var updatePercentages = function () {
        // 1. Calculate percentages
            budgetCon.calculatePercentages();
        // 2. Read percentages from the budget controller
            var percentages = budgetCon.getPercentages();
        // 3. Update the UI with the new percentages
            UICon.showPercentage(percentages);
    };

    function handleAddItem() {
        var dataInput, newItem;
        // 1. Get the field input data
        dataInput = UICon.getInput();

        if (
            dataInput.description !== '' &&
            !isNaN(dataInput.value) &&
            dataInput.value > 0
        ) {
            // 2. Add the item to the budget controller
            newItem = budgetCon.addItem(
                dataInput.type,
                dataInput.description,
                dataInput.value
            );
            budgetCon.showAllItems();
            // 3. Add the item to the UI controller and clear the fields
            UICon.addListItem(newItem, dataInput.type);
            // 4. Clear the inputs
            UICon.clearInputs();
            // 5. Handle budget tasks
            updateBudget(dataInput.type);
            // 6. Calculate and Update the percentages
            updatePercentages();
        } else {
            UICon.errorHandle();
        }
    }

    var handleDeleteItem = function (event) {
        var itemID, idType, type, id;
        //After pressing the button we get the id and type
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID) {
            //Split that id and type inc-0
            idType = itemID.split('-');
            type = idType[0];
            id = parseInt(idType[1]);
            // 1. Delete the item from the data structure
            budgetCon.deleteItem(type, id);
            // 2. Delete the item from the ui
            UICon.deleteListItem(itemID);
            // 3. Update and show the new budget
            updateBudget(type);
            // 4. Calculate and Update the percentages
            updatePercentages();
        }
    };

    var appReset = function () {
        return {
            budget: 0,
            totalInc: 0,
            totalExp: 0,
            percentages: -1,
        }
    };

    return {
        init: function() {
            UICon.showProfit(appReset());
            setUpEventListeners();
            UICon.diplayDate();
        },
    };
})(budgetController, UIController);

controller.init();
