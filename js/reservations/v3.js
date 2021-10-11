// JS version 3


const database = firebase.database();
const reservationRef = database.ref('reservations');


let reservationDetails = {
    // Location and time
    pickupLocation: null,
    pickupDate: null,
    returnLocation: 'Return to same location', // Default to return to same
    returnDate: null,
    rentPeriod: null,
    // Vehicle
    vehicle: null,
    dailyPrice: null,
    vehicleTotalPrice: 0,
    // Extras
    extras: [],
    extrasTotalPrice: 0,
    // Mandatory
    insuranceFee: 0,
    bookingFee: 50,
    // User details
    firstName: null,
    lastName: null,
    DOB: null,
    mobilePhone: null,
    email: null,
    driversLicense: null,
    comments: null,
    // Total
    totalPrice: 0
};


// Set current date
const todayJS = new Date();
const todayHTML = getHTMLDate(todayJS);


function getJsDate(HTMLDate) {
    let dateObject = new Date();
    let dateSplit = HTMLDate.split('-');
    dateObject.setFullYear(dateSplit[0]);
    dateObject.setMonth(dateSplit[1]);
    dateObject.setMonth(dateObject.getMonth() - 1);
    dateObject.setDate(dateSplit[2]);
    return dateObject;
}

function getHTMLDate(dateObject) {
    let HTMLDate = dateObject.getFullYear() + '-';

    if ((dateObject.getMonth() + 1) < 10) {
        HTMLDate += '0' + (dateObject.getMonth() + 1) + '-';
    } else {
        HTMLDate += (dateObject.getMonth() + 1) + '-';
    }
    
    if (dateObject.getDate() < 10) {
        HTMLDate += '0' + dateObject.getDate();
    } else {
        HTMLDate += dateObject.getDate();
    }

    return HTMLDate;
}

function get(id) {
    return document.getElementById(id);
}
function getClass(name) {
    return document.getElementsByClassName(name);
}

// Inline Validation

function validate(element, validationType) { // Validates inputs of pattern, date, select, buttonSelect (group of buttons acting as radio)
    if (validationType == 'pattern') {
        if (element.getAttributeNames().includes('required')) {
            if (element.value == '' || element.value == null || element.value == undefined) {
                return false; // returns false if input is empty and is required
            }
        }
        return element.checkValidity(); // returns validity unless input is empty then returns true
    } else if (validationType == 'date') {
        if (element.getAttributeNames().includes('required')) {
            if (element.value == '') {
                return false; // returns false if input is empty and is required
            } else {
                return element.checkValidity(); // returns the validity of the input based of min and max
            }
        } else {
            return element.checkValidity(); // returns validity unless input is empty then returns true
        }
    } else if (validationType == 'select') {
        let selected = element.selectedIndex; // gets index of selected
        let selectedOption = element.children[selected]; // finds select element as html object
        if (selectedOption.getAttribute('data-valid') == 'true') { // checks the value of data-valid aand returns value
            return true;
        } else {
            return false;
        }

    } else if (validationType == 'buttonSelect') {
        let name;
        try { // error handling
            name = element.getAttribute('data-name'); // sets name a data-name attribute
        } catch {
            name = 'false';
            return false; // returns false if no name
        }
        let selected;
        try {
            selected = element.getAttribute('data-selected'); // checks if selected
        } catch {
            return false; // returns false if not value
        }

        let parent = element.parentElement; //  itterates through buttons of the same parent
        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i].getAttribute('data-name') == name) {
                // parent.children[i].setAttribute('data-selected', 'true');
            } else {
                parent.children[i].setAttribute('data-selected', 'false'); // if not selected  input set to false
            }
        }
        return true;
    } else {
        console.error('Invalid validationType' + '\nelement: ' + element + '\nvalidationType: ' + validationType); //  Sends an error message to console if validation type isn't supported
    }
}

