const APP = (function () {
    //const HOSTNAME = "https://stadium-tickets-api.onrender.com"
    const HOSTNAME = "http://localhost:3000"


    function redirectToLogin(actor) {
        if (!actor) actor = "user"
        const pagesIndex = window.location.pathname.indexOf("/pages")
        window.location.href = window.location.origin + window.location.pathname.slice(0, pagesIndex) + "/pages/login.html?actor="+actor
    }

    // check if token is valid
    async function isLogedIn(actor, options) {
        if (actor == "admin") tok = "adminToken"
        else tok = "token"

        if (localStorage.getItem(tok)) {
            document.body.classList.add("loged-in")
            fetch("user", {actor}).then(data => {
                if (!data.success) {
                    localStorage.removeItem(tok)
                    localStorage.removeItem(`firstLogin${actor}`)
                    document.body.classList.remove("loged-in")
                    if (options && options.redirect) redirectToLogin(actor)

                } else if (data.success) {
                    if (!data.data.isEmailConfirmed) {
                        document.querySelector(".dropdown-link_email").classList.remove("dropdown-link_hide")
                    }
                    if (!localStorage.getItem(`firstLogin${actor}`)) {
                        localStorage.setItem(`firstLogin${actor}`, "no")
                        const userLogedNot = new Notification("You loged in", "true")
                        userLogedNot.push()
                        userLogedNot.popAfter(2000)
                    }
                }
            })
        } else {
            localStorage.removeItem("firstLogin")
            if (options && options.redirect) redirectToLogin(actor)
        }
    }


    // #################################################
    // ############### UTILITY FUNCTIONS ###############
    // #################################################


    // Let's whip up a custom fetch function.
    async function fetch(url, opt, rec) {

        // if no options provided use empty one
        if (!opt) opt = {}
        if (!opt.headers) opt.headers = {}



        // construct the default options
        const options = { headers: {} }

        // set the method
        if (opt.method) options.method = opt.method
        else options.method = "GET"

        // stringify the body by default
        if (opt.body && opt.bodyType != "file" && opt.bodyType != "multi-part") options.body = JSON.stringify(opt.body)
        else if (opt.body) options.body = opt.body

        // set the content type to json by default
        if (opt.headers["Content-Type"]) options.headers["Content-Type"] = opt.headers["Content-Type"]
        else if (opt.bodyType == "multi-part") {}
        else if (opt.bodyType != "file") options.headers["Content-Type"] = "application/json"

        // set the authorization token if any 
        let token
        if (opt.actor && opt.actor == "admin") token = localStorage.getItem("adminToken")
        else token = localStorage.getItem("token")

        if (token) options.headers.authorization = `Bearer ${token}`

        // construct the query
        let query = ""
        if (opt.query) query = "?" + new URLSearchParams(opt.query)
        
        // console.log(`${HOSTNAME}/api/${url}${query}`)
        // console.log(options)

        let res = await window.fetch(`${HOSTNAME}/api/v1/${url}${query}`, options)


        // get the actual data
        if (opt.type === "blob") return await res.blob()
        else return await res.json()
    }


    // we gotta amp up our inputValidator function with some dope validators
    const VALIDATORS = {
        email: (value) => {
            const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (!value.match(validRegex))
                return false
        },
        empty: (value) => {
            if (!value || value == "") return false
        }

    }

    // We gotta make sure these inputs are legit - time to validate
    function inputValidator(inputElem, message, validator) {
        if (!validator || validator(inputElem.children[1].value) === false) {
            inputElem.setAttribute("data-err", message)
            inputElem.classList.add("input_error")
            return false
        }
        return inputElem.children[1].value
    }

    return {
        HOSTNAME,
        VALIDATORS,
        fetch,
        inputValidator,
        isLogedIn,
    }
})()