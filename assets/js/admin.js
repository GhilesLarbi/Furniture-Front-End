// check if admin is loged in 
const adminToken = localStorage.getItem("adminToken")
if (!adminToken) {
    const pagesIndex = window.location.pathname.indexOf("/pages")
    window.location.href = window.location.origin + window.location.pathname.slice(0, pagesIndex) + "/pages/login.html?actor=admin"
}


// tab control
const tabControls = document.querySelectorAll(".tab-control");
const tabs = document.querySelectorAll(".tab");
const tabHeaders = document.querySelectorAll(".tab--header");



let currentTab = localStorage.getItem("dashboard-tab") || 0;
function selectTab(i) {
    if (i < 0 || i > tabs.length) return;

    tabs[currentTab].classList.remove("tab__selected");
    tabControls[currentTab].classList.remove("tab-control__selected");
    tabHeaders[currentTab].classList.remove("tab--header__selected");

    tabs[i].classList.add("tab__selected");
    tabControls[i].classList.add("tab-control__selected");
    tabHeaders[i].classList.add("tab--header__selected");

    currentTab = i;
    localStorage.setItem("dashboard-tab", currentTab)
}

tabControls.forEach((control, i) => {
    control.addEventListener("click", () => {
        selectTab(i);
    })
})


// sidebar collapse
const sidebarCollapseBtn = document.querySelector(".sidebar--collapse-btn");
const sidebar = document.querySelector(".sidebar");
const wrapper = document.querySelector(".wrapper");

sidebarCollapseBtn.addEventListener("click", () => {
    wrapper.classList.toggle("sidebar__collapsed");
});



document.querySelector(".logout-btn").addEventListener("click", () => {
    localStorage.removeItem("adminToken")
    window.location.href = window.location.href.replace("/pages/dashboard.html", "")
})






document.getElementById('product-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nameInput = document.querySelector('.input[name="product-name"]');
    const descriptionInput = document.querySelector('.input[name="product-description"]');
    const imageInput = document.querySelector('.input[name="product-image"]');
    const priceInput = document.querySelector('.input[name="product-price"]');
    const brandInput = document.querySelector('.input[name="product-brand"]');
    const countInput = document.querySelector('.input[name="product-count"]');
    const categorySelect = document.querySelector('.select__category_product');
        
    const product = {
        price: parseFloat(priceInput.value),
        brand: brandInput.value,
        countInStock: parseInt(countInput.value),
        category: categorySelect.value,
        isFeatured: document.getElementById('isfutered').checked,
    };



    const formData = new FormData();
    const imageFile = imageInput.files[0];
    formData.append('image', imageFile);
    formData.append('name', nameInput.value);
    formData.append('description', descriptionInput.value);
    formData.append('price', parseFloat(priceInput.value));
    formData.append('brand', brandInput.value);
    formData.append('countInStock', parseInt(countInput.value));
    formData.append('category', categorySelect.value);
    formData.append('isFeatured', document.getElementById('isfutered').checked);

    const data = await APP.fetch(`products`, {
        actor: "admin",
        method: "POST",
        bodyType: "multi-part",
        body: formData,
    })
    
    console.log(data);
    window.location.href = window.location.href.replace("/pages/dashboard.html", "")
});






document.getElementById('category-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nameInput = document.querySelector('.input[name="category-name"]');
    const iconInput = document.querySelector('.input[name="category-icon"]');
    const colorInput = document.querySelector('.input[name="category-color"]');
        
    const category = {
        name: nameInput.value,
        icon: iconInput.value,
        color: colorInput.value,
    };

    console.log(category)

    const data = await APP.fetch(`categories`, {
        actor: "admin",
        method: "POST",
        body: category,
    })
    
    console.log(data);
    window.location.href = window.location.href.replace("/pages/dashboard.html", "")
});



async function deleteProd(id) {
    await APP.fetch(`products/${id}`, {
        actor: "admin",
        method: "DELETE",
    })
    window.location.href = window.location.href.replace("/pages/dashboard.html", "")
}

async function modifyProduct(id, newObj) {
    const data = await APP.fetch(`products/${id}`, {
        actor: "admin",
        method: "PUT",
        body: newObj
    })

    console.log(data)

    window.location.href = window.location.href.replace("/pages/dashboard.html", "")
}


async function deleteCat(id) {
    await APP.fetch(`categories/${id}`, {
        actor: "admin",
        method: "DELETE",
    })
    window.location.href = window.location.href.replace("/pages/dashboard.html", "")
}

async function modifyCategory(id, newObj) {
    const data = await APP.fetch(`categories/${id}`, {
        actor: "admin",
        method: "PUT",
        body: newObj
    })

    console.log(data)

    window.location.href = window.location.href.replace("/pages/dashboard.html", "")
}


