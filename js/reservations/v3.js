// JS version 1
// This is an achieved version


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
    // User details
    firstName: null,
    lastName: null,
    DOB: null,
    mobilePhone: null,
    email: null,
    driversLicense: null,
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

function validate(element, validationType) {
    if (validationType == 'pattern') {
        if (element.getAttributeNames().includes('required')) {
            if (element.value == '' || element.value == null || element.value == undefined) {
                return false;
            }
        }
        return element.checkValidity();
    } else if (validationType == 'date') {
        if (element.getAttributeNames().includes('required')) {
            if (element.value == '') {
                return false;
            } else {
                return element.checkValidity();
            }
        } else {
            return true;
        }
    } else if (validationType == 'select') {
        let selected = element.selectedIndex;
        let selectedOption = element.children[selected];
        if (selectedOption.getAttribute('data-valid') == 'true') {
            return true;
        } else {
            return false;
        }

    } else if (validationType == 'buttonSelect') {
        let name;
        try {
            name = element.getAttribute('data-name');
        } catch {
            name = 'false';
            return false;
        }
        let selected;
        try {
            selected = element.getAttribute('data-selected');
        } catch {
            return false;
        }

        let parent = element.parentElement;
        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i].getAttribute('data-name') == name) {
                // parent.children[i].setAttribute('data-selected', 'true');
            } else {
                parent.children[i].setAttribute('data-selected', 'false');
            }
        }
        return true;
    } else {
        return false;
    }
}

function inlineMessage(element, active, message) {
    // Using input_container's
    // Inline error should always be secound child (after input)
    for (let i = 0; i < element.parentElement.children.length; i++) {
        try {
            if (element.parentElement.children[i].getAttribute('class').includes('inline_validation')) {
                if (active) {
                    element.parentElement.children[i].innerHTML = message;
                    element.style.border = '2px solid red';
                } else {
                    element.parentElement.children[i].innerHTML = '';
                    element.style = '';
                }
            }
        } catch {
            // do nothing
        }
    }    
}

function inlineValidate(element, message, validationType) {
    inlineMessage(element, !validate(element, validationType), message);
    return validate(element, validationType);
}


// Calculations
function calculateCarCosts() {
    reservationDetails['vehicleTotalPrice'] = reservationDetails['dailyPrice'] * reservationDetails['rentPeriod'];
    get('overlay-totalVehiclePrice').innerHTML = '$ ' + reservationDetails['vehicleTotalPrice'].toFixed(2);
    reservationDetails['totalPrice'] = reservationDetails['vehicleTotalPrice'] + reservationDetails['extrasTotalPrice'];
    get('overlay-totalPrice').innerHTML = '$ ' + reservationDetails['totalPrice'].toFixed(2);
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
        'message': 'Invalid first name (2-30 characters)'
    },
    'lastName': {
        'tagName': 'id',
        'type': 'pattern',
        'message': 'Invalid last name (2-30 characters)'
    },
    'DOB': {
        'tagName': 'id',
        'type': 'date',
        'message': 'You must be at least 25 to rent a car (and less than 80)'
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
    if (inlineValidate(this, allInputs[this.id]['message'], 'select')) {
        let selected = this.selectedIndex;
        let locations = [
            null,
            'Dunedin Airport',
            'Ricky\'s Rides Depo' 
        ]
        reservationDetails['pickupLocation'] = locations[selected];
        get('overlay-pickupLocation').innerHTML = locations[selected];
    } else {
        get('overlay-pickupLocation').innerHTML = '<span class="invalid_entry">Please Select</span>';
    }
});
// Pickup date
get('pickupDate').setAttribute('min', todayHTML);
get('pickupDate').addEventListener('input', function () {
    if (inlineValidate(this, allInputs[this.id]['message'], 'date')) {
        reservationDetails['pickupDate'] = this.value;
        get('overlay-pickupDate').innerHTML = this.value;
        let pickupJS = getJsDate(this.value);
        let returnMin = pickupJS;
        returnMin.setTime(pickupJS.getTime() + (1 * 24 * 60 * 60 * 1000));
        get('returnDate').min = getHTMLDate(returnMin);
        let returnMax = pickupJS;
        returnMax.setTime(pickupJS.getTime() + (21 * 24 * 60 * 60 * 1000));
        get('returnDate').max = getHTMLDate(returnMax);
        get('returnDate').value = '';
        get('returnDate').removeAttribute('disabled');
    } else {
        get('overlay-returnDate').innerHTML = '<span class="invalid_entry">' + this.value + '</span>';
    }
    
});


