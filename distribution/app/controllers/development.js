//--------------------------------------------------------------------------------
// Development Page
//--------------------------------------------------------------------------------

var developmentView = new view("", {
    url: "./app/views/development.html"
});


var developmentModel2 = new model({
    title: 'Tina',
    qty: 2
}, {
    name: 'developmentModel2',
    methods: {
        getQty: function () {
            return this._data.qty;
        }
    }
});


var developmentPage = new component(
    developmentModel,
    developmentView, {
        id: 'development',
        methods: {
            ondatachange: function (prop, value) {},
            afterNavigate: function () {},
            onclick: function () {
                app.fileupload("Product Datasheet", {
                        command: 'products.setdatasheet',
                        guid: "1234"
                    },
                    "./api/",
                    function (event, data) {
                        alert(event)
                    });
            }
        }
    });