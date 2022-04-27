let car = [];
let unity = 1;
let pizzaKey = 0;
const q = (el) => document.querySelector(el);
const qs = (el) => document.querySelectorAll(el);

// Listagem das pizzas

pizzaJson.map((pizza, index) => {
    let pizzaItem = q('.models .pizza-item').cloneNode(true);
    
    pizzaItem.setAttribute('data-key', index);

    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img; //imagem da pizza
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2)}`; //valor da pizza
    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name; //nome da pizza
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description; //descrição

    pizzaItem.querySelector('a').addEventListener('click', (e)=> {
        e.preventDefault();
        unity = 1;
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        pizzaKey = key;
        
        q('.pizzaBig img').src = pizzaJson[key].img;
        q('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        q('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        q('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        q('.pizzaInfo--size.selected').classList.remove('selected');
        qs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        q('.pizzaInfo--qt').innerHTML = unity;        
        q('.pizzaWindowArea').style.opacity = 0;        
        q('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=> {
            q('.pizzaWindowArea').style.opacity = 1;
        }, 250);
        
    });
    q('.pizza-area').append(pizzaItem);

});

// Eventos da area da janela da pizza

function closeWindow () {
    q('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=> {
        q('.pizzaWindowArea').style.display = 'none';
    }, 250);
}

qs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((e)=> {
    e.addEventListener('click', closeWindow);
});

q('.pizzaInfo--qtmenos').addEventListener('click', ()=> {
    if(unity > 1) {
        unity--;
        q('.pizzaInfo--qt').innerHTML = unity;
    };
});
q('.pizzaInfo--qtmais').addEventListener('click', ()=> {
    unity++;
    q('.pizzaInfo--qt').innerHTML = unity;
});

qs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', ()=>{    
        q('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
        let sizePizza = sizeIndex;
        let price = pizzaJson[pizzaKey].price;;
        if(sizePizza == 0) {price *= 0.6}
        else if(sizePizza == 1) {price *= 0.8};
        q('.pizzaInfo--actualPrice').innerHTML = `R$ ${price.toFixed(2)}`;
    });
});

q('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(q('.pizzaInfo--size.selected').getAttribute('data-key'));    
    car.push({
        id: pizzaJson[pizzaKey].id,
        size,
        qt: unity
    });    
    closeWindow();
    updateCar();
});

q('.menu-openner').addEventListener('click', (item)=>{
    if(car.length > 0) {
        q('aside').style.left = '0';
    }
});

q('.menu-closer').addEventListener('click', ()=>{
    q('aside').style.left = '100vw';
});

function updateCar () {
    q('.menu-openner span').innerHTML = car.length;

    if(car.length > 0) {
        q('aside').classList.add('show');
        q('.cart').innerHTML = '';
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        for(let i in car) {            
            let pizzaItem = pizzaJson.find((item)=> {
                return item.id == car[i].id;                
            });            
            
            let carItem = q('.models .cart--item').cloneNode(true);  
            let price = pizzaItem.price;             
            let sizeName;            
            
            if(car[i].size == 0) {
                price *= 0.6;
            } else if(car[i].size == 1) {
                price *= 0.8;
            }
            subtotal += price * car[i].qt;                
            
            switch(car[i].size) {
                case 0: 
                    sizeName = 'Pequena';
                    break;
                case 1:
                    sizeName = 'Média';
                    break;
                case 2: 
                    sizeName = 'Grande';
                    break;
            }           
            
            carItem.querySelector('img').src = pizzaItem.img;            
            carItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name} (${sizeName})`;
            carItem.querySelector('.cart--item--qt').innerHTML = car[i].qt;
            carItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(car[i].qt > 1) {
                    car[i].qt--;
                } else {
                    car.splice(i, 1);
                }
                updateCar();
            });
            carItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                car[i].qt++;
                updateCar();
            });

            q('.cart').append(carItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        q('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        q('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        q('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        q('aside').classList.remove('show');
        q('aside').style.left = '100vw';
    }
}