function inlineMessage(element, active, message) {
    // Using input_container's find inline message element
    for (let i = 0; i < element.parentElement.children.length; i++) {
        try {
            if (element.parentElement.children[i].getAttribute('class').includes('inline_validation')) {
                if (active) {
                    // Displays inline message
                    element.parentElement.children[i].innerHTML = message;
                    element.style.border = '2px solid red';
                } else { 
                    // Removes inline message
                    element.parentElement.children[i].innerHTML = '';
                    element.style = '';
                }
            }
        } catch {
            // do nothing (no inline message element)
        }
    }    
}

function inlineValidate(element, message, validationType) {
    inlineMessage(element, !validate(element, validationType), message);
    return validate(element, validationType); // returns true if valid
}


// Calculations
function calculateCarCosts() {
    // Vehicle
    reservationDetails.vehicleTotalPrice = reservationDetails.dailyPrice * reservationDetails.rentPeriod; // calculate cost
    get('overlay-totalVehiclePrice').innerHTML = '$ ' + reservationDetails.vehicleTotalPrice.toFixed(2); // set in overlay
    // Mandatory
    reservationDetails.insuranceFee = 20 * reservationDetails.rentPeriod; // calculate insurance cost
    get('mandatory_insurance').innerHTML = '$ ' + reservationDetails.insuranceFee.toFixed(2); // display on form
    get('overlay-mandatory_insurance').innerHTML = '$ ' + reservationDetails.insuranceFee.toFixed(2); // set in overlay}
    // Total
    reservationDetails.totalPrice = reservationDetails.vehicleTotalPrice + reservationDetails.extrasTotalPrice + reservationDetails.insuranceFee + reservationDetails.bookingFee; // calculate total cost
    get('overlay-totalPrice').innerHTML = '$ ' + reservationDetails.totalPrice.toFixed(2); // set in overlay
}


// Inputs
const allInputs = {
    'pickupLocation': {
        'tagName': 'id',
        'type': 'select',
        'message': 'Please select a location'
    },
    'pickupDate': {
        'tagName': 'id',
        'type': 'date',
        'message': 'Invalid date'
    },
    'returnLocation': {
        'tagName': 'id',
        'type': 'select',
        'message': ''
    },
    'returnDate': {
        'tagName': 'id',
        'type': 'date',
        'message': 'Invalid date (max 21 days)'
    },
    'carCards': {
        'tagName': 'list',
        'type': 'buttonSelect',
        'message': ''
    },
    'firstName': {
        'tagName': 'id',
        'type': 'pattern',
        'message': 'Invalid first name (2-30 letters)'
    },
    'lastName': {
        'tagName': 'id',
        'type': 'pattern',
        'message': 'Invalid last name (2-30 letters)'
    },
    'DOB': {
        'tagName': 'id',
        'type': 'date',
        'message': 'You must be at least 25 years old to rent a car and less than 80 years of age'
    },
    'mobilePhone': {
        'tagName': 'id',
        'type': 'pattern',
        'message': 'Invalid NZ mobile phone number'
    },
    'email': {
        'tagName': 'id',
        'type': 'pattern',
        'message': 'Invalid email address'
    },
    'driversLicense': {
        'tagName': 'id',
        'type': 'pattern',
        'message': 'Invalid drivers license (<span style="font-family:monospace;display:inline;">XX######</span>)'
    }
};