// Return location
get('returnLocation').addEventListener('input', function () {
    let selected = this.selectedIndex;
    let locations = [
        'Return to same location',
        'Dunedin Airport',
        'Ricky\'s Rides Depo' 
    ];
    reservationDetails['returnLocation'] = locations[selected];
    get('overlay-returnLocation').innerHTML = locations[selected];
});
// Return date
get('returnDate').addEventListener('input', function () {
    if (inlineValidate(this, allInputs[this.id]['message'], 'date')) {
        reservationDetails['returnDate'] = this.value;
        get('overlay-returnDate').innerHTML = this.value;
        // Calculate car total prices to display
        let PD = getJsDate(get('pickupDate').value);
        let RD = getJsDate(this.value);
        let period = Math.floor((RD.getTime() - PD.getTime()) / (24 * 60 * 60 * 1000));
        reservationDetails['rentPeriod'] = period;
        get('overlay-rentPeriod').innerHTML = period + ' days';
        calculateCarCosts();

        let cards = getClass('carCard');
        for (let i = 0; i < cards.length; i++) {
            let dailyPrice = Number(cards[i].getAttribute('data-price'));
            cards[i].children[1].children[9].children[1].innerHTML = '$ ' + (dailyPrice * period).toFixed(2);
        }

    } else {
        get('overlay-returnDate').innerHTML = '<span class="invalid_entry">' + this.value + '</span>';
    }
});


// Car cards
let carCards = getClass('carCard');
for (let i = 0; i < carCards.length; i++) {
    carCards[i].addEventListener('click', function () {
        carCards[i].setAttribute('data-selected', 'true');
        if (validate(carCards[i], 'buttonSelect')) {
            carCards[i].parentElement.setAttribute('data-valid', 'true');
            reservationDetails['vehicle'] = carCards[i].getAttribute('data-name');
            get('overlay-vehicle').innerHTML = reservationDetails['vehicle'];
            reservationDetails['dailyPrice'] = Number(carCards[i].getAttribute('data-price'));
            get('overlay-dailyPrice').innerHTML = '$ ' + reservationDetails['dailyPrice'].toFixed(2);
            calculateCarCosts();
            if (reservationDetails.pickupDate == null) {
                inlineMessage(get('pickupDate'), true, 'Please enter a date to calculate price')
                inlineMessage(get('returnDate'), true, 'Please enter a date to calculate price')
            }
        }
    });
}


// Extras options

let extras = getClass('extras_select');
for (let i = 0; i < extras.length; i++) {
    extras[i].addEventListener('input', function () {
        let selected = [];
        let totalExtraPrice = 0;
        for (let a = 0; a < extras.length; a++) {
            if (extras[a].checked) {
                selected.push(extras[a].getAttribute('data-name'));
                totalExtraPrice += Number(extras[a].getAttribute('data-price'));
            }
        }
        get('overlay-extras').innerHTML = selected.join('<br>');
        reservationDetails['extras'] = selected.join(', ');
        get('overlay-extrasTotalPrice').innerHTML = '$ ' + totalExtraPrice.toFixed(2);
        reservationDetails['extrasTotalPrice'] = totalExtraPrice;
        calculateCarCosts();
    });
}


// First name
get('firstName').addEventListener('input', function () {
    if (inlineValidate(this, allInputs[this.id]['message'], 'pattern')) {
        reservationDetails['firstName'] = this.value;
        get('overlay-firstName').innerHTML = this.value;
    } else {
        get('overlay-firstName').innerHTML = '<span class="invalid_entry">' + this.value + '</span>';
    }
});
// Last Name
get('lastName').addEventListener('input', function () {
    if (inlineValidate(this, allInputs[this.id]['message'], 'pattern')) {
        reservationDetails['lastName'] = this.value;
        get('overlay-lastName').innerHTML = this.value;
    } else {
        get('overlay-lastName').innerHTML = '<span class="invalid_entry">' + this.value + '</span>';
    }
});
// DOB
let DOBMin = new Date();
DOBMin.setTime(todayJS.getTime() - (25 * 365 * 24 * 60 * 60 * 1000));
get('DOB').max = getHTMLDate(DOBMin);
let DOBMax = new Date();
DOBMax.setTime(todayJS.getTime() - (80 * 365 * 24 * 60 * 60 * 1000));
get('DOB').min = getHTMLDate(DOBMax);
get('DOB').addEventListener('input', function () {
    // reservationDetails['DOB'] = this.value;
    if (inlineValidate(this, allInputs[this.id]['message'], 'date')) {
        reservationDetails['DOB'] = this.value;
        get('overlay-DOB').innerHTML = reservationDetails['DOB'];
    } else {
        get('overlay-DOB').innerHTML = '<span class="invalid_entry">' + this.value + '</span>';
    }
});
// Mobile Phone
get('mobilePhone').addEventListener('input', function () {
    if (inlineValidate(this, allInputs[this.id]['message'], 'pattern')) {
        reservationDetails['mobilePhone'] = this.value;
        get('overlay-phone').innerHTML = this.value;
    } else {
        get('overlay-phone').innerHTML = '<span class="invalid_entry">' + this.value + '</span>';
    }
});
// Email
get('email').addEventListener('input', function () {
    if (inlineValidate(this, allInputs[this.id]['message'], 'pattern')) {
        reservationDetails['email'] = this.value;
        get('overlay-email').innerHTML = this.value;
    } else {
        get('overlay-email').innerHTML = '<span class="invalid_entry">' + this.value + '</span>';
    }
});
// Drivers license
get('driversLicense').addEventListener('input', function () {
    if (inlineValidate(this, allInputs[this.id]['message'], 'pattern')) {
        reservationDetails['driversLicense'] = this.value;
        get('overlay-driverLicense').innerHTML = this.value;
    } else {
        get('overlay-driverLicense').innerHTML = '<span class="invalid_entry">' + this.value + '</span>';
    }
});

