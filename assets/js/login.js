// let's peep that page query and bust out the right form like a boss.
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const actor = params.actor

if (params.page == "login") {
    switchForms(0)
} else if (params.page == "register") {
    switchForms(1)
} else if (params.page == "confirm_email") {
    switchForms(2)
} else if (params.page == "confirm_identity") {
    switchForms(3)
}


// Let's switch it up and bounce between these forms like it's no big thang
function switchForms(index) {
    const forms = document.querySelectorAll(".form-wrapper")
    forms.forEach(form => {
        form.classList.remove("form-wrapper_selected")
    })
    forms[index].classList.add("form-wrapper_selected")
}


const registerLinkElm = document.querySelector(".register-link")
const loginLinkElm = document.querySelector(".login-link")
const nextRegisterBtnElm = document.querySelector(".form-wrapper_signup .btn")
const loginBtnElm = document.querySelector(".form-wrapper_login .btn")

registerLinkElm.addEventListener("click", e => {
    e.preventDefault()
    switchForms(1)
})

loginLinkElm.addEventListener("click", e => {
    e.preventDefault()
    switchForms(0)
})


// ################ LOGIN #####################

loginBtnElm.addEventListener("click", async () => {
    const emailInputElm = document.querySelector(".login-email-input")
    const email = APP.inputValidator(emailInputElm, "Dosen't look like an email", APP.VALIDATORS.email)
    const passwordInputElm = document.querySelector(".login-password-input")
    const password = APP.inputValidator(passwordInputElm, "Passowrd cant't be empty", APP.VALIDATORS.empty)
    
    if (email === false || password === false) return
    
    loginBtnElm.setAttribute("disabled", "true")

    let data;
    if (actor == "admin") {
        data = await APP.fetch(`admin/login`, {
            method: "POST",
            body: { email, password }
        })
    } else {
        data = await APP.fetch(`users/login`, {
            method: "POST",
            body: { email, password }
        })
    }



    loginBtnElm.removeAttribute("disabled")
    console.log(data)

    if (data.success === false) {
        if (data.field == "email")
            APP.inputValidator(emailInputElm, data.message)
        else if (data.field == "password")
            APP.inputValidator(passwordInputElm, data.message)
        return
    }

    if (data.data.isAdmin) {
        localStorage.setItem("adminToken", data.data.token)
        localStorage.setItem("adminId", data.data.id)

        const pagesIndex = window.location.pathname.indexOf("/pages")
        window.location.href = window.location.origin + window.location.pathname.slice(0, pagesIndex) + "/pages/admin.html"
    }
    else {
        localStorage.setItem("token", data.data.token)
        localStorage.setItem("userId", data.data.id)
        const pagesIndex = window.location.pathname.indexOf("/pages")
        window.location.href = window.location.origin + window.location.pathname.slice(0, pagesIndex)
    }
})



// ################ register #####################
nextRegisterBtnElm.addEventListener("click", async () => {
    const emailInputElm = document.querySelector(".signup-email-input")
    const email = APP.inputValidator(emailInputElm, "Dosen't look like an email", APP.VALIDATORS.email)

    const passwordInputElm = document.querySelector(".signup-password-input")
    const password = APP.inputValidator(passwordInputElm, "Passowrd cant't be empty", APP.VALIDATORS.empty)

    const usernameInputElm = document.querySelector(".signup-username-input")
    const name = APP.inputValidator(usernameInputElm, "User name cant't be empty", APP.VALIDATORS.empty)

    if (email === false || password === false || name === false) return


    nextRegisterBtnElm.setAttribute("disabled", "true")

    const data = await APP.fetch("users/register", {
        method: "POST",
        body: { email, password, name }
    })
    
    console.log(data)




    if (data.success === false) {
        if (data.field == "email")
            APP.inputValidator(emailInputElm, data.message)
        else if (data.field == "password")
            APP.inputValidator(passwordInputElm, data.message)
        else if (data.field == "name")
            APP.inputValidator(usernameInputElm, data.message)

        nextRegisterBtnElm.removeAttribute("disabled")
        return
    }


    // log in
    const loginRequest = await APP.fetch("users/login", {
        method: "POST",
        body: { email, password }
    })

    localStorage.setItem("token", loginRequest.token)

    nextRegisterBtnElm.removeAttribute("disabled")

    // redirect to home page
    const pagesIndex = window.location.pathname.indexOf("/pages")
    window.location.href = window.location.origin + window.location.pathname.slice(0, pagesIndex)
})