// Pickup location
get('pickupLocation').addEventListener('input', function () {
    if (inlineValidate(this, allInputs[this.id].message, 'select')) { // check if input is valid
        let selected = this.selectedIndex;
        let locations = [ // list of locations
            null,
            'Dunedin Airport',
            'Ricky\'s Rides Depo' 
        ];
        reservationDetails.pickupLocation = locations[selected]; // set location
        get('overlay-pickupLocation').innerHTML = locations[selected]; // set in overlay
    } else {
        get('overlay-pickupLocation').innerHTML = '<span class="invalid_entry">Please Select</span>'; // error indication in overlay
    }
});
// Pickup date
get('pickupDate').setAttribute('min', todayHTML); // set min pickup date
get('pickupDate').addEventListener('input', function () {
    if (inlineValidate(this, allInputs[this.id].message, 'date')) { // check if input is valid
        reservationDetails.pickupDate = this.value; // sets pickupDate
        get('overlay-pickupDate').innerHTML = this.value; // sets in overlay
        let pickupJS = getJsDate(this.value); // convert date to js format
        let returnMin = pickupJS; // set the return min base value in order to calculate
        returnMin.setTime(pickupJS.getTime() + (1 * 24 * 60 * 60 * 1000)); // set the date 1 day after pickup using milliseconds
        get('returnDate').min = getHTMLDate(returnMin); // set min on returnDate element
        let returnMax = pickupJS; // set the return max base value in order to calculate
        returnMax.setTime(pickupJS.getTime() + (20 * 24 * 60 * 60 * 1000)); // set the date 20 days later so max is 21
        get('returnDate').max = getHTMLDate(returnMax); // set max on returnDate element
        get('returnDate').value = ''; // Clear the value of returnDate to force user to enter a new date
        get('returnDate').removeAttribute('disabled'); // enables returnDate on first pickupDate input
    } else {
        get('overlay-returnDate').innerHTML = '<span class="invalid_entry">' + this.value + '</span>'; // error indication in overlay
    }
    
});


// Return location
get('returnLocation').addEventListener('input', function () {
    let selected = this.selectedIndex;
    let locations = [ // list of locations
        'Return to same location',
        'Dunedin Airport',
        'Ricky\'s Rides Depo' 
    ];
    reservationDetails.returnLocation = locations[selected]; // sets return location
    get('overlay-returnLocation').innerHTML = locations[selected]; // sets in overlay
});
// Return date
get('returnDate').addEventListener('input', function () {
    if (inlineValidate(this, allInputs[this.id].message, 'date')) { // check if input is valid
        reservationDetails.returnDate = this.value; // set return date
        get('overlay-returnDate').innerHTML = this.value;
        // Calculate car total prices to display
        let PD = getJsDate(get('pickupDate').value); // pickup
        let RD = getJsDate(this.value); // return
        let period = Math.floor((RD.getTime() - PD.getTime()) / (24 * 60 * 60 * 1000)); // difference in days
        reservationDetails.rentPeriod = period; // set period
        get('overlay-rentPeriod').innerHTML = period + ' days'; // set in overlay

        calculateCarCosts();

        // Set prices on car cards
        let cards = getClass('carCard');
        for (let i = 0; i < cards.length; i++) {
            let dailyPrice = Number(cards[i].getAttribute('data-price'));
            cards[i].children[1].children[9].children[1].innerHTML = '$ ' + (dailyPrice * period).toFixed(2); // calculate by multipling dailyprice by rentperiod
        }

    } else {
        get('overlay-returnDate').innerHTML = '<span class="invalid_entry">' + this.value + '</span>'; // error indication in overlay
    }
});


// Car cards
let carCards = getClass('carCard');
for (let i = 0; i < carCards.length; i++) {
    carCards[i].addEventListener('click', function () { // event listener for selection
        carCards[i].setAttribute('data-selected', 'true'); // set selected to true
        if (validate(carCards[i], 'buttonSelect')) { // validate
            carCards[i].parentElement.setAttribute('data-valid', 'true'); // set valid to true. used by submit to check completed
            reservationDetails.vehicle = carCards[i].getAttribute('data-name'); // set vehicle
            get('overlay-vehicle').innerHTML = reservationDetails.vehicle; // set vehicle in overlay
            reservationDetails.dailyPrice = Number(carCards[i].getAttribute('data-price')); // set daily price
            get('overlay-dailyPrice').innerHTML = '$ ' + reservationDetails.dailyPrice.toFixed(2); // set dailyprice in overlay

            calculateCarCosts();

            if (reservationDetails.pickupDate == null) { // checks if dates have been entered. if not display an error message at dates
                inlineMessage(get('pickupDate'), true, 'Please enter a date to calculate price');
                inlineMessage(get('returnDate'), true, 'Please enter a date to calculate price');
            } else if (reservationDetails.returnDate == null) {
                inlineMessage(get('returnDate'), true, 'Please enter a date to calculate price');
            }
        }
    });
}


