const cartPage = {

    data: {
        queryString: null,
        productId: null,
        currentProduct: null,
        products: null,
    },

    domElements: {
        cartItems: document.querySelector('#cart__items'),
    },

    init: function() {
        cartPage.getProducts();
        cartPage.formUser();
    },

    getProducts: function() {
        fetch("http://localhost:3000/api/products")
        .then(function(res) {
            if (res.ok) {
            return res.json();
            }
        })
        .then(function(data) {
            cartPage.data.products = data;
            cartPage.createCart();
        })
        .catch(function(err) {
            // Une erreur est survenue
        });
    },

    getProduct: function(id) {
        let product;
        cartPage.data.products.forEach((p, index) => {
            if (p._id === id) {
                product = p;
            };
        });
        return product;
    },

    createCart: function() {
        const cart = JSON.parse(localStorage.getItem('cart'));
        cart.forEach((c, index) => {
            let product = cartPage.getProduct(c.id);
            cartPage.templateProduct(c, product);
        });
        cartPage.total();
    },

    templateProduct: function(cartItem, product) {

        const el = cartPage.domElements;

        let article = document.createElement('article');
        article.setAttribute('class', 'cart__item');
        article.setAttribute('data-id', cartItem.id);
        article.setAttribute('data-color', cartItem.color);

        let divItemCart = document.createElement('div');
        divItemCart.setAttribute('class', 'cart__item__img');

        let img = document.createElement('img');
        img.setAttribute('src', product.imageUrl);
        img.setAttribute('alt', product.description);

        divItemCart.append(img);

        let divItemContent = document.createElement('div');
        divItemContent.setAttribute('class', 'cart__item__content');

        let divDescription = document.createElement('div');
        divDescription.setAttribute('class', 'cart__item__content__description');

        let name = document.createElement('h2');
        name.textContent = product.name;

        let color = document.createElement('p');
        color.textContent = cartItem.color;

        let price = document.createElement('p');
        price.textContent = product.price + " €";

        divDescription.append(name, color, price);

        let divSetting = document.createElement('div');
        divSetting.setAttribute('class', 'cart__item__content__settings');

        let divSettingQte = document.createElement('div');
        divSettingQte.setAttribute('class', 'cart__item__content__settings__quantity');

        divSetting.append(divSettingQte);
        
        let quantity = document.createElement('p');
        quantity.textContent = 'Qté :';

        let inputQte = document.createElement('input');
        inputQte.setAttribute('type', 'number');
        inputQte.setAttribute('class', 'itemQuantity');
        inputQte.setAttribute('name', 'itemQuantity');
        inputQte.setAttribute('min', '1');
        inputQte.setAttribute('max', '100');
        inputQte.setAttribute('value', cartItem.quantity);

        divSettingQte.append(quantity, inputQte);

        let divDelete = document.createElement('div');
        divDelete.setAttribute('class', 'cart__item__content__settings__delete');

        let pDelete = document.createElement('p');
        pDelete.setAttribute('class', 'deleteItem');
        pDelete.textContent = 'Supprimer';

        divDelete.append(pDelete);

        divSetting.append(divSettingQte, divDelete);

        divItemContent.append(divDescription, divSetting);

        article.append(divItemCart, divItemContent);

        el.cartItems.appendChild(article);
        
        inputQte.addEventListener("click", () => {
            if (inputQte.value < 100) {
                const cart = JSON.parse(localStorage.getItem('cart'));
                cartItem.quantity = inputQte.value;
                let id = cart.findIndex(element => element.color === cartItem.color && element.id === cartItem.id);
                cart[id] = cartItem;
                localStorage.setItem('cart',JSON.stringify(cart));
                cartPage.total();    
            } else {
                alert('impossible de mettre plus de 100 article')
            };
        });

        pDelete.addEventListener("click", () => {
            let cart = JSON.parse(localStorage.getItem('cart'));
            cart = cart.filter(element => element.color != cartItem.color && element.id != cartItem.id);
            localStorage.setItem('cart',JSON.stringify(cart));
            article.remove();
            cartPage.total();
        });
    },

    total: function() {
        let totalPrice = 0;
        let totalQuantity = 0;
        const cart = JSON.parse(localStorage.getItem('cart'));

        cart.forEach((c, index) => {
            let { quantity, id } = c;
            quantity = parseInt(quantity, 10);
            const product = cartPage.getProduct(id);
            const totalProduct = quantity * product.price;
            totalPrice = totalPrice + totalProduct;
            totalQuantity = totalQuantity + quantity;
        });
        document.getElementById('totalPrice').textContent = totalPrice;
        document.getElementById('totalQuantity').textContent = totalQuantity;
    },

    formUser: function() {
        let myForm = document.getElementById('order');
        myForm.addEventListener('click', function(e) {
            let valid = true;
            e.preventDefault();
            let firstNameInput = document.getElementById('firstName');
            let myRegex = /^[a-zA-Z-\s]+$/;

            if (firstNameInput.value.trim() == "") {
                e.preventDefault();
                valid = false
                let firtsError = document.getElementById('firstNameErrorMsg');
                firtsError.innerHTML = "ce champ est requis.";
            } else if (myRegex.test(firstNameInput.value) == false) {
                valid = false
                let firtsError = document.getElementById('firstNameErrorMsg');
                firtsError.innerHTML = "Ce champ doit comporter des lettres, des tirets et des espaces uniquement.";
            };

            let lastNameInput = document.getElementById('lastName');

            if (lastNameInput.value.trim() == "") {
                e.preventDefault();
                valid = false
                let firtsError = document.getElementById('lastNameErrorMsg');
                firtsError.innerHTML = "ce champ est requis.";
            } else if (myRegex.test(lastNameInput.value) == false) {
                valid = false
                let firtsError = document.getElementById('lastNameErrorMsg');
                firtsError.innerHTML = "Ce champ doit comporter des lettres, des tirets et des espaces uniquement.";
            };

            let cityInput = document.getElementById('city');

            if (cityInput.value.trim() == "") {
                e.preventDefault();
                valid = false
                let firtsError = document.getElementById('cityErrorMsg');
                firtsError.innerHTML = "ce champ est requis.";
            } else if (myRegex.test(cityInput.value) == false) {
                valid = false
                let firtsError = document.getElementById('cityErrorMsg');
                firtsError.innerHTML = "Ce champ doit comporter des lettres, des tirets et des espaces uniquement.";
            };

            let addressInput = document.getElementById('address');
            let lastRegex = /^[a-zA-Z-\s0-9]+$/;
            if (addressInput.value.trim() == "") {
                e.preventDefault();
                valid = false
                let firtsError = document.getElementById('addressErrorMsg');
                firtsError.innerHTML = "ce champ est requis.";
            } else if (lastRegex.test(addressInput.value) == false) {
                valid = false
                let firtsError = document.getElementById('addressErrorMsg');
                firtsError.innerHTML = "Ce champ doit comporter votre addresse compléte.";
            };

            let emailInput = document.getElementById('email');
            let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (emailInput.value.trim() == "") {
                e.preventDefault();
                valid = false
                let firtsError = document.getElementById('emailErrorMsg');
                firtsError.innerHTML = "ce champ est requis.";
            } else if (emailRegex.test(emailInput.value) == false) {
                valid = false
                let firtsError = document.getElementById('emailErrorMsg');
                firtsError.innerHTML = "Une addresse email valide est requise";
            };

            const cart = JSON.parse(localStorage.getItem('cart'));
            let products = [];

            cart.forEach((c, index) => {
                let {id } = c;
                products.push(id);
            });
            const data = {
                contact:{
                    firstName: firstNameInput.value,
                    lastName: lastNameInput.value,
                    address: addressInput.value,
                    city: cityInput.value,
                    email: emailInput.value
                },
                products: products
            };

            let settingsFetch = {
                method: 'POST',
                headers: {
                    accept: "application/json",
                    "Content-type" : "application/json"
                },
                body: JSON.stringify(data)
            };
            console.log(valid)
            // si le panier est vide
            if (cart.length == 0) {
                // alors on envoie un message
                alert("Votre panier est vide.");
            }else if(!valid) {
                return
            }else{
                // sinon onvoie la requête au serveur
                fetch("http://localhost:3000/api/products/order", settingsFetch)
                .then((response) => response.json()
                )
                .then((data) => {
                    localStorage.clear();
                    let orderId = data.orderId;
                    window.location.href = "../html/confirmation.html" + "?orderId=" + orderId;
                }) 
                
            };
        });
    },

    
};

cartPage.init();