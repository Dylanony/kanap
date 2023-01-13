const productPage = {
    
    data: {
        queryString: null,
        urlParams: null,
        productId: null,
        currentProduct: null,
        products: null,
    },

    domElements: {
        img: document.querySelector('.item__img'),
        title: document.getElementById('title'),
        price: document.getElementById('price'),
        colors: document.getElementById('colors'),
        description: document.getElementById('description'),
        btnAddCart: document.getElementById('addToCart'),
        quantity: document.getElementById('quantity'),
    },

    init: function() {
        productPage.getProducts();
        productPage.getUrlParams();
    },

    getUrlParams: function() {
        const queryString = window.location.search;
        productPage.data.urlParams = new URLSearchParams(queryString);
        productPage.data.productId = productPage.data.urlParams.get('id');
    },

    getProducts: function() {
        fetch("http://localhost:3000/api/products")
        .then(function(res) {
            if (res.ok) {
            return res.json();
            }
        })
        .then(function(data) {
            productPage.data.products = data;
            productPage.getProduct();
        })
        .catch(function(err) {
            // Une erreur est survenue
        });
    },

    getProduct: function() {
        // LA LISTE DES PRODUITS CORRESPOND A productPage.data.products
        productPage.data.products.forEach((p, index) => {
            if (p._id === productPage.data.productId) {
                productPage.data.currentProduct = p;
            };
        });
        productPage.insertProduct();
        

    },

    insertProduct: function() {
        // LE PRODUIT EST = A productPage.data.currentProduct

        const el = productPage.domElements;

        let img = document.createElement('img');

        img.setAttribute('src', productPage.data.currentProduct.imageUrl);
        img.setAttribute('alt', productPage.data.currentProduct.altTxt); 
        el.img.appendChild(img);
        
        el.title.textContent = productPage.data.currentProduct.name;
        el.price.textContent = productPage.data.currentProduct.price;
        el.description.textContent = productPage.data.currentProduct.description;

        productPage.data.currentProduct.colors.forEach((c, index) => {
            let option = document.createElement('option');
            option.setAttribute('value', c);
            option.textContent = c;
            el.colors.appendChild(option);
        });
        
        el.btnAddCart.addEventListener('click', productPage.insertCart);
    },

    insertCart: function() {
        // vérifier si la couleurs et éxistante et si la quantité est inférieure à 100
        // si la condition du haut est vérifier on insert dans le panier sinon on lance un message d'alerte
        const el = productPage.domElements;
        const qte = el.quantity.value;
        const color = el.colors.value;
        const id = productPage.data.currentProduct._id;
        let cart = JSON.parse(localStorage.getItem("cart"));

        if(cart === null && typeof cart !== "array") {
            cart = [];
        };

        if((qte !== 0 && qte<100) && color !== "" ) {
            let itemCart = {quantity:qte, color, id:id};

            cart.forEach((c, index)=>{
                if(c.id === id && c.color === color){
                    itemCart.quantity = parseInt(c.quantity, 10) + parseInt(qte, 10);
                    cart.splice(index, 1);
                };
            });
            cart.push(itemCart);
        }
        else {
            alert('impossible d\'ajouter au panier');
        };
        localStorage.setItem('cart',JSON.stringify(cart));
    },
};

productPage.init();
