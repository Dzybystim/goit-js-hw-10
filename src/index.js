import './css/styles.css';

import { fetchCountries } from "./fetchCountries";
import Notiflix from 'notiflix';

const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const inputElement = document.querySelector('input#search-box');
const listElement = document.querySelector('.country-list');
const countryInfoElement = document.querySelector('.country-info');

/////////////////////////////////////////////////////////////////////Функции всплывающих сообщений

function oops(){
    Notiflix.Notify.warning("Oops, there is no country with that name");
};

function specificName(){
    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
};
/////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////// Функции создания HTML кода

function htmlText(flags, name) {
   let text = `
   <li class="country-list-element">
     <img class="country-list-flag" src=${flags.svg} alt=${name.official}>
     <span class="country-list-text">${name.official}</span>
   </li>
   `
   return text
}

function htmlTextSecond(flags,name,capital,population,languages) {
    let text =  `
    <div class="card">
    <div class="card-header">
    <img class="country-list-flag" src=${flags.svg} alt=${name.official}>
    <h1 class="card-name_country">${name.official}</h1>
    </div>
    <ul class="country-list">
    <li class="country-list-element"><span class="country-list-text">Capital:</span>${capital}</li>
    <li class="country-list-element"><span class="country-list-text">Population:</span>${population}</li>
    <li class="country-list-element"><span class="country-list-text">Languages:</span>${Object.values(languages)}</li>
    </ul>
    </div>
    `
    return text
}
//////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////Функции удаления прошлых вызовов
function removeList(liElementChange) {
    if(liElementChange) {
        liElementChange.forEach(function(element){
            element.remove()
        })
    }
}

function removeCard(cardElement) {
    if(cardElement) {
        cardElement.remove()
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////Функция что вызываеться при input
function search(event) {

let valueSearch = inputElement.value.trim()

if (valueSearch===""){
   return oops()
}

    fetchCountries(valueSearch)
    .then(data => {
        if(data.length>10){
            specificName()
        } else if ( 2 <= data.length && data.length <= 10) {
            
            data.map(({flags,name}) =>{
 
                listElement.insertAdjacentHTML("beforeend", htmlText(flags, name))
                
            })
            
        } else if(data.length === 1) {
            data.map(({flags,name,capital,population,languages}) =>{

                countryInfoElement.insertAdjacentHTML("beforeend", htmlTextSecond(flags,name,capital,population,languages))

            }) 
        }
    })
    .catch(error => {
        oops()
    })


// Удаляем то что было вызвано раньше
    const liElementChange = document.querySelectorAll('.country-list-element');

    removeList(liElementChange)

    const cardElement = document.querySelector('.card');

    removeCard(cardElement)


}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////Вешаем обработку событий
inputElement.addEventListener('input', debounce(search, DEBOUNCE_DELAY, 
    {
    leading: true,
    trailing: true,
    }
))

