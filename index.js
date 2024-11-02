import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { db } from "./firebase.js";


let is_sign_in = localStorage.getItem('is_sign_in');
console.log(is_sign_in)

// if (is_sign_in === null || is_sign_in === 'false') {
//   window.location.href = 'index.html';
// } else {
//   alert('User is signed in');
// }

// Function to set 'is_sign_in' in localStorage when user signs in
// function signIn() {
//   localStorage.setItem('is_sign_in', 'true');
// }

// Function to set 'is_sign_in' to false when user signs out
// function signOut() {
//   localStorage.setItem('is_sign_in', 'false');
// }


function displayRestorants(restorants) {
  const restorantsContainer = document.getElementById("restorants-container");

  restorants.forEach((item) => {
    const restorant = item.data();  // Get restaurant data from document
    console.log(item.id,'restorant: ',restorant.restorant)
    const Restorant = document.createElement("div");
    Restorant.innerHTML= `
      <img src="${restorant.urlimg}" alt="image">
      <a href="menu.html?id=${encodeURIComponent(item.id)}&title=${encodeURIComponent(restorant.restorant)}">${restorant.restorant}</a>
    `;
    Restorant.href = `menu.html?id=${encodeURIComponent(item.id)}&title=${encodeURIComponent(restorant.restorant)}`

    restorantsContainer.appendChild(Restorant);
  });
}

function listenToOrders() {
  const ordersCollection = collection(db, "restorants");

  onSnapshot(ordersCollection, (snapshot) => {
    const restorants = snapshot.docs;
    displayRestorants(restorants);
  });
}

window.onload = listenToOrders;
