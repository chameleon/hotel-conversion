// I made this relative because my IE11/Edge in my VM machine
// could not see it otherwise
// const ApiPathPrefix = "http://localhost:8888/api/";
// Last update: 10/21 
const ApiPathPrefix = "../api/";

$(document).ready(function() {
	// Grab list of hotels - (can't Fetch() becasue IE11)
    $.ajax({
        url: ApiPathPrefix + "hotels/",
        success: function(jsonData) {
            let hotels = jsonData.list;
            //Alphabetize
            hotels.sort(function(a, b) {
                a = a.name.toLowerCase();
                b = b.name.toLowerCase();
                return a < b ? -1 : a > b ? 1 : 0;
            });

            //Remove duplicates.  Loop through and if current name = previous name, remove.
            let prevHotelName = "";
            for (let i in hotels) {
                let currentHotelName = jsonData.list[i].name;

                if (currentHotelName == prevHotelName) {
                    delete hotels[i];
                } else {
                    //Set global var to current name
                    prevHotelName = currentHotelName;
                }
            }
            //Draw html loop
            for (let x in hotels) {
                let listHTML = "<div class='hotel-list-item'><div class='hotel-list_title'>";
                listHTML += hotels[x].name;
                listHTML += "</div><div class='hotel-list_price'>$";
                listHTML += hotels[x].price.toFixed(2);
                listHTML += "</div></div>";
                $("#hotelListSidebar").append(listHTML);
            }
        }
    });

    // Grab hotel details & display
    $.ajax({
        url: ApiPathPrefix + "hotels/venetian",
        success: function(jsonData) {
            let hotelName = jsonData.name;
            let hotelPrice = jsonData.price;
            let hotelAddress = jsonData.location.address;
            hotelAddress += ", " + jsonData.location.city;
            hotelAddress += ", " + jsonData.location.state;
            hotelAddress += " " + jsonData.location.postalCode;
            let hotelDescription = jsonData.description;
            hotelDescription = hotelDescription.replace(/\r\n\r\n/g, "</p><p>");
            let hotelArea = jsonData.location.areaName;
            let medias = jsonData.media;
            let hotelImageUrl = medias[0].href;
            let hotelMapUrl = medias[1].href;
            let hotelPhone = jsonData.phoneNumber;
            let hotelPhoneNoHyphens = hotelPhone.replace(/-/g, "");
            //Round star rating to the nearest 1/4 star and display
            let starRating = jsonData.starRating;
            //round to next 1/4 star because smaller partial stars look bad or broken.
            let howManyFullStars = Math.floor(starRating);
            //get remaining decimal value  
            let decimalRemainder = (starRating - Math.floor(starRating)).toFixed(2);
            //round decimal  to nearest 1/4 star
            let closestQuarter = Math.round(decimalRemainder * 4) / 4;
            let finalStarNum = howManyFullStars + closestQuarter;
            //convert finalStarNum into % of div to cover
            let roundedStarPercent = finalStarNum * 20;

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

            let x = "";
            for (let i in jsonData.details) {
                x += "<h2>" + jsonData.details[i].label + "</h2>";
                x += "<p>" + jsonData.details[i].value + "</p>";
            }
            $("#hotelDetailsText").append(x);
        }
    });

    //Click handling
    //If a tab is clicked, change it's state and show it's related content:
    var currentTab = "#hotelDescriptionTab"; //default -  I used var becuase I might want this globally available later.
    
    $("#hotelDescriptionTab").click(function() {
        if (currentTab != this) {
            //Remove 'selected' from current tabs
            $(currentTab).removeClass("tab--selected");
            currentTab = this;
            //add 'selected' state to current tab
            $(this).addClass("tab--selected");
            // hide all content divs, (or previous) and show selected
            $(".content-container").addClass("hidden");
            $("#hotelDiscription").removeClass("hidden");
        };
    });
    $("#hotelDetailsTab").click(function() {
        if (currentTab != this) {
            $(currentTab).removeClass("tab--selected");
            currentTab = this;
            $(this).addClass("tab--selected");
            $(".content-container").addClass("hidden");
            $("#hotelDetails").removeClass("hidden");
        };
    });
    $("#hotelLocationTab").click(function() {
        if (currentTab != this) {
            $(currentTab).removeClass("tab--selected");
            currentTab = this;
            $(this).addClass("tab--selected");
            $(".content-container").addClass("hidden");
            $("#hotelLocation").removeClass("hidden");
        };
    });
    //If map pin icon is clicked:
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
    $('#hideHotelDescription').hide(); // Default state- text is truncated
    // If either is clicked toggle the height class and link text and icon
    $('#hideHotelDescription, #showHotelDescription').on(
        'click',
        function() {
        	$('#hotelDescriptionText').toggleClass("height-200");
            $('#hideHotelDescription, #showHotelDescription').toggle();    
        }
    );
    
    //Expand / condense details text
    $('#hideHotelDetails').hide(); // Default state- text is truncated
    // If either is clicked toggle the height class and link text and icon
    $('#hideHotelDetails, #showHotelDetails').on(
        'click',
        function() {
        	$('#hotelDetailsText').toggleClass("height-200");
            $('#hideHotelDetails, #showHotelDetails').toggle();
        }
    );
});