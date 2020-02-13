//IIFE module to all functionality
var budgetController = (function () {
    var x = 10;
    function add(y) {
        return x + y;
    }

    return {
        //anonymous function
        publicAdd: function (z) {
            return add(z);
        }
    }
})();

//IIFE module to all user interface dom manipulation
var UIController = (function () {
    //some come
})();


//IIFE module to connect budget module with ui module
var connectController = (function (budgetCon, UICon) {
    return {
        addSomeData: function () {
           return budgetCon.publicAdd(10);
        }
    }
})(budgetController, UIController);

console.log(connectController.addSomeData());