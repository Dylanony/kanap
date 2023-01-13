const confirmationPage = {

    data: {
        queryString: null,
        urlParams: null,
        orderId: null
    },

    init: function() {
        confirmationPage.getUrlParams();
        confirmationPage.displayOrderId();
    },

    getUrlParams: function() {
        const queryString = window.location.search;
        confirmationPage.data.urlParams = new URLSearchParams(queryString);
        confirmationPage.data.orderId = confirmationPage.data.urlParams.get('orderId');
    },

    displayOrderId:function() {
        document.getElementById('orderId').textContent = confirmationPage.data.orderId;
    },
};

confirmationPage.init();