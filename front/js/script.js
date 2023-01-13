const indexPage = {

    data: {
        productId: null,
        currentProduct: null,
        products: null,
    },

    domElements: {
        items: document.querySelector('#items'),
    },

    init: function() {
        indexPage.getProducts();
    },

    getProducts: function() {
        fetch("http://localhost:3000/api/products")
        .then(function(res) {
        if (res.ok) {
            return res.json();
        }
        })
        .then(function(data) {
        indexPage.data.products = data;
        indexPage.insertProducts();
        })
        .catch(function(err) {
        // Une erreur est survenue
        });
    },

    insertProducts: function() {
        // p= 1 produit de 'products' et index est l'index du tableau à l'instant t
        indexPage.data.products.forEach((p, index) => {

            const el = indexPage.domElements;

            let htmla = document.createElement('a');
            let idcanap = "product.html?id=" + p._id;
            htmla.setAttribute('href',idcanap);
            
            let article = document.createElement('article');
    
            let img = document.createElement('img');
            img.setAttribute('src',p.imageUrl);
            img.setAttribute('alt',p.altTxt);
    
            let title = document.createElement('h3');
            title.setAttribute('class','productName');
            title.textContent = p.name;
            
            let description =document.createElement('p');
            description.setAttribute('class','productDescription');
            description.textContent = p.description;
            
            article.append(img,title,description);
            htmla.append(article);
    
            el.items.appendChild(htmla);
        });
    },

};

indexPage.init();
