import './css/styles.css';
import { fetchCountries } from "./fetchCountries";
import Notiflix from 'notiflix';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const inputElement = document.querySelector('input#search-box');
const listElement = document.querySelector('.country-list');
const countryInfoElement = document.querySelector('.country-info');

function search(event) {

let valueSearch = inputElement.value.trim()

if (valueSearch===""){
   return Notiflix.Notify.warning("Oops, there is no country with that name")
}

    fetchCountries(valueSearch)
    .then(data => {
        if(data.length>10){
            Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
        } else if ( 2 <= data.length && data.length <= 10) {
            
            data.map(({flags,name}) =>{
                
                let htmlText = `
                <li class="country-list-element">
                  <img class="country-list-flag" src=${flags.svg} alt=${name.official}>
                  <span class="country-list-text">${name.official}</span>
                </li>
                `
                listElement.insertAdjacentHTML("beforeend", htmlText)
                
            })
            
        } else if(data.length === 1) {
            data.map(({flags,name,capital,population,languages}) =>{
                let htmlTextSecond = `
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
                countryInfoElement.insertAdjacentHTML("beforeend", htmlTextSecond)
            }) 
        }
    })
    .catch(error => {
        Notiflix.Notify.warning("Oops, there is no country with that name")
    })


// Удаляем со списка
    const liElementChange = document.querySelectorAll('.country-list-element');

    if(liElementChange) {
        liElementChange.forEach(function(element){
            element.remove()
        })
    }

    const cardElement = document.querySelector('.card');

    if(cardElement) {
        cardElement.remove()
    }


}



inputElement.addEventListener('input', debounce(search, DEBOUNCE_DELAY, 
    {
    leading: true,
    trailing: true,
    }
))

