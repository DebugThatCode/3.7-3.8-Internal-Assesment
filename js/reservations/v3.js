// JS version 1
// This is an achieved version


const database = firebase.database();
const reservationRef = database.ref('reservations');


let reservationDetails = {
    // Location and time
    pickupLocation: null,
    pickupDate: null,
    returnLocation: 0, // Default to return to same
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
    driversLicense: null
}


// Set current date
const todayJS = new Date();
const todayHTML = getHTMLDate(todayJS);


function getJsDate(HTMLDate) {
    let dateObject = new Date();
    let dateSplit = HTMLDate.split('-')
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
    return document.getElementById(id)
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
                return false
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
            return false
        }

    } else if (validationType == 'buttonSelect') {
        let selected;
        try {
            selected = element.getAttribute('data-name');
        } catch {
            selected = 'false';
        }
        let parent = element.parentElement;
        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i].getAttribute('data-name') == selected) {
                parent.children[i].setAttribute('data-selected', 'true');
            } else {
                parent.children[i].setAttribute('data-selected', 'false');
            }
        }
        return true
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
    let validity = validate(element, validationType);
    inlineMessage(element, !validity, message)
    return validity
}


// Inputs
const allInputs = {
    'pickupLocation': {
        'tagName': 'id',
        'type': 'select'
    },
    'pickupDate': {
        'tagName': 'id',
        'type': 'date'
    },
    'returnLocation': {
        'tagName': 'id',
        'type': 'select'
    },
    'returnDate': {
        'tagName': 'id',
        'type': 'date'
    },
    'carCards': {
        'tagName': 'class',
        'type': 'buttonSelect'
    },
    'firstName': {
        'tagName': 'id',
        'type': 'pattern'
    },
    'lastName': {
        'tagName': 'id',
        'type': 'pattern'
    },
    'DOB': {
        'tagName': 'id',
        'type': 'date'
    },
    'mobilePhone': {
        'tagName': 'id',
        'type': 'pattern'
    },
    'email': {
        'tagName': 'id',
        'type': 'pattern'
    },
    'driversLicense': {
        'tagName': 'id',
        'type': 'pattern'
    }
};

// Pickup location
get('pickupLocation').addEventListener('input', function () {
    if (inlineValidate(this, 'Invalid Location', 'select')) {
        let selected = this.selectedIndex;
        let locations = [
            null,
            'Dunedin Airport',
            'Ricky\'s Rides Depo' 
        ]
        reservationDetails['pickupLocation'] = locations[selected];
        get('overlay-pickupLocation').innerHTML = locations[selected];
    }
});
// Pickup date
get('pickupDate').setAttribute('min', todayHTML);
get('pickupDate').addEventListener('input', function () {
    if (inlineValidate(this, 'Invalid date', 'date')) {
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
    }
    
});


// Return location
get('returnLocation').addEventListener('input', function () {
    let selected = this.selectedIndex;
    let locations = [
        'Return to same location',
        'Dunedin Airport',
        'Ricky\'s Rides Depo' 
    ]
    reservationDetails['returnLocation'] = locations[selected];
    get('overlay-returnLocation').innerHTML = locations[selected];
});
// Return date
get('returnDate').addEventListener('input', function () {
    if (inlineValidate(this, 'Invalid date (max 21 days)', 'date')) {
        reservationDetails['returnDate'] = this.value;
        get('overlay-returnDate').innerHTML = this.value;
        // Calculate car total prices to display
        let PD = getJsDate(get('pickupDate').value);
        let RD = getJsDate(this.value);
        let period = Math.floor((RD.getTime() - PD.getTime()) / (24 * 60 * 60 * 1000));
        reservationDetails['rentPeriod'] = period;
        get('overlay-rentPeriod').innerHTML = period;
        let cards = getClass('carCard');
        for (let i = 0; i < cards.length; i++) {
            let dailyPrice = Number(cards[i].getAttribute('data-price'));
            cards[i].children[1].children[9].children[1].innerHTML = '$ ' + (dailyPrice * period).toFixed(2);
        }

    }
});


// Car cards
let carCards = getClass('carCard');
for (let i = 0; i < carCards.length; i++) {
    carCards[i].addEventListener('click', function () {
        if (validate(carCards[i], 'buttonSelect')) {
            reservationDetails['vehicle'] = carCards[i].getAttribute('data-name');
            get('overlay-vehicle').innerHTML = reservationDetails['vehicle'];
            reservationDetails['dailyPrice'] = Number(carCards[i].getAttribute('data-price'));
            get('overlay-dailyPrice').innerHTML = reservationDetails['dailyPrice'];
            reservationDetails['vehicleTotalPrice'] = reservationDetails['dailyPrice'] * reservationDetails['rentPeriod'];
            get('overlay-totalVehiclePrice').innerHTML = reservationDetails['vehicleTotalPrice'];
        }
    });
}


// First name
get('firstName').addEventListener('input', function () {
    if (inlineValidate(this, 'Invalid first name (2-30 characters)', 'pattern')) {
        reservationDetails['firstName'] = this.value;
        get('overlay-name').innerHTML = reservationDetails['firstName'] + ' ' + reservationDetails['lastName'];
    }
});
// Last Name
get('lastName').addEventListener('input', function () {
    if (inlineValidate(this, 'Invalid last name (2-30 characters)', 'pattern')) {
        reservationDetails['lastName'] = this.value;
        get('overlay-name').innerHTML = reservationDetails['firstName'] + ' ' + reservationDetails['lastName'];
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
    if (inlineValidate(this, 'You must be at least 25 to rent a car (and less than 80)', 'date')) {
        reservationDetails['DOB'] = this.value;
        get('overlay-DOB').innerHTML = reservationDetails['DOB'];
    }
});
// Mobile Phone
get('mobilePhone').addEventListener('input', function () {
    if (inlineValidate(this, 'Invalid mobile phone number', 'pattern')) {
        reservationDetails['mobilePhone'] = this.value;
        get('overlay-phone').innerHTML = this.value;
    }
});
// Email
get('email').addEventListener('input', function () {
    if (inlineValidate(this, 'Invalid email address', 'pattern')) {
        reservationDetails['email'] = this.value;
        get('overlay-email').innerHTML = this.value;
    }
});
// Drivers license
get('driversLicense').addEventListener('input', function () {
    if (inlineValidate(this, 'Invalid drivers license (<span style="font-family:monospace;display:inline;">XX######</span>)', 'pattern')) {
        reservationDetails['driversLicense'] = this.value;
        get('overlay-driverLicense').innerHTML = this.value;
    }
});

// Declaration checkbox's
let declaration = {
    'termsConditions': false,
    'age': false
}
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
            if (!inlineValidate(element, 'Invalid', allInputs[allInputNames[i]]['type'])) {
                valid = false;
            }
        } else {
            let elements = getClass(allInputNames[i]);
            for (let a = 0; a < elements.length; a++) {
                if (!inlineValidate(elements[a], 'Invalid', allInputs[allInputNames[i]]['type'])) {
                    valid = false;
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



    // Check extras
    let temp = reservationDetails['extras'];
    temp = temp.join(', ');
    reservationDetails['extras'] = temp;

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
        location.reload()
        return;
    } else if (timeRemaining == 1) {
        sSpan.innerHTML = '';
    }
    setTimeout(function() {
        countDown(timeRemaining - 1, sSpan, displaySpan);
    }, 1000);
}