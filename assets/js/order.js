const form = document.querySelector('.form'),
  fieldsTxt = document.querySelectorAll('.field--text'),
  selectInput = document.querySelector('.select__shipping'),
  inputCheckbox = document.querySelector('input[type=checkbox]');

fieldsTxt.forEach(field => {
  field.addEventListener('click', function () {
    this.querySelector('.input--text').focus();
  });
});

if (localStorage.getItem("token") && localStorage.getItem("userId")) {
  APP.fetch("users/" + localStorage.getItem("userId")).then(data => {
    if (data.success == false) {
      const pagesIndex = window.location.pathname.indexOf("/pages")
      window.location.href = window.location.origin + window.location.pathname.slice(0, pagesIndex) + "/pages/login.html"
    }
  })
} else {
  const pagesIndex = window.location.pathname.indexOf("/pages")
  window.location.href = window.location.origin + window.location.pathname.slice(0, pagesIndex) + "/pages/login.html"
}



// *******************************************************************************************************
// CART 
// *******************************************************************************************************
async function initialProducts(noEmptyCartMsg = false) {
  const cartListString = localStorage.getItem('cartList');
  if (!cartListString) {
    document.querySelector('.form__btn').classList.add("hide")
    document.querySelector('.ware-cart').classList.add("hide")
    return
  }

  const cartList = JSON.parse(cartListString);

  const wareContainer = document.querySelector('.ware-elements');
  wareContainer.innerHTML = ""

  if (cartList.length == 0) {
    document.querySelector('.form__btn').classList.add("hide")
    document.querySelector('.ware-cart').classList.add("hide")
    if (noEmptyCartMsg) document.querySelector('.empty-cart').classList.remove("show")
    else document.querySelector('.empty-cart').classList.add("show")

  }


  let totalPrice = 0

  await cartList.forEach(async item => {
    const product = await APP.fetch("products/" + item.product)

    if (product.success !== false) {

      const wareItem = document.createElement('div');
      wareItem.className = "ware__item";
      wareItem.innerHTML = `
                    <figure class="item__figure">
                        <img class="item__img" src="${product.image}" />
                        <figcaption class="item__figure__figcaption">${product.name}</figcaption>
                        ${product.promotion ?
          `<p class="item__figure__price"><span class="figure__price--off">${product.promotion} DA</span> <span class="figure__price--crossed">${product.price} DA</span></p>` :
          `<p class="item__figure__price"><span class="figure__price--off">${product.price} DA</span></p>`
        }
                        <p class="item__cont">${item.quantity}</p>
                    </figure>
      `
      wareContainer.appendChild(wareItem);

      totalPrice += item.quantity * product.price
      document.querySelector('.quantity__total').innerHTML = totalPrice + " DA"
    }
  })


  let ordersData = await APP.fetch("orders/get/usersorders/" + localStorage.getItem("userId"))
  let userOrderList = document.querySelector(".order-cart .ware-elements")
  let prevTotal = 0

  ordersData.forEach(order => {
    prevTotal += order.totalPrice
    const orderItem = document.createElement('form');
    orderItem.className = "order-form"
    orderItem.classList.add("form")

    orderItem.innerHTML = `
        <p class="order_info">Status : <span>${order.status}</span></p>
        <p class="order_info">Shipping Address : <span>${order.shippingAddress}</span></p>
        <p class="order_info">State : <span>${order.state}</span></p>
        <p class="order_info">Postal : <span>${order.postal}</span></p>
        <p class="order_info">Phone : <span>${order.phone}</span></p>
        <p class="order_info">Total Price : <span>${order.totalPrice} DA</span></p>
        <div class="container__form__btn">
            <button type="submit" class="form__btn product__submit order_sup_elem_delete_btn"><i class="material-icons form__icons">delete</i>Delete Order</button>
        </div>
      `

      orderItem.addEventListener("submit", async (e) => {
        e.preventDefault()
        await APP.fetch("orders/"+order.id, {
          method: "DELETE"
        })

        window.location.href = window.location.href.replace("/pages/order.html", "/pages/order.html")
      })


    userOrderList.appendChild(orderItem);
  })
  document.querySelector(".prev_total .quantity__total").innerHTML = prevTotal + " DA"

}

initialProducts()

document.querySelector(".form").addEventListener("submit", async e => {
  e.preventDefault()
  let phone = document.querySelector(".input-phone").value
  let address = document.querySelector(".input-address").value
  let postal = document.querySelector(".input-zip").value
  let state = selectInput.value

  const productListString = localStorage.getItem('cartList');
  if (!productListString) return

  const productList = JSON.parse(productListString);
  if (productList.length == 0) return

  let reqObj = {
    "orderItems": productList,
    "shippingAddress": address,
    "postal": postal,
    "phone": phone,
    "state": state,
    "user": localStorage.getItem("userId"),
  }

  const order = await APP.fetch("orders", {
    method: "POST",
    body: reqObj
  })

  document.querySelector(".input-phone").value = ""
  document.querySelector(".input-address").value = ""
  document.querySelector(".input-zip").value = ""
  selectInput.value = ""

  localStorage.setItem('cartList', '[]')
  initialProducts(noEmptyCartMsg = true)

  document.querySelector(".confirm-order").classList.add("show")
})
