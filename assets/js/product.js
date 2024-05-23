
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const productID = params.id

// input
const input = document.querySelector(".order__quantity--input");
const minusBtn = document.querySelector(".minus");
const plusBtn = document.querySelector(".plus");

minusBtn.onclick = () => (input.value > 0) ?input.value-- :input.value;
plusBtn.onclick = () => input.value++;




// *******************************************************************************************************
// CART AND BADGE
// *******************************************************************************************************
function updateBadge() {
  const cartList = JSON.parse(localStorage.getItem('cartList'));
  const badge = document.querySelector('.btn-badge');
  badge.innerHTML = cartList.length || 0
}



const cartButton = document.querySelector('.cart-open-btn');
const cartDiv = document.querySelector('.cart');
cartButton.addEventListener('click', () => cartDiv.classList.toggle('show'));



async function showCart() { await drawCart(); cartDiv.classList.add('show')}



async function drawCart() {
  const cartListString = localStorage.getItem('cartList');
  if (!cartListString) {
    return 
  }
  
  const cartList = JSON.parse(cartListString);
  
  const cartElementsDiv = document.querySelector('.cart-elements');

  cartElementsDiv.innerHTML = ""
  await cartList.forEach( async item => {
    const product = await APP.fetch("products/"+item.product)
    if (product.success !== false) {

      const listitem = document.createElement('div');
      listitem.className = "cart-element";   
      listitem.innerHTML = `
            <img src="${product.image}">
            <p class="cart-element-name">${product.name}</p>
            <p class="cart-element-quantity">${item.quantity}</p>
            <button class="cart-element-delete-btn"><ion-icon name="trash-outline" aria-hidden="true"></ion-icon></button>
      `
        
      listitem.querySelector(".cart-element-delete-btn").addEventListener("click", () => {
        let cartList = JSON.parse(localStorage.getItem('cartList'));

        let indexToDelete = cartList.findIndex(item => item.product === item.product);
        
        if (indexToDelete !== -1) {
            cartList.splice(indexToDelete, 1);
            localStorage.setItem('cartList', JSON.stringify(cartList));
            drawCart()
        }
      })

      cartElementsDiv.appendChild(listitem);
      
      
    }
  })
  updateBadge()
}

drawCart()




// *******************************************************************************************************
// HANDLE NAVBAR AND CART BUTTONS
// *******************************************************************************************************
const userbtn = document.querySelector(".user-btn");
const headerActionLogin = document.querySelector(".header-btns");
 
if (localStorage.getItem("token") && localStorage.getItem("userId")) {
  APP.fetch("users/" + localStorage.getItem("userId")).then(data => {
    if (data.success) {
      userbtn.classList.add("show")
      document.querySelector('.cart-buy-btn').classList.add("show")
    } else {
      headerActionLogin.classList.add("show")
      document.querySelector(".cart-login-btn").classList.add("show")
    }
  })
} else {
      headerActionLogin.classList.add("show")
      document.querySelector(".cart-login-btn").classList.add("show")
}




async function initialProducts() {
  const product = await APP.fetch("products/"+productID)
    
  document.querySelector(".slider__img").src = product.image
  document.querySelector(".product__info--brand").innerHTML = product.brand
  document.querySelector(".product__info--title").innerHTML = product.name
  document.querySelector(".product__info--description").innerHTML = product.description
  if (product.promution) {
    document.querySelector(".info__pricing--price").innerHTML = product.promution + " DA"
    document.querySelector(".info__pricing--before").innerHTML = `<strike>${product.price} DA</strike>`
  } else {
    document.querySelector(".info__pricing--price").innerHTML = product.price + " DA"
    document.querySelector(".info__pricing--discount").style.display = "none"

    document.querySelector(".info__pricing--before").innerHTML = ``
  }

  const addToCartButton = document.querySelector('.order__cart');
  addToCartButton.addEventListener('click', () => {

    addToCart(product._id, parseInt(document.querySelector(".order__quantity--input").value));
  });

}  


function addToCart(productId, quantity) {
  if (quantity == 0) return
  const cartListString = localStorage.getItem('cartList');
  let cartList = cartListString ? JSON.parse(cartListString) : [];

  const existingCartItem = cartList.find(item => item.product === productId);
  if (existingCartItem) {
    existingCartItem.quantity += quantity;
  } else {
    cartList.push({ product: productId, quantity: quantity });
  }

  localStorage.setItem('cartList', JSON.stringify(cartList));
  drawCart()
}

initialProducts()