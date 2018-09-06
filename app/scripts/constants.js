const navbar = `
<nav class="navbar  en-bg-white">
<div class="container-fluid">
    <div class="navbar-header">
        <a href="javascript:void(0);" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false"></a>
        <a href="javascript:void(0);" class="bars" style="margin-top:-20px;"></a>
        <a class="navbar-brand" href="#">
            <div class="">
                <div class="en-inline">
                    <img class="en-logo  m-t--35" src="assets/images/logo.png" />
                </div>
                <div class="en-inline custom-title">
                    {% name %}
                    <br>
                    <span style="font-size:0.8em;">{% tagline %}&nbsp;</span>            
                </div>
            </div>
        </a>
    </div>
    <div class="collapse navbar-collapse" id="navbar-collapse">
        <ul class="nav navbar-nav navbar-right">
            <li>
                <div class="m-t-10 m-l-10 cursor" en-click="onimage" title='Uplaod  Image'>
                    <i class="material-icons" style='font-size:18pt;'>image</i> Image</div>
            </li>
            <li>
                <div class="m-t-10 m-l-10 cursor" en-click="onlogo" title='Set Logo'>
                    <i class="material-icons" style='font-size:18pt;'>portrait</i> Logo</div>
            </li>
            <li>
                <div class="m-t-10  m-l-10 js-right-sidebar cursor" data-close="true" title='Edit Details'>
                    <i class="material-icons">edit</i> Details</div>
            </li>
            <li>
                <div class="m-t-10 m-l-10 cursor" en-click="onsignout" title='Sign Out'>
                    <i class="material-icons" style='font-size:18pt;'>input</i> Sign Out</div>
            </li>
        </ul>
    </div>
</div>
</nav>`;

engine.attachConstants('navbar',navbar);