// Extras options

let extras = getClass('extras_select');
for (let i = 0; i < extras.length; i++) {
    extras[i].addEventListener('input', function () { //  event listner for selection
        let selected = [];
        let totalExtraPrice = 0;
        for (let a = 0; a < extras.length; a++) {
            if (extras[a].checked) { // if selected add to list and add to extras price
                selected.push(extras[a].getAttribute('data-name'));
                totalExtraPrice += Number(extras[a].getAttribute('data-price'));
            }
        }
        get('overlay-extras').innerHTML = selected.join('<br>'); // set selected axtras in overlay
        reservationDetails.extras = selected.join(', '); // set extras
        get('overlay-extrasTotalPrice').innerHTML = '$ ' + totalExtraPrice.toFixed(2); // display extras price in overlay
        reservationDetails.extrasTotalPrice = totalExtraPrice; // set extras price

        calculateCarCosts();
    });
}


// First name
get('firstName').addEventListener('input', function () {
    if (inlineValidate(this, allInputs[this.id].message, 'pattern')) { // checks if valid
        reservationDetails.firstName = this.value; // set value
        get('overlay-firstName').innerHTML = this.value; // set in overlay
    } else {
        get('overlay-firstName').innerHTML = '<span class="invalid_entry">' + this.value + '</span>'; // show in overlay as invalid
    }
});
// Last Name
get('lastName').addEventListener('input', function () {
    if (inlineValidate(this, allInputs[this.id].message, 'pattern')) { // checks if valid
        reservationDetails.lastName = this.value; // set value
        get('overlay-lastName').innerHTML = this.value; // set in overlay
    } else {
        get('overlay-lastName').innerHTML = '<span class="invalid_entry">' + this.value + '</span>'; // show in overlay as invalid
    }
});
// DOB
let DOBMin = new Date();
DOBMin.setFullYear(todayJS.getFullYear() - (25)); // set min age
get('DOB').max = getHTMLDate(DOBMin);
let DOBMax = new Date();
DOBMax.setFullYear(todayJS.getFullYear() - (80)); // set max age
get('DOB').min = getHTMLDate(DOBMax);
get('DOB').addEventListener('input', function () {
    if (inlineValidate(this, allInputs[this.id].message, 'date')) { // checks if valid
        reservationDetails.DOB = this.value; // set value
        get('overlay-DOB').innerHTML = reservationDetails.DOB; // set in overlay
    } else {
        get('overlay-DOB').innerHTML = '<span class="invalid_entry">' + this.value + '</span>'; // show in overlay as invalid
    }
});
// Mobile Phone
get('mobilePhone').addEventListener('input', function () {
    if (inlineValidate(this, allInputs[this.id].message, 'pattern')) { // checks if valid
        reservationDetails.mobilePhone = this.value; // set value
        get('overlay-phone').innerHTML = this.value; // set in overlay
    } else {
        get('overlay-phone').innerHTML = '<span class="invalid_entry">' + this.value + '</span>'; // show in overlay as invalid
    }
});
// Email
get('email').addEventListener('input', function () {
    if (inlineValidate(this, allInputs[this.id].message, 'pattern')) { // checks if valid
        reservationDetails.email = this.value; // set value
        get('overlay-email').innerHTML = this.value; // set in overlay
    } else {
        get('overlay-email').innerHTML = '<span class="invalid_entry">' + this.value + '</span>'; // show in overlay as invalid
    }
});
// Drivers license
get('driversLicense').addEventListener('input', function () {
    if (inlineValidate(this, allInputs[this.id].message, 'pattern')) { // checks if valid
        reservationDetails.driversLicense = this.value; // set value
        get('overlay-driverLicense').innerHTML = this.value; // set in overlay
    } else {
        get('overlay-driverLicense').innerHTML = '<span class="invalid_entry">' + this.value + '</span>'; // show in overlay as invalid
    }
});
// Extra comments
get('comments').addEventListener('input', function () {
    reservationDetails.comments = this.value; // set value
});

