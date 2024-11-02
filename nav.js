let is_sign_in = localStorage.getItem('is_sign_in');
const nav = document.getElementById('nav');
nav.innerHTML = `
    <div id="nav-container">
        <a href="index.html" class="logo-nav">Dilevred</a>
        <p class="delivering-to">Delivering to<span> Restorant</span></p>
        ${
            is_sign_in === 'true' ? '<button onclick="numberAuth()">My Account</button>'
            : '<button onclick="numberAuth()">Login</button>'
        }
            
    </div>
`



// alert(is_sign_in)

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

function numberAuth() {
    if(is_sign_in === 'true'){
        window.location.href = 'myAccount.html'
    } else{
        window.location.href = 'numberAuth.html'
    }
    
}


















