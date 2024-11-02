import { menus, food_list } from "./menuList.js";
import { db } from "./firebase.js";
import {
    doc,
    collection,
    addDoc,
    onSnapshot,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
console.log('food: ',food_list)

const title = document.getElementById('menu-title');
const urlParams = new URLSearchParams(window.location.search);
const ID = urlParams.get('id');
const menu = menus.filter((item) => item.restoId == ID);
const TITLE = urlParams.get('title');
title.innerHTML = `${TITLE} menu`


let restorant = {};
let cart = [];
let quantitys = [];
let orders = [];
let total = 0;

function renderMenu() {
    const menuContainer = document.getElementById("menu");
    menuContainer.innerHTML = ""; // Clear existing items
    menu.forEach((item) => {
        const menuItem = document.createElement("div");
        menuItem.classList.add("menu-item");
        const restoName = document.createElement('h3');
        restoName.innerHTML = item.name;
        restoName.style.cursor = 'pointer'
        restoName.onclick = () => showPopUp(item.id)
        menuItem.appendChild(restoName)
        menuContainer.appendChild(menuItem);
        let spanId = document.getElementById('quantity-' + item.id);
        quantitys.push(spanId)
    });
}

function showPopUp(id){
    const pop_up_container = document.getElementById('pop-up-container');
    const pop_up = document.getElementById('pop-up');
    pop_up_container.style.display = 'flex';
    food_list.forEach((item) => {
        const pop_up_item = document.createElement('div');
        pop_up_item.classList.add('pop-up-item')
        pop_up_item.innerHTML = `
            <p id="pop-up-name">${item.name}</p>
            <div id="pop-up-item-price">
                <p>${item.price} $</p>
                <div>
                    <button onclick="changeQuantity(${id}, ${item.price})">+</button>
                    <button onclick="changeQuantity(${id}, -${item.price})">-</button>
                </div>
            </div>
        `
        pop_up.appendChild(pop_up_item);
    })
    const total_pop_up = document.createElement('div');
    total_pop_up.classList.add('total-pop-up');
    total_pop_up.innerHTML = '<p id="total-pop-up">0</p>';
    const pop_up_buttons = document.createElement('div');
    pop_up_buttons.classList.add('pop-up-buttons')
    const cancel_button = document.createElement('button');
    const add_button = document.createElement('button');
    cancel_button.innerHTML = 'Cancel';
    cancel_button.onclick = () => cancel(id);
    add_button.innerHTML = 'Add';
    add_button.onclick = () => addToCart(id);
    pop_up_buttons.appendChild(cancel_button);
    pop_up_buttons.appendChild(add_button);
    pop_up.appendChild(total_pop_up);
    pop_up.appendChild(pop_up_buttons);
}

function cancel (itemId) {
    const pop_up_container = document.getElementById('pop-up-container');
    const total = document.getElementById('total-pop-up');
    const pop_up = document.getElementById('pop-up');
    const cartItem = cart.find((cartItem) => cartItem.id === itemId);
    let currentPrice = parseInt(total.innerText);
    if(cartItem){
        cartItem.quantity = cartItem.quantity - currentPrice;
    }
    pop_up.innerHTML = ''
    pop_up_container.style.display = 'none';
}


window.changeQuantity  = function changeQuantity(itemId, change) {
    const quantityElement = document.getElementById('total-pop-up');
    let currentQuantity = parseInt(quantityElement.innerText);
    if (currentQuantity + change > 0) {
        quantityElement.innerText = currentQuantity + change;
        const cartItem = cart.find((cartItem) => cartItem.id === itemId);
        if(cartItem){
            if (change > 0){
                cartItem.quantity += 1;
            } else{
                cartItem.quantity -= 1
            }
            
        }else{
            if (change > 0){
                cart.push({id: itemId, quantity: 1, price: 0});
            }
        }
        
    } else{
        quantityElement.innerText = 0;
    }
    console.log(cart)
}

// window.changeQuantity = changeQuantity;

window.addToCart = function addToCart(itemId) {
    const pop_up_container = document.getElementById('pop-up-container');
    const pop_up = document.getElementById('pop-up');
    const quantity = parseInt(document.getElementById('total-pop-up').innerText);
    const item = menu.find((item) => item.id === itemId);
    const cartItem = cart.find((cartItem) => cartItem.id === itemId);
    if (cartItem) {
        cartItem.price += quantity;
    } else {
        cart.push({ ...item, price: quantity });
    }

    renderCart();
    pop_up.innerHTML = ''
    pop_up_container.style.display = 'none';
}

function renderCart() {
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = ""; // Clear existing cart items

    let totalPrice = 0;
    orders = [];

    cart.forEach((item) => {
        if (item.quantity > 0){
            const cartItem = document.createElement("div");
            cartItem.innerHTML = `
                <p>${item.name} x${item.quantity} - $${(item.price).toFixed(2)}</p>
            `;
            orders.push(`${item.name} x${item.quantity}`)
            totalPrice += item.price * item.quantity;
            cartContainer.appendChild(cartItem);
        }
        
    });

    document.getElementById("total-price").innerText = `${totalPrice.toFixed(2)}`;
    
    // const total = document.getElementById('total-price').innerText;
    // console.log(parseInt(total))
    total = totalPrice;
}

window.document.getElementById("confirm-order").addEventListener("click",async () => {
    if (cart.length === 0) {
        alert("Your cart is empty.");
    } else {
        await addOrder();
        alert("Order confirmed!");
        quantitys.forEach((item) => {
            item.innerHTML = 1;
        })
        cart = [];
        renderCart();
    }
});

async function addOrder() {
    const total = document.getElementById('total-price').innerText;
    const date = new Date();
    try {
        await addDoc(collection(db, "orders"), {
            companyName: TITLE,
            createdAt: date,
            status: 'pending',
            currency: 'MAD',
            store: ID,
            updatedAt: date,
            total: parseInt(total),
        });
        alert("Commande ajoutée avec succès");
    } catch (error) {
        console.error("Error adding order: ", error);
    }
}

function listenToOrders() {
    const ordersCollection = collection(db, "restorants");

    onSnapshot(ordersCollection, (snapshot) => {
        const restos = snapshot.docs;
        restos.forEach((item) => {
            const resto = item.data();
            if(item.id == ID){
                restorant = resto;
            }
        })
        console.log(restorant)
    });
}
listenToOrders();

renderMenu();