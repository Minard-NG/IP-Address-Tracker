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

//getting reference to the div with class form
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
            if (validity.isIP) {
                //if input field value is a valid IP
                getData(input_field.value, "ipaddress")
            }

            if (validity.isDomain) {
                //if input field value is a valid domain name
                getData(input_field.value, "domain")
            }
        }
    } else {
        //if input field is empty or filled with whitespace(s)
        form_div.style.outline = "2px solid red";
        input_field.value = '';
        input_field.placeholder = "Cannot be empty!";

    }
});

//asynchronous function to handle call to the IPify api
async function getData(url = "", mode = "initial") {
    let response;
  
    if (mode === "initial") {
        response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_pshocbxkdKtwJm1wCdPya2EaR3o0l`)
    }
    if (mode === "ipaddress") {
        response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_pshocbxkdKtwJm1wCdPya2EaR3o0l&ipaddress=${url}`)
    }
    if (mode === "domain") {
        response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_pshocbxkdKtwJm1wCdPya2EaR3o0l&domain=${url}`)

    }

    let data = await response.json();
    render(data);
}

//get reference to the p tags needed for render
let ip = document.getElementById('ip');
let locs = document.getElementById('location');
let timez = document.getElementById('timezone');
let isp = document.getElementById('isp');

function render(data) {
    ip.innerText = data.ip;
    locs.innerText = `${data.location.city}, ${data.location.region} ${data.location.country}.`;
    timez.innerText = `UTC ${data.location.timezone}`;
    isp.innerText = data.isp;

    let map = L.map('map').setView([data.location.lat, data.location.lng], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let marker = L.marker([data.location.lat, data.location.lng]).addTo(map);
}

//default render
//getData();



