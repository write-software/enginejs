//--------------------------------------------------------------------------------
// Elements  Page
//--------------------------------------------------------------------------------

var elementsView = new view("",{ url:"./app/views/elements.html"});

$engine.registerElement("myElement",categoryModel,"<span>{= $scope.data[$scope.index].text =}</span>",{});

var elementsPage = new component(
    null,
    elementsView,
    {
        id:'elements',
        methods:{
        }
    });