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

            if (data.totals[type] > 0) {
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
                    '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            if (type === 'exp') {
                element = '.expenses__list';
                html =
                    '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', item.id);
            newHtml = newHtml.replace(
                '%description%',
                item.description
            );
            newHtml = newHtml.replace(
                '%value%',
                item.value
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
            profit.budget >= 0 ? document.querySelector(DOMstrings.budgetValue).textContent = '+ ' + profit.budget : document.querySelector('.budget__value').textContent = '- ' + (profit.budget*-1);
            document.querySelector(DOMstrings.budgetIncome).textContent = profit.totalInc;
            document.querySelector(DOMstrings.budgetExpenses).textContent = profit.totalExp;
            if (profit.percentages > 0) {
                document.querySelector(DOMstrings.budgetPercentage).textContent = profit.percentages + '%';

            } else {
                document.querySelector(DOMstrings.budgetPercentage).textContent = '---';
            }
        },
        errorHandle: function() {
            var element, elements, elementsArray;
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
    };

    var updateBudget = function (dataInput) {
        var budget;
        // 1. Calculate the budget
            budgetCon.calculateBudget(dataInput.type);
        // 2. Return the budget
            budget = budgetCon.getBudget();
        // 3. Display the budget
            UICon.showProfit(budget);
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
            updateBudget(dataInput);
        } else {
            UICon.errorHandle();
        }
    }

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
        },
    };
})(budgetController, UIController);

controller.init();
