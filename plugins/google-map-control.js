var marker;
var map;

function initialize() {
    $("#link1").click(function() {
        changeMarkerPos(22.3122722,114.2231561);
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        window.infowindow.close();
        window.infowindow = new google.maps.InfoWindow({
            content: '<div class="address-detail">' +
                '<div class="address-detail-top">' +
                '<h5 class="main-title">Kwun Tong</h1>' +
                '</div>' +
                '<div class="address-detail-bottom">' +
                '<ul class="list-unstyled mt-20 mb-0">' +
                '<li>Address:</li>' +
                '<li>418 APM Hong Kong,Kwun Tong Road,Kwun Tong</li>' +
                '<li>Phone:</li>' +
                '<li>+852 3572 8900</li>' +
                '<li>Every Day: 8am - 6pm</li>' +
                '</ul>' +
                '</div>' +
                '</div>'
        });
        openPopup();
    });
    $("#link2").click(function() {
        changeMarkerPos(22.2796334,114.1817322);
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        window.infowindow.close();
        window.infowindow = new google.maps.InfoWindow({
            content: '<div class="address-detail">' +
                '<div class="address-detail-top">' +
                '<h5 class="main-title">Causeway Bay</h1>' +
                '</div>' +
                '<div class="address-detail-bottom">' +
                '<ul class="list-unstyled mt-20 mb-0">' +
                '<li>Address:</li>' +
                '<li>Hysan Place, 500 Hennessy Road, Causeway Bay, Hong Kong</li>' +
                '<li>Phone:</li>' +
                '<li>+852 3972 1500</li>' +
                '<li>Every Day: 8am - 6pm</li>' +
                '</ul>' +
                '</div>' +
                '</div>'
        });
        openPopup();

    });
    $("#link3").click(function() {
        changeMarkerPos(22.3817825,114.1865777);
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        window.infowindow.close();
        window.infowindow = new google.maps.InfoWindow({
            content: '<div class="address-detail">' +
                '<div class="address-detail-top">' +
                '<h5 class="main-title">Sha Tin</h1>' +
                '</div>' +
                '<div class="address-detail-bottom">' +
                '<ul class="list-unstyled mt-15 mb-0">' +
                '<li>Address:</li>' +
                '<li>New Town Plaza, New Town Plaza Phase 1 L4, 18 Sha Tin Centre Street, Hong Kong, Sha Tin, Hong Kong</li>' +
                '<li>Phone:</li>' +
                '<li>+852 3899 7800</li>' +
                '<li>Every Day: 8am - 6pm</li>' +
                '</ul>' +
                '</div>' +
                '</div>'
        });
        openPopup();

    });
    $("#link4").click(function() {
        changeMarkerPos(22.3372854,114.1724178);
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        window.infowindow.close();
        window.infowindow = new google.maps.InfoWindow({
            content: '<div class="address-detail">' +
                '<div class="address-detail-top">' +
                '<h5 class="main-title">Kowloon Tong</h1>' +
                '</div>' +
                '<div class="address-detail-bottom">' +
                '<ul class="list-unstyled mt-20 mb-0">' +
                '<li>Address:</li>' +
                '<li>Festival Walk, Festival Walk, 80 Tat Chee Avenue, Kowloon Tong, Hong Kong</li>' +
                '<li>Phone:</li>' +
                '<li>+852 3979 3600</li>' +
                '<li>Every Day: 8am - 6pm</li>' +
                '</ul>' +
                '</div>' +
                '</div>'
        });
        openPopup();

    });
    $("#link5").click(function() {
        changeMarkerPos(22.2853568,114.1559813);
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        window.infowindow.close();
        window.infowindow = new google.maps.InfoWindow({
            content: '<div class="address-detail">' +
                '<div class="address-detail-top">' +
                '<h5 class="main-title">Central</h1>' +
                '</div>' +
                '<div class="address-detail-bottom">' +
                '<ul class="list-unstyled mt-20 mb-0">' +
                '<li>Address:</li>' +
                '<li>ifc mall, tional Finance Centre, 8 Finance Street, Central, Hong Kong</li>' +
                '<li>Phone:</li>' +
                '<li>+852 3972 1500</li>' +
                '<li>Every Day: 8am - 6pm</li>' +
                '</ul>' +
                '</div>' +
                '</div>'
        });
        openPopup();

    });
    $("#link6").click(function() {
        changeMarkerPos(22.299129,114.166593);
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        window.infowindow.close();
        window.infowindow = new google.maps.InfoWindow({
            content: '<div class="address-detail">' +
                '<div class="address-detail-top">' +
                '<h5 class="main-title">Tsim Sha Tsui</h1>' +
                '</div>' +
                '<div class="address-detail-bottom">' +
                '<ul class="list-unstyled mt-20 mb-0">' +
                '<li>Address:</li>' +
                '<li>Canton Road, 100 Canton Road, Tsim Sha Tsui, Hong Kong</li>' +
                '<li>Phone:</li>' +
                '<li>+852 3979 8800</li>' +
                '<li>Every Day: 8am - 6pm</li>' +
                '</ul>' +
                '</div>' +
                '</div>'
        });
        openPopup();

    });
    var styles = [{
        stylers: [{
            saturation: -100
        }]
    }];
    var styledMap = new google.maps.StyledMapType(styles, {
        name: "Styled Map"
    });
    var mapProp = {
        center: new google.maps.LatLng(39.953732, 116.464300),
        zoom: 16,
        panControl: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        overviewMapControl: false,
        rotateControl: true,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style')

    var icon = {
        url: "images/google-logo.png", // url
        scaledSize: new google.maps.Size(79, 100), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };

    marker = new google.maps.Marker({
        position: new google.maps.LatLng(22.3122722,114.2231561),
        animation: google.maps.Animation.DROP,
        icon: icon,
    });

    window.infowindow = new google.maps.InfoWindow({
        content: '<div class="address-detail">' +
            '<div class="address-detail-top">' +
            '<h5 class="main-title">Kwun Tong</h1>' +
            '</div>' +
            '<div class="address-detail-bottom">' +
            '<ul class="list-unstyled mt-20 mb-0">' +
            '<li>Address:</li>' +
            '<li>418 APM Hong Kong,Kwun Tong Road,Kwun Tong</li>' +
            '<li>Phone:</li>' +
            '<li>+852 3572 8900</li>' +
            '<li>Every Day: 8am - 6pm</li>' +
            '</ul>' +
            '</div>' +
            '</div>'
    });

    marker.setMap(map);
    map.panTo(marker.position);

    var openPopup = function() {
        window.infowindow.open(map, marker); //設定點選 marker 打開資訊視窗事件
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }

    marker.addListener('click', openPopup);

}

function changeMarkerPos(lat, lon) {
    myLatLng = new google.maps.LatLng(lat, lon)
    marker.setPosition(myLatLng);
    map.panTo(myLatLng);
    marker.setAnimation(google.maps.Animation.BOUNCE);
}

google.maps.event.addDomListener(window, 'load', initialize);