// Declaration checkbox's
let declaration = {
    'termsConditions': false,
    'age': false
};
get('_f1-declaration-termsConditions').addEventListener('input', function () {
    if (this.checked) {
        declaration['termsConditions'] = true;
        if (declaration['age']) {
            get('_f1-submit').removeAttribute('disabled');
        }
    } else {
        declaration['termsConditions'] = false;
        get('_f1-submit').setAttribute('disabled', '');
    }
});
get('_f1-declaration-age').addEventListener('input', function () {
    if (this.checked) {
        declaration['age'] = true;
        if (declaration['termsConditions']) {
            get('_f1-submit').removeAttribute('disabled');
        }
    } else {
        declaration['age'] = false;
        get('_f1-submit').setAttribute('disabled', '');
    }
});

// Submit
get('_f1-submit').addEventListener('click', function () {
    this.setAttribute('disabled', '');
    get('_f1-declaration-termsConditions').setAttribute('disabled', '');
    get('_f1-declaration-age').setAttribute('disabled', '');
    console.clear();
    console.log(reservationDetails);

    // Validate Data
    let valid = true;
    let allInputNames = Object.keys(allInputs);
    for (let i = 0; i < allInputNames.length; i++) {
        if (allInputs[allInputNames[i]]['tagName'] == 'id') {
            let element = get(allInputNames[i]);
            if (!inlineValidate(element, allInputs[allInputNames[i]]['message'], allInputs[allInputNames[i]]['type'])) {
                valid = false;
            }
        } else if (allInputs[allInputNames[i]]['tagName'] == 'list') {
            let element = get(allInputNames[i]);
            let elements = element.children;
            for (let a = 0; a < elements.length; a++) {
                if (!validate(elements[a], allInputs[allInputNames[i]]['message'], allInputs[allInputNames[i]]['type']) && element.dataset.valid != 'true') {
                    valid = false;
                    element.setAttribute('data-valid', 'false');
                }
            }
        }
    }



    if (!valid) {
        this.removeAttribute('disabled');
        get('_f1-declaration-termsConditions').removeAttribute('disabled');
        get('_f1-declaration-age').removeAttribute('disabled');
        return;
    }

    // Push data
    reservationRef.push(reservationDetails);
    console.log('Pushed to database');


    // Go to postSubmition
    get('_f1').setAttribute('class', 'complete');
    countDown(30, get('_f1-refreshCountDown-s'), get('_f1-refreshCountDown'));
});

// Post Submition

function countDown(timeRemaining = 1, sSpan, displaySpan) {
    displaySpan.innerHTML = timeRemaining;
    if (timeRemaining == 0) {
        location.reload();
        return;
    } else if (timeRemaining == 1) {
        sSpan.innerHTML = '';
    }
    setTimeout(function() {
        countDown(timeRemaining - 1, sSpan, displaySpan);
    }, 1000);
}


// Overlay 
get('_f1-overlay-close').addEventListener('click', function () {
    get('_f1-overlay').style.display = 'none';
});

let openButtons = getClass('overlay-open');
for (let i = 0; i < openButtons.length; i++) {
    openButtons[i].addEventListener('click', function () {
        get('_f1-overlay').style.display = 'block';
    })
}