//IIFE module to all functionality
var budgetController = (function () {
    //some code
})();

//IIFE module to all user interface dom manipulation
var UIController = (function () {
    //some code
})();

//IIFE module to connect budget module with ui module
var connectController = (function (budgetCon, UICon) {
    function handleAddItem() {
        // 1. Get input data
        // 2. Add the item to the budget controller
        // 3. Add the item to the UI controller
        // 4. Calculate the budget
        // 5. Display the budget on the UI
        console.log('Adding item');
    }

    var addBtn = document.querySelector('.add__btn');
    //Add click event listener when someone click on add button
    addBtn.addEventListener('click', handleAddItem );

    //Add return key listener when some click it
    document.addEventListener('keypress', function (event) {
        if(event.keyCode === 13 || event.which === 13) {
            handleAddItem();
        }
    });

})(budgetController, UIController);


