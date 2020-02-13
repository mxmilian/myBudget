//IIFE module to all functionality
var budgetController = (function() {
    //some code
})();

//IIFE module to all user interface dom manipulation
var UIController = (function() {
    return {
        getInput: function() {
            return {
                type: document.querySelector('.add__type').value,
                description: document.querySelector('.add__description').value,
                value: document.querySelector('.add__value').value,
            };
        },
    };
})();

//IIFE module to callout budget module functions and ui module functions and connect them
var controller = (function(budgetCon, UICon) {
    function handleAddItem() {
        // 1. Get input data
        // 2. Add the item to the budget controller
        // 3. Add the item to the UI controller
        // 4. Calculate the budget
        // 5. Display the budget on the UI
        console.log(UICon.getInput());
    }

    var addBtn = document.querySelector('.add__btn');
    //Add click event listener when someone click on add button
    addBtn.addEventListener('click', handleAddItem);

    //Add return key listener when some click it
    document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            handleAddItem();
        }
    });
})(budgetController, UIController);
