// JS version 1
// This is an achieved version


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
    extras: null,
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
    if (dateObject.getDate() < 10) {
        return dateObject.getFullYear() + '-' + (((dateObject.getMonth() + 1) / 100).toString().slice(2)) + '-' + ((dateObject.getDate() / 100).toString().slice(2));
    } else {
        return dateObject.getFullYear() + '-' + (((dateObject.getMonth() + 1) / 100).toString().slice(2)) + '-' + ((dateObject.getDate()).toString());
    }
}



function get(id) {
    return document.getElementById(id)
}
function getClass(name) {
    return document.getElementsByClassName(name);
}


// Inputs

get('pickupLocation').addEventListener('input', function () {
    let selected = this.selectedIndex;
    let locations = [
        null,
        'Dunedin Airport',
        'Ricky\'s Rides Depo' 
    ]
    reservationDetails['pickupLocation'] = locations[selected];
});
get('pickupDate').setAttribute('min', todayHTML);
get('pickupDate').addEventListener('input', function () {
    reservationDetails['pickupDate'] = this.value;
});
get('pickupTime').addEventListener('input', function () {
    reservationDetails['pickupTime'] = this.value;
});

get('returnLocation').addEventListener('input', function () {
    let selected = this.selectedIndex;
    let locations = [
        'Return to same location',
        'Dunedin Airport',
        'Ricky\'s Rides Depo' 
    ]
    reservationDetails['returnLocation'] = locations[selected];
});
get('returnDate').addEventListener('input', function () {
    reservationDetails['returnDate'] = this.value;
});
get('returnTime').addEventListener('input', function () {
    reservationDetails['returnTime'] = this.value;
});

let carCards = getClass('carCard');
for (let i = 0; i < carCards.length; i++) {
    carCards[i].addEventListener('click', function () {
        reservationDetails['vehicle'] = carCards[i].getAttribute('data-name');
        reservationDetails['dailyPrice'] = Number(carCards[i].getAttribute('data-price'));
    });
}

get('firstName').addEventListener('input', function () {
    reservationDetails['firstName'] = this.value;
});
get('lastName').addEventListener('input', function () {
    reservationDetails['lastName'] = this.value;
});
get('DOB').addEventListener('input', function () {
    reservationDetails['DOB'] = this.value;
});
get('mobilePhone').addEventListener('input', function () {
    reservationDetails['mobilePhone'] = this.value;
});
get('email').addEventListener('input', function () {
    reservationDetails['email'] = this.value;
});
get('driversLicense').addEventListener('input', function () {
    reservationDetails['driversLicense'] = this.value;
});


// Submit
get('_f1-submit').addEventListener('click', function () {
    console.log(reservationDetails)
    reservationRef.push(reservationDetails);
    console.log('Pushed to database')
});