// Declaration checkbox's
let declaration = { // current values
    'termsConditions': false,
    'age': false
};
get('_f1-declaration-termsConditions').addEventListener('input', function () {
    if (this.checked) {
        declaration.termsConditions = true; // set as checked
        if (declaration.age) {
            get('_f1-submit').removeAttribute('disabled'); // enables submit button if both checked
        }
    } else {
        declaration.termsConditions = false; // set as unchecked
        get('_f1-submit').setAttribute('disabled', ''); // disables submit button
    }
});
get('_f1-declaration-age').addEventListener('input', function () {
    if (this.checked) {
        declaration.age = true; // sets as checked
        if (declaration.termsConditions) {
            get('_f1-submit').removeAttribute('disabled'); // enables submit button if both checked
        }
    } else {
        declaration.age = false; // set as unchecked
        get('_f1-submit').setAttribute('disabled', ''); // disables submit button
    }
});

// Submit
get('_f1-submit').addEventListener('click', function () {
    this.setAttribute('disabled', ''); // disable button to prevent multiple presses
    // disables declarations
    get('_f1-declaration-termsConditions').setAttribute('disabled', '');
    get('_f1-declaration-age').setAttribute('disabled', '');

    // Validate Data
    let valid = true; // unless set as false by invalid input
    let allInputNames = Object.keys(allInputs);
    for (let i = 0; i < allInputNames.length; i++) { // checks all inputs are valid
        if (allInputs[allInputNames[i]].tagName == 'id') {
            let element = get(allInputNames[i]);
            if (!inlineValidate(element, allInputs[allInputNames[i]].message, allInputs[allInputNames[i]].type)) { // validates
                if (valid) { // Calls for first invalid input
                    pageScrollToElement(element);
                }
                valid = false;
            }
        } else if (allInputs[allInputNames[i]].tagName == 'list') {
            let element = get(allInputNames[i]);
            let elements = element.children;
            for (let a = 0; a < elements.length; a++) {
                if (!validate(elements[a], allInputs[allInputNames[i]].message, allInputs[allInputNames[i]].type) && element.dataset.valid != 'true') { // validates
                    if (valid) { // Calls for first invalid input
                        pageScrollToElement(element);
                    }
                    valid = false;
                    element.setAttribute('data-valid', 'false');
                }
            }
        }
    }



    if (!valid) { // any invalid, stops function and resets buttons and checkboxs
        this.removeAttribute('disabled');
        get('_f1-declaration-termsConditions').removeAttribute('disabled');
        get('_f1-declaration-age').removeAttribute('disabled');
        return;
    }

    // Push data
    reservationRef.push(reservationDetails);
    // console.log('Pushed to database');


    // Go to postSubmition
    get('_f1').setAttribute('class', 'complete');
    get('_f1-postSubmition-email').innerHTML = reservationDetails.email;

    countDown(30, get('_f1-refreshCountDown-s'), get('_f1-refreshCountDown')); // start countdown to reload
});

function pageScrollToElement(element) {
    element.scrollIntoView(); // scrolls to an element
}

// Post Submition

function countDown(timeRemaining, sSpan, displaySpan) {
    displaySpan.innerHTML = timeRemaining; // sets time in seconds
    if (timeRemaining == 0) {
        location.reload(); // reloads page
        return;
    } else if (timeRemaining == 1) {
        sSpan.innerHTML = ''; // removes s at one second
    }
    setTimeout(function() {
        countDown(timeRemaining - 1, sSpan, displaySpan);
    }, 1000); // repeats every second
}


// Overlay 
get('_f1-overlay-close').addEventListener('click', function () {
    get('_f1-overlay').style.display = 'none'; // hiddes overlay
});

let openButtons = getClass('overlay-open');
for (let i = 0; i < openButtons.length; i++) {
    openButtons[i].addEventListener('click', function () {
        get('_f1-overlay').style.display = 'block'; // enables overlay
    });
}