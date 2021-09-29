// JS version 2


const database = firebase.database();
const reservationRef = database.ref('reservations');


let reservationDetails = {
    // Location and time
    pickupLocation: null,
    pickupDate: null,
    pickupTime: null,
    returnLocation: 0, // Default to return to same
    returnDate: null,
    returnTime: null,
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

    if (dateObject.getMonth() < 10) {
        HTMLDate += '0' + dateObject.getMonth() + '-';
    } else {
        HTMLDate += dateObject.getMonth() + '-';
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
    let types = ['pattern', 'select', 'date', 'time', 'buttonSelect'];
    if (validationType == 'pattern') {
        if (element.getAttributeNames().includes('required')) {
            if (element.value == '' || element.value == null || element.value == undefined) {
                return false;
            }
        }
        return element.checkValidity();
    } else if (validationType == 'date') {
        if (element.getAttributeNames().includes('required')) {
            return element.checkValidity();
        } else {
            return true;
        }
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
                } else {
                    element.parentElement.children[i].innerHTML = '';
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

// inlineValidate(get('email'), 'Error', 'pattern')

// Inputs
const allinputs = {
    'pickupLocation': {
        'tagName': 'id',
        'type': 'select'
    },
    'pickupDate': {
        'tagName': 'id',
        'type': 'date'
    },
    'pickupTime': {
        'tagName': 'id',
        'type': 'time'
    },
    'returnLocation': {
        'tagName': 'id',
        'type': 'select'
    },
    'returnDate': {
        'tagName': 'id',
        'type': 'date'
    },
    'returnTime': {
        'tagName': 'id',
        'type': 'time'
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
    let selected = this.selectedIndex;
    let locations = [
        null,
        'Dunedin Airport',
        'Ricky\'s Rides Depo' 
    ]
    reservationDetails['pickupLocation'] = locations[selected];
});
// Pickup date
get('pickupDate').setAttribute('min', todayHTML);
get('pickupDate').addEventListener('input', function () {
    reservationDetails['pickupDate'] = this.value;
});
// Pickup time
get('pickupTime').addEventListener('input', function () {
    reservationDetails['pickupTime'] = this.value;
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
});
// Return date
get('returnDate').addEventListener('input', function () {
    reservationDetails['returnDate'] = this.value;
});
// Return time
get('returnTime').addEventListener('input', function () {
    reservationDetails['returnTime'] = this.value;
});


// Car cards
let carCards = getClass('carCard');
for (let i = 0; i < carCards.length; i++) {
    carCards[i].addEventListener('click', function () {
        reservationDetails['vehicle'] = carCards[i].getAttribute('data-name');
        reservationDetails['dailyPrice'] = Number(carCards[i].getAttribute('data-price'));
    });
}


// First name
get('firstName').addEventListener('input', function () {
    if (inlineValidate(this, 'Invalid first name (2-30 characters)', 'pattern')) {
        reservationDetails['firstName'] = this.value;
    }
});
// Last Name
get('lastName').addEventListener('input', function () {
    if (inlineValidate(this, 'Invalid last name (2-30 characters)', 'pattern')) {
        reservationDetails['lastName'] = this.value;
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
    }
});
// Mobile Pjhoen
get('mobilePhone').addEventListener('input', function () {
    if (inlineValidate(this, 'Invalid mobile phone number', 'pattern')) {
        reservationDetails['mobilePhone'] = this.value;
    }
});
// Email
get('email').addEventListener('input', function () {
    if (inlineValidate(this, 'Invalid email address', 'pattern')) {
        reservationDetails['email'] = this.value;
    }
});
// Drivers license
get('driversLicense').addEventListener('input', function () {
    if (inlineValidate(this, 'Invalid drivers license', 'pattern')) {
        reservationDetails['driversLicense'] = this.value;
    }
});


// Submit
get('_f1-submit').addEventListener('click', function () {
    console.log(reservationDetails);

    // Validate Data




    // Check extras
    let temp = reservationDetails['extras'];
    temp = temp.join(', ');
    reservationDetails['extras'] = temp;

    // Push data
    reservationRef.push(reservationDetails);
    console.log('Pushed to database')
});