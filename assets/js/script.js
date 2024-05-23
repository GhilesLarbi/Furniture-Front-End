//'use strict';



/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if ((Array.isArray(elem) || elem instanceof NodeList) && elem.length >= 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);



/**
 * header & back top btn active when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");


const showElemOnScroll = function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}


// window.addEventListener("scroll", (e)=> {
//   if (window.scrollY > 100) {
//     header.classList.add("active");
//     backTopBtn.classList.add("active");
//   } else {
//     header.classList.remove("active");
//     backTopBtn.classList.remove("active");
//   }
// })


addEventOnElem(window, "scroll", showElemOnScroll);


// *******************************************************************************************************
// CART AND BADGE
// *******************************************************************************************************
function updateBadge() {
  const cartList = JSON.parse(localStorage.getItem('cartList'));
  const badge = document.querySelector('.btn-badge');
  badge.innerHTML = cartList.length
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

// *******************************************************************************************************
// HERO SECTION
// *******************************************************************************************************
function addFeaturedProductsToHeroList(products) {
  const heroList = document.querySelector('.hero-list');
  let count = 0
  products.forEach((product, index) => {
    let figureStyle, imgStyle;

      if (index === 0) {
        figureStyle = '--width: 285px; --height: 396px;';
        imgStyle = 'width: 285px; height: 396px;';
      } else if (index === 1) {
        figureStyle = '--width: 568px; --height: 389px;';
        imgStyle = 'width: 568px; height: 389px;';
      } else if (index === 2) {
        figureStyle = '--width: 285px; --height: 396px;';
        imgStyle = 'width: 285px; height: 396px;';
      } else if (index === 3) {
        figureStyle = '--width: 580px; --height: 213px;';
        imgStyle = 'width: 580px; height: 213px;';
      } else if (index === 4) {
        figureStyle = '--width: 580px; --height: 213px;';
        imgStyle = 'width: 580px; height: 213px;';
      }


    if (product.isFeatured) {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="hero-card">
          <figure class="card-banner img-holder" style="${figureStyle}">
            <img src="${product.image}" style="${imgStyle}" alt="${product.name}" class="img-cover">
          </figure>
          <div class="card-content">
            <h3>
              <a href="/pages/product.html?id=${product.id}" class="card-title">${product.name}</a>
            </h3>
            <p class="card-text">${product.category? product.category.name : ""}</p>
          </div>
        </div>
      `;
      // Add 'colspan-2' class if the product index is 1, 3, or 4
      if ([1, 3, 4].includes(count)) li.classList.add('colspan-2');
      if (count < 5) heroList.appendChild(li);
      count += 1
      
    }
  });
}



// *******************************************************************************************************
// INITIAL PRODUCTS AND HERO SECTION
// *******************************************************************************************************
async function initialProducts() {

  const categories =  await APP.fetch("categories")
  const products = await APP.fetch("products")
  
  addFeaturedProductsToHeroList(products);


  const filterBtnList = document.querySelector('.filter-btn-list')
  let buttonsHTML = '<li class="filter-btn-item"><button class="filter-btn active" data-filter-btn="all">All Products</button></li>'
  categories.forEach(category => {
    buttonsHTML += `
      <li class="filter-btn-item">
        <button class="filter-btn" data-filter-btn="${category.name}">${category.name}</button>
      </li>
    `
  })
  filterBtnList.innerHTML = buttonsHTML;
  
  const filterBtns = document.querySelectorAll("[data-filter-btn]");
  const filterBox = document.querySelector("[data-filter]");
  
  let lastClickedFilterBtn = filterBtns[0];
  
  const filter = function () {
    lastClickedFilterBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedFilterBtn = this;
    
    const cat = this.dataset.filterBtn
  
    filterBox.setAttribute("data-filter", this.dataset.filterBtn)

    let itemsElems = document.querySelectorAll('.product-list>li')

    let itemCount = 0
    itemsElems.forEach(item => {
      if (cat == "all") {
        item.classList.add("show")
        itemCount++
      } else {
        item.classList.remove("show")
        if (item.classList.contains(cat)) { 
          item.classList.add("show")
          itemCount += 1
        }
      }

    })

    console.log(itemCount)
    if (itemCount == 0) document.querySelector('.no_products').classList.add("show")
    else document.querySelector('.no_products').classList.remove("show")

  }
  addEventOnElem(filterBtns, "click", filter);





  
  products.forEach(product => {
    const listItem = document.createElement('li');
    listItem.className = product.category? product.category.name : ""; // Set the class name to the category name
    listItem.classList.add("show")
    listItem.classList.add("product-card-item")
  
    listItem.innerHTML = `
      <div class="product-card">
        <a  class="card-banner img-holder has-before" style="--width: 300; --height: 300;">
          <img src="${product.image}" width="300" height="300" loading="lazy" alt="${product.name}" class="img-cover">
          <ul class="card-action-list">
            <li><button class="card-action-btn" aria-label="add to cart" title="add to cart"onclick=" location.href='/pages/product.html?id=${product.id}'">
              <ion-icon name="information-circle-outline" aria-hidden="true"></ion-icon></button></li>

            <li><button class="card-action-btn add-to-cart-btn" aria-label="add to cart" title="add to cart">
              <ion-icon name="bag-handle-outline" aria-hidden="true"></ion-icon></button></li>
          </ul>

          ${product.countInStock === 0 ? '<div class="card-badge">Out of Stock</div>' : ''}
          <ul class="badge-list">
            <!-- <li><div class="badge orange">Sale</div></li> --> 
            ${product.promotion ? `<li><div class="badge cyan">-${product.promotion * 100 / product.price}%</div></li>` : ''}
          </ul>
        </a>
        

        <div class="card-content">
          <h3 class="h3">
            <a href="/pages/product.html?id=${product.id}" class="card-title">${product.name}</a>
          </h3>
          <div class="card-price">
          ${
            product.promotion
              ? `<del class="del">${product.price.toFixed(2)} DA</del>
                 <data class="price" value="${product.promotion}">${product.promotion.toFixed(2)} DA</data>`
              : `<data class="price" value="${product.price}">${product.price.toFixed(2)} DA</data>`
          }
          </div>
        </div>
      </div>
    `;

    const addToCartButton = listItem.querySelector('.add-to-cart-btn');
    addToCartButton.addEventListener('click', () => {
      addToCart(product._id); // Pass the product ID to the addToCart function
    });
          
    document.querySelector('.product-list').appendChild(listItem);
  });

  
}

function addToCart(productId) {
  const cartListString = localStorage.getItem('cartList');
  let cartList = cartListString ? JSON.parse(cartListString) : [];

  const existingCartItem = cartList.find(item => item.product === productId);
  if (existingCartItem) {
    existingCartItem.quantity += 1;
  } else {
    cartList.push({ product: productId, quantity: 1 });
  }

  localStorage.setItem('cartList', JSON.stringify(cartList));
  drawCart()
}

initialProducts()