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
    };
    return {
        addItem: function(type, desc, val) {
            var newItem, ID;

            if (data.totals[type] > 0) {
                ID = data.totals[type][data.allItems[type].length - 1].id + 1;
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
        showAllItems: function () {
            console.log(data);
        }
    };
})();

//IIFE module to all user interface dom manipulation
var UIController = (function() {
    var DOMstrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputVal: '.add__value',
        button_add: '.add__btn',
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDesc).value,
                value: document.querySelector(DOMstrings.inputVal).value,
            };
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
        var addBtn = document.querySelector(DOMstrings.button_add);

        //Add click event listener when someone click on add button
        addBtn.addEventListener('click', handleAddItem);

        //Add return key listener when some click it
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                handleAddItem();
            }
        });
    };

    function handleAddItem() {
        var dataInput, newItem;

        // 1. Get the field input data
        dataInput = UICon.getInput();
        // 2. Add the item to the budget controller
        newItem = budgetCon.addItem(
            dataInput.type,
            dataInput.description,
            dataInput.value
        );
        budgetCon.showAllItems();
        // 3. Add the item to the UI controller
        // 4. Calculate the budget
        // 5. Display the budget on the UI
    }

    return {
        init: function() {
            setUpEventListeners();
        },
    };
})(budgetController, UIController);

controller.init();
