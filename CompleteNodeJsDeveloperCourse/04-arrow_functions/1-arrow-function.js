// Concise function definition:

const square = function (x) {
     return x * x
};

const square = (x) => {
     return x * x
};

const square = (x) => x * x;

console.log(square(2));


// Object Method:

const event = {
    name: 'Birthday Party',
    guestList: ['Andrew', 'Jen', 'Mike'],

    /*
    printGuestList: function() {

    },
    */

    // This is the ES6 style of defining the method object:
    // arrow functions does'nt have it's this implementation
    // but function() definition does it's own this is why we
    // used the arrow function in foreach to have the parent this
    printGuestList() {
        console.log('Guest list for ' + this.name);
        
        this.guestList.forEach((guest) => {
            console.log(guest + ' is attending ' + this.name)
        })
    }
};

event.printGuestList();