async function deleteOrder(id) {
    await APP.fetch(`orders/${id}`, {
        actor: "admin",
        method: "DELETE",
    })
    window.location.href = window.location.href.replace("/pages/dashboard.html", "")
}

async function modifyOrder(id, newObj) {
    const data = await APP.fetch(`orders/${id}`, {
        actor: "admin",
        method: "PUT",
        body: newObj
    })

    console.log(data)

    window.location.href = window.location.href.replace("/pages/dashboard.html", "")
}




async function initialProducts() {
    const categories =  await APP.fetch("categories")
    const products = await APP.fetch("products")
    const users = await APP.fetch("users/", {actor: "admin"})
  
  
    const productCatOptions = document.querySelector('.select__category_product')
    productCatOptions.innerHTML = '<option value="">Select Category</option>'
    categories.forEach(category => {
      productCatOptions.innerHTML += `<option value="${category._id}">${category.name}</option>`


      const catItem = document.createElement('div');
      catItem.className = "category_sup_elem"
      catItem.innerHTML = `
        <div class="category-back" style="background-color: ${category.color}"></div>
        <form class="form" id="category-form_sup">
            
            <label class="label">Name</label>
            <p class="field field--text">
                <i class="material-icons form__icons">badge</i>
                <input type="text" name="category-name" class="input" placeholder="${category.name}" value="${category.name}" required />
            </p>

            <label class="label">icon</label>
            <p class="field field--text">
                <i class="material-icons form__icons">add_reaction</i>
                <input type="text" name="category-icon" class="input" placeholder="${category.icon}" value="${category.icon}" required minlength="4" />
            </p>

            <label class="label">Color</label>
            <p class="field field--text">
                <i class="material-icons form__icons">palette</i>
                <input type"text" pattern="#[0-9a-fA-F]{6}" name="category-color" class="input" placeholder="${category.color}" value="${category.color}" required />
            </p>

            <div class="container__form__btn">
                <button type="submit" class="form__btn category__submit category_sup_elem_modify_btn"><i class="material-icons form__icons">edit</i>Modify Product</button>
                <button class="form__btn category__submit category_sup_elem_delete_btn"><i class="material-icons form__icons">delete</i>Delete Product</button>
            </div>
        </form>
      `


      catItem.querySelector("#category-form_sup").addEventListener("submit", async (e) => {
        e.preventDefault()
        const nameInput = catItem.querySelector('.input[name="category-name"]');
        const iconInput = catItem.querySelector('.input[name="category-icon"]');
        const colorInput = catItem.querySelector('.input[name="category-color"]');
            
        const newObj = {
            name: nameInput.value,
            icon: iconInput.value,
            color: colorInput.value,
        };

        modifyCategory(category._id, newObj)
    })

    catItem.querySelector('.category_sup_elem_delete_btn').addEventListener('click', (e) => {
        e.preventDefault()
        deleteCat(category._id)
    });

      document.querySelector('.category_sup').appendChild(catItem);
    })
  
    
    products.forEach(product => {
       const prodItem = document.createElement('div');
       prodItem.className = "product_sup_elem"

       prodItem.innerHTML = `
            <img src="${product.image}">
            <form class="form" id="product-form_sup">
                <label class="label"> Name</label>
                <p class="field field--text">
                    <i class="material-icons form__icons">badge</i>
                    <input type="text" name="product-name" class="input" placeholder="${product.name}" value="${product.name}" required />
                </p>

                <label class="label" >Description</label>
                <p class="field field--text">
                    <i class="material-icons form__icons">description</i>
                    <input type="text" name="product-description" class="input" placeholder="${product.description}" value="${product.description}" required minlength="4" />
                </p>

                <label class="label" >Price</label>
                <p class="field field--text">
                    <i class="material-icons form__icons">payments</i>
                    <input type="number" name="product-price" class="input" placeholder="${product.price} DA" value="${product.price}" min=1 required />
                </p>

                <label class="label" >Brand</label>
                <p class="field field--text">
                    <i class="material-icons form__icons">branding_watermark</i>
                    <input type="text" name="product-brand" class="input" placeholder="${product.brand}" value="${product.brand}" required minlength="2" />
                </p>

                <label class="label">Count in stock</label>
                <p class="field field--text">
                    <i class="material-icons form__icons">inventory_2</i>
                    <input type="number" name="product-count" class="input" placeholder="${product.countInStock}" value="${product.countInStock}" min=0 required />
                </p>
                
                
                <p class="field field__shipping--country">
                    <i class="material-icons form__icons">category</i>
                    <select name="select-category" class="input select__category_product" required>
                        <option value="">Select Category</option>
                        ${categories.map(category => `
                        <option value="${category._id}" ${product.category ? product.category._id === category._id ? 'selected' : '' : ""}>
                            ${category.name}
                        </option>
                    `).join('')}
                    </select>
                </p>

                <input type="checkbox" name="isfutered" id="isfutered" ${product.isFeatured ? "checked" : ""} />
                <label class="label"> Product is futured</label>                

                <div class="container__form__btn">
                    <button type="submit" class="form__btn product__submit product_sup_elem_modify_btn"><i class="material-icons form__icons">edit</i>Modify Product</button>
                    <button class="form__btn product__submit product_sup_elem_delete_btn"><i class="material-icons form__icons">delete</i>Delete Product</button>
                </div>
            </form>
       `

        prodItem.querySelector("#product-form_sup").addEventListener("submit", async (e) => {
            e.preventDefault()
            const nameInput = prodItem.querySelector('.input[name="product-name"]');
            const descriptionInput = prodItem.querySelector('.input[name="product-description"]');
            const priceInput = prodItem.querySelector('.input[name="product-price"]');
            const brandInput = prodItem.querySelector('.input[name="product-brand"]');
            const countInput = prodItem.querySelector('.input[name="product-count"]');
            const categorySelect = prodItem.querySelector('.select__category_product');
            const isFuteredCheck = prodItem.querySelector('#isfutered');
                
            const newObj = {
                name: nameInput.value,
                description: descriptionInput.value,
                price: parseFloat(priceInput.value),
                brand: brandInput.value,
                countInStock: parseInt(countInput.value),
                category: categorySelect.value,
                isFeatured: isFuteredCheck.checked,
            };

            modifyProduct(product._id, newObj)
        })
  
        prodItem.querySelector('.product_sup_elem_delete_btn').addEventListener('click', (e) => {
            e.preventDefault()
            deleteProd(product._id)
        });

            
        document.querySelector('.products_sup').appendChild(prodItem);
    });



    users.forEach(async user => {
        const userOrderList = document.createElement('div');
        userOrderList.className = "user_orders_list"
        userOrderList.innerHTML = `<h3 class="user_name"><i class="material-icons form__icons">person</i> ${user.name}</h3>`

        const ordersData = await APP.fetch("orders/get/usersorders/"+user.id, {actor: "admin"})

        if (ordersData.length == 0) userOrderList.innerHTML += `<p>No Orders for this user</p>`

        ordersData.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.className = "user_order_item"
            orderItem.innerHTML = `
                <form class="form" id="order-form_modify">
                    <label class="label">Status</label>
                    <p class="field field__shipping--country">
                        <i class="material-icons form__icons">category</i>
                        <select name="select-status" class="input select__order_status" required>
                            <option value="Pending" ${order.status === "Pending" ? 'selected' : ''}>Pending</option>
                            <option value="In Progress" ${order.status === "In Progress" ? 'selected' : ''}>In Progress</option>
                            <option value="Cancelled" ${order.status === "Cancelled" ? 'selected' : ''}>Cancelled</option>
                            <option value="Done" ${order.status === "Done" ? 'selected' : ''}>Done</option>
                        </select>
                    </p>

                    <p class="order_info">Shipping Address : <span>${order.shippingAddress}</span></p>
                    <p class="order_info">State : <span>${order.state}</span></p>
                    <p class="order_info">Postal : <span>${order.postal}</span></p>
                    <p class="order_info">Phone : <span>${order.phone}</span></p>
                    <p class="order_info">Total Price : <span>${order.totalPrice} DA</span></p>
                    <div class="container__form__btn">
                        <button type="submit" class="form__btn product__submit order_sup_elem_modify_btn"><i class="material-icons form__icons">edit</i>Modify Status</button>
                        <button class="form__btn product__submit order_sup_elem_delete_btn"><i class="material-icons form__icons">delete</i>Delete Order</button>
                    </div>
                </form>
            `

            orderItem.querySelector("#order-form_modify").addEventListener("submit", async (e) => {
                e.preventDefault()
                const statusInput = orderItem.querySelector('.input[name="select-status"]');
                    
                const newObj = {
                    status: statusInput.value,
                };
    
                modifyOrder(order._id, newObj)
            })
      
            orderItem.querySelector('.order_sup_elem_delete_btn').addEventListener('click', (e) => {
                e.preventDefault()
                deleteOrder(order._id)
            });

            userOrderList.appendChild(orderItem);
        })

        document.querySelector('.users_orders').appendChild(userOrderList);
    })
    
}
  
initialProducts()
selectTab(currentTab)