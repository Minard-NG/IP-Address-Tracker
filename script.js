//this standard regex validates ipv4 /ipv6 addresses
let regex_for_ip = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;

//this standard regex validates domain names
let regex_for_domain = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g;


//this function filters the user's input
function inputFilter(val) {
    let isEmpty = false,
        isIP = false,
        isDomain = false;

    if (val.trim() === '') {
        isEmpty = true;
    } else {
        if (regex_for_ip.test(val)) {
            isIP = true;
        }
        if (regex_for_domain.test(val)) {
            isDomain = true;
        }
    }

    return {
        isEmpty,
        isIP,
        isDomain
    }
}

//getting reference to the button on the document
let cta_btn = document.getElementById('cta_btn');

//getting reference to the input field on the document
let input_field = document.getElementById('address_input');

//getting referenc to the div with class form
let form_div = document.querySelector('.form');

//binding a click event handler to the button
cta_btn.addEventListener('click', (evt) => {
    let validity = inputFilter(input_field.value)

    if (!validity.isEmpty) {
        //if input field is not empty
        form_div.style.outline = "0";
        input_field.placeholder = "Search for any IP address or domain";

        if (!validity.isIP && !validity.isDomain) {
            //if input field value is neither a valid IP / domain name
            form_div.style.outline = "2px solid red";
            input_field.value = '';
            input_field.placeholder = "Invalid IP/Domain name!";
        } else {
            if(validity.isIP){
                //if input field value is a valid IP
                console.log('valid IP')
            }

            if(validity.isDomain){
                //if input field value is a valid domain name
                console.log('valid Domain name')
            }
        }
    } else {
        //if input field is empty or filled with whitespace(s)
        form_div.style.outline = "2px solid red";
        input_field.value = '';
        input_field.placeholder = "Cannot be empty!";

    }
});
