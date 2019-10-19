$(document).ready(function() {
	// Grab list of hotels
    $.ajax({
        url: "../api/hotels/",
        success: function(jsonData) {
            var hotels = jsonData.list;
            //Alphabetize
            hotels.sort(function(a, b) {
                a = a.name.toLowerCase();
                b = b.name.toLowerCase();
                return a < b ? -1 : a > b ? 1 : 0;
            });

            //Remove duplicates.  Loop through and if current name = previous name, remove.
            var prevHotelName = "";
            for (i in hotels) {
                var currentHotelName = jsonData.list[i].name;

                if (currentHotelName == prevHotelName) {
                    delete hotels[i];
                } else {
                    //Set global var to current name
                    prevHotelName = currentHotelName;
                }
            }
            //Draw html loop
            for (x in hotels) {
                var listHTML = "<div class='hotel-list-item'><div class='hotel-list_title'>";
                listHTML += hotels[x].name;
                listHTML += "</div><div class='hotel-list_price'>$";
                listHTML += hotels[x].price.toFixed(2);
                listHTML += "</div></div>";
                $("#hotelListSidebar").append(listHTML);
            }
        }
    });

    // Grab hotel details
    $.ajax({
        url: "../api/hotels/venetian",
        success: function(jsonData) {
            var hotelName = jsonData.name;
            var hotelPrice = jsonData.price;
            var hotelAddress = jsonData.location.address;
            hotelAddress += ", " + jsonData.location.city;
            hotelAddress += ", " + jsonData.location.state;
            hotelAddress += " " + jsonData.location.postalCode;
            var hotelDescription = jsonData.description;
            hotelDescription = hotelDescription.replace(/\r\n\r\n/g, "</p><p>");
            var hotelArea = jsonData.location.areaName;
            var medias = jsonData.media;
            var hotelImageUrl = medias[0].href;
            var hotelMapUrl = medias[1].href;
            //get phone number and put into page and <a tel: attribute
            var hotelPhone = jsonData.phoneNumber;
            var hotelPhoneNoHyphens = hotelPhone.replace(/-/g, "");
            //Round star rating to the nearest 1/4 star and display
            var starRating = jsonData.starRating;
            //round to next 1/4 star because smaller partial stars look bad or broken.
            var howManyFullStars = Math.floor(starRating);
            //get remaining decimal value  
            var decimalRemainder = (starRating - Math.floor(starRating)).toFixed(2);
            //round decimal  to nearest 1/4 star
            var closestQuarter = Math.round(decimalRemainder * 4) / 4;
            var finalStarNum = howManyFullStars + closestQuarter;
            //convert finalStarNum into % of div to cover
            var roundedStarPercent = finalStarNum * 20;

            // Data into page
            $("#hotelPhone").attr('href', "tel:+" + hotelPhoneNoHyphens);
            $("#hotelPhoneSpan").append(hotelPhone);
            $("#starBlocker").attr('style', "left:" + roundedStarPercent + "%");
            $("#hotelName").append(hotelName);
            $("#hotelPriceNumber").append("$" + hotelPrice);
            $("#hotelDescriptionTextP").append(hotelDescription);
            $("#hotelAddress").append(hotelAddress);
            $("#hotelArea").append(hotelArea);
            $("#hotelImageUrl").attr('src', hotelImageUrl);
            $("#hotelMapUrl").attr('src', hotelMapUrl);

            var x = "";
            for (i in jsonData.details) {
                x += "<h2>" + jsonData.details[i].label + "</h2>";
                x += "<p>" + jsonData.details[i].value + "</p>";
            }
            $("#hotelDetailsText").append(x);

        }
    });

    //Click handling
    //If a tab is clicked, change it's state and show it's related content:
    var currentTab = "#hotelDescriptionTab"; //default
    
    $("#hotelDescriptionTab").click(function() {
        if (currentTab != "#hotelDescriptionTab") {
            //Remove 'selected' from current tabs
            $(currentTab).removeClass("tab--selected");
            currentTab = "#hotelDescriptionTab";
            //add 'selected' state to current tab
            $("#hotelDescriptionTab").addClass("tab--selected");
            // hide all content divs, (or previous) and show selected
            $(".content-container").addClass("hidden");
            $("#hotelDiscription").removeClass("hidden");
        };
    });
    $("#hotelDetailsTab").click(function() {
        if (currentTab != "#hotelDetailsTab") {
            $(currentTab).removeClass("tab--selected");
            currentTab = "#hotelDetailsTab";
            $("#hotelDetailsTab").addClass("tab--selected");
            $(".content-container").addClass("hidden");
            $("#hotelDetails").removeClass("hidden");
        };
    });
    $("#hotelLocationTab").click(function() {
        if (currentTab != "hotelLocationTab") {
            $(currentTab).removeClass("tab--selected");
            currentTab = "#hotelLocationTab";
            $("#hotelLocationTab").addClass("tab--selected");
            $(".content-container").addClass("hidden");
            $("#hotelLocation").removeClass("hidden");
        };
    });
    $("#hotelLocationLink").click(function() {
        if (currentTab != "#hotelLocation") {
            // Select the Map tab
            $(currentTab).removeClass("tab--selected");
            currentTab = "#hotelLocation";
            $("#hotelLocationTab").addClass("tab--selected");
            $(".content-container").addClass("hidden");
            $("#hotelLocation").removeClass("hidden");
            $("#hotelLocation").hide();
            $("#hotelLocation").show(1000);
        };
    });
    //Expand / condense description text	
    $('#hideHotelDescription').hide();
    $('#hideHotelDescription, #showHotelDescription').on(
        'click',
        function() {
            $('#hideHotelDescription, #showHotelDescription').toggle();
            $('#hotelDescriptionText').toggleClass("height-200");
        }
    );
    //Expand / condense details text
    $('#hideHotelDetails').hide();
    $('#hideHotelDetails, #showHotelDetails').on(
        'click',
        function() {
            $('#hideHotelDetails, #showHotelDetails').toggle();
            $('#hotelDetailsText').toggleClass("height-200");
        }
    );
});