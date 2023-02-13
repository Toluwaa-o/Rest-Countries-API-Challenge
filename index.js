const container = document.querySelector('.container');
const searchField = document.getElementById('searchField');
const continent = document.getElementById('continent');
const changer = document.getElementById('colorChange');
const root = document.querySelector(':root');
const x = window.matchMedia('(min-width:768px)')

changer.addEventListener('click', ()=>{
    const modeText = document.getElementById('darkMode');
    if(modeText.textContent === 'Light Mode'){
        changer.innerHTML = `
        <svg width="17" height="17" fill="none"  stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"></path>
              </svg>
            <p id="darkMode">Dark Mode</p>
        `;
        root.style.setProperty('--LMText', 'hsl(0, 0%, 100%)')
        root.style.setProperty('--LMInput', 'hsl(0, 0%, 100%)')
        root.style.setProperty('--LMBg', 'hsl(207, 26%, 17%)')
        root.style.setProperty('--DMTextLMElements', 'hsl(209, 23%, 22%)')
    }else {
        changer.innerHTML = `
        <svg width="17" height="17" fill="none" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"></path>
        </svg>
        <p id="darkMode">Light Mode</p>
        `;
        
        root.style.setProperty('--LMText', 'hsl(200, 15%, 8%)')
        root.style.setProperty('--LMInput', 'hsl(0, 0%, 52%)')
        root.style.setProperty('--LMBg', 'hsl(0, 0%, 98%)')
        root.style.setProperty('--DMTextLMElements', 'hsl(0, 0%, 100%)')
    }
})

async function fetchData(){
    const response = await fetch('https://restcountries.com/v3.1/all');
    const result = await response.json();
    result.forEach(country => {
        container.insertAdjacentHTML('beforeend', `
        <div class='card'>
        <img src='${country.flags.png}' alt='${country.name.official}'>
        <div>
        <h2 class='cname'>${country.name.official}</h2>
        <p>Population: <span>${country.population.toLocaleString('en-US')}</span></p>
        <p>Region: <span class='region'>${country.region}</span></p>
        <p>Capital: <span>${country.capital}</span></p>
        </div>
        </div>
        `)

        continent.addEventListener('change', ()=>{
            let cards = document.querySelectorAll('.card');
            let regions = document.querySelectorAll('.region')
            for(let i = 0; i<cards.length; i++){
                if(continent.value === ''){
                    cards[i].style.display = 'unset';
                }else {
                    if(regions[i].textContent === continent.value){
                        cards[i].style.display = 'unset';
                    }else {
                        cards[i].style.display = 'none';
                    }
                }
            }
        })

        searchField.addEventListener('change', ()=>{
            let countName = document.querySelectorAll('.cname');
            let cards = document.querySelectorAll('.card');
            for(let i=0; i<cards.length; i++){
                if(searchField.value === ''){
                    cards[i].style.display = 'unset';
                }else {
                    if(countName[i].textContent.includes(searchField.value)){
                        cards[i].style.display = 'unset';
                    }else {
                        cards[i].style.display = 'none';
                    }
                }
            }
        })
    })

    let expandSec = document.querySelector('.expand');
    let cards = document.querySelectorAll('.card');
    let expandedImage = document.getElementById('expandedImg');
    let expName = document.getElementById('expandedName');
    let spans = document.querySelectorAll('.spans')
    let borders = document.querySelector('.bordering')
    for(let i = 0; i<cards.length; i++){
        cards[i].addEventListener('click', ()=>{
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            expName.textContent = cards[i].lastElementChild.firstElementChild.textContent
            expandedImage.src = cards[i].children[0].src;
            if(x.matches){
                expandSec.style.display = 'grid';
            }else {
                expandSec.style.display = 'block';
            }
            let keepKey = null;
            for(const off in result[i].name.nativeName){
                keepKey = off;
                spans[0].textContent = result[i].name.nativeName[off].official
            }
            spans[1].textContent = result[i].population.toLocaleString('en-US');
            spans[2].textContent = result[i].region;
            spans[3].textContent = result[i].subregion;
            spans[4].textContent = result[i].capital;
            spans[5].textContent = result[i].tld;
            for(const off in result[i].currencies){
                spans[6].textContent = result[i].currencies[off].name
            }
            for(const off in result[i].languages){
                spans[7].textContent = result[i].languages[off]
            }
            if(result[i].hasOwnProperty('borders')){
                borders.innerHTML = `<h3>Bordering Countries: </h3>`;
                for(let j = 0; j <result[i].borders.length; j++){
                    for(country of result){
                        if(country.cca3 === result[i].borders[j] || country.cca2 === result[i].borders[j] || country.cioc === result[i].borders[j]){
                            borders.innerHTML += `
                            <p class="bcountries">${country.name.official}</p>
                            `;
                        }
                    }
                    borderClick()
                }
            }
        });
        }

   function borderClick(){
        let borderCountries = document.querySelectorAll('.bcountries');
        borderCountries.forEach(count => count.addEventListener('click', borderCheck))
   }

   function borderCheck(){
    for(country of result){
        if(this.textContent === country.name.official){
            borders.innerHTML = `<h3>Bordering Countries: </h3>`;
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            expName.textContent = this.textContent;
            expandedImage.src = country.flags.png;
            if(x.matches){
                expandSec.style.display = 'grid';
            }else {
                expandSec.style.display = 'block';
            }
            let keepKey = null;
            for(const off in country.name.nativeName){
                keepKey = off;
                spans[0].textContent = country.name.nativeName[off].official
            }
            spans[1].textContent = country.population.toLocaleString('en-US');
            spans[2].textContent = country.region;
            spans[3].textContent = country.subregion;
            spans[4].textContent = country.capital;
            spans[5].textContent = country.tld;
            for(const off in country.currencies){
                spans[6].textContent = country.currencies[off].name
            }
            for(const off in country.languages){
                spans[7].textContent = country.languages[off]
            }
            if(country.hasOwnProperty('borders')){
                borders.innerHTML = `<h3>Bordering Countries: </h3>`;
                for(let j = 0; j <country.borders.length; j++){
                    for(counttt of result){
                        if(counttt.cca3 === country.borders[j] || counttt.cca2 === country.borders[j] || counttt.cioc === country.borders[j]){
                            borders.innerHTML += `
                            <p class="bcountries">${counttt.name.official}</p>
                            `;
                        }
                    }
                    borderClick()
                }
            }
        }
    }
   }

    let backBtn = document.querySelector('.back');
    backBtn.addEventListener('click', ()=>{
        expandSec.style.display = 'none'
        borders.innerHTML = `<h3>Bordering Countries: </h3>`;
        })
}

window.addEventListener('load', fetchData)
