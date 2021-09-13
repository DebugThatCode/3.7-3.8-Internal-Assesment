


function sigFig(number, precision = 1, SF = false) {
    if (!precision >= 1 && !precision <= 21) {
        console.error('Invalid Precision: ' + precision)
        return
    }
    let SFnumber = number.toPrecision(precision);
    if (SF) {
        return Number(SFnumber);
    }
    if (Number.isInteger(number)) {
        if (number >= 0) {
            let b = SFnumber.slice(0, precision + 1).split('.').join('');
            let zeroAmount = String(number).length - precision;
            return Number(b + '0'.repeat(zeroAmount));
        } else {
            let b = SFnumber.slice(0, precision + 2).split('.').join('');
            return parseInt(b, 10);
        }
    } else {
        if (number >= 0) {
            let b = SFnumber.slice(0, precision + 1).split('.').join('');
            // let zeroAmount = String(number).length - precision - 2;
            let zeroAmount = Math.abs(SFnumber.split('e')[1]);
            console.log('zeroAmount', zeroAmount)
            return Number('0.' + '0'.repeat(zeroAmount - 2) + b);
        } else {
            let b = SFnumber.slice(0, precision + 2).split('.').join('');
            return parseInt(b, 10);
        }
    }
}

function sigFigV2(number, precision) {
    return Number(number.toPrecision(precision));
}