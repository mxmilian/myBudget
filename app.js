//IIFE module to all functionality
var budgetController = (function() {
    //some code
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
        var dataInput = UICon.getInput();
        // 1. Get input data
        // 2. Add the item to the budget controller
        // 3. Add the item to the UI controller
        // 4. Calculate the budget
        // 5. Display the budget on the UI
        console.log(dataInput);
    }

    return {
        init: function() {
            setUpEventListeners();
        },
    };
})(budgetController, UIController);

controller.init();
