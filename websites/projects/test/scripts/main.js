/* 
 * Created by: Zach MacKay
 * Description: Web App made for listing collectable cards faster
 * Date Started: 2018-11-09
 * Last Edited: 2019-01-19
 */

window.onload = function () {
    prefillDropDowns();

    document.querySelector("#btnDone").addEventListener("click", createListingTitle);
    document.querySelector("#btnSettings").addEventListener("click", settingsPanel);
    document.querySelector("#chkManualManu").addEventListener("click", checkManualManu);
    document.querySelector("#chkManualName").addEventListener("click", checkManualName);
    document.querySelector("#chkManualTeam").addEventListener("click", checkManualTeam);
    document.querySelector("#copyGeneratedText").addEventListener("click", clickToHighlight);
    document.querySelector("#clearSelections").addEventListener("click", clickToClearSelections);

}

function loadApiObject(url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {

            readData(xmlhttp.responseText); // do something when server responds
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function createListingTitle() {
    //reads all inputs to create title to copy
    var html = "";
    var output = document.querySelector("#copyFrom");
    var nameListHelper = document.querySelector("#nameListHelper");
    var year = document.querySelector("#cardYear").value;
    var manu = document.querySelector("#cardManu").value;
    var manuType = document.querySelector("#cardType");
    if (!manuType.classList.contains("hidden")) {
        manuType = " " + document.querySelector("#cardManuType").value;
    } else {
        manuType = "";
    }
    var pname = document.querySelector("#cardPlayer").value;
    pname = reverseName(pname);
    var team = document.querySelector("#cardTeam").value;
    var cardNo = document.querySelector("#cardNum").value;
    var numSign = "";
    var tempName = document.querySelector("#playerN");
    if (tempName.classList.contains("hidden")) {
        pname = document.querySelector("#inputName").value;
    }
    if (cardNo != "") {
        numSign = " #";
    }
    
    html += year + " " + manu + manuType + " - Hockey, " + team + " - " + pname + numSign + cardNo + "";
    
    var name = "\"" + pname + "\",";
    nameListHelper.value = name;
    output.value = html;
    document.querySelector("#cardPlayer").value = "";
    document.querySelector("#cardNum").value = "";
    hideType();
}

function readData(data) {
    //data = JSON.parse(dataIn);
    var html = "";

    //drop down for card year, changing year limits not yet implemented
    html = "<div id=\"singleDrop\"> Year: <select id=\"cardYear\">";
    for (var i = 1940; i < 2020; i++) {
        html += "<option>" + i + "-" + (i + 1) + "</option>";
    }

    html += "</select>";
    
    //drop down for card manufacturer
    html += "</div><div id=\"singleDrop\"> Manu: <select id=\"cardManu\">";
    for (var i = 0; i < data.manufacturer.length; i++) {
        html += "<option>" + data.manufacturer[i] + "</option>";
    }

    html += "</select>";
    
    //this button unhides manufacturer type drop down, drop down auto hides after hitting generate
    html += "<p><button id=\"addType\">Add Sub-Type</button></p>";

    //hidden manufacturer type drop down.
    html += "<div id=\"cardType\" class=\"hidden\">Type: <select id=\"cardManuType\">";
    for (var i = 0; i < data.type.length; i++) {
        html += "<option>" + data.type[i] + "</option>";
    }

    html += "</select>";
    
    //shows player names with last name first. if more than two names do not reverse, ie 'John Apple Smith' will not display last name first
    html += "</div></div><div id=\"singleDrop\"><div id=\"playerN\"> Player: <select id=\"cardPlayer\">";
    for (var i = 0; i < data.players.length; i++) {
        var player = reverseName(data.players[i]);
        html += "<option>" + player + "</option>";
    }

    html += "</select>";
    
    //hidden input for manual input of player name if it's missing from the list, unhidden via settings
    html += "</div><div id=\"manualName\" class=\"hidden\">Player: <input type=\"text\" id=\"inputName\">";


    html += "</div></div><div id=\"singleDrop\"> Team: <select id=\"cardTeam\">";
    for (var i = 0; i < data.teams.length; i++) {
        html += "<option>" + data.teams[i] + "</option>";
    }

    html += "</select>";
    
    html += "</div><div id=\"singleDrop\"> Number: <input type=\"text\" id=\"cardNum\"></div>";

    var htmlArea = document.querySelector("#dropFill");
    htmlArea.innerHTML += html;

    document.querySelector("#addType").addEventListener("click", unhideType);
}

function reverseName(name) {
    //takes an array with first and last name seperated by a space and reverses it
    //ie: Zach MacKay -> MacKay, Zach
    var split = name.split(" ");
    if (split.length == 2) {
        name = split[1] + " " + split[0];
    }
    return name;
}

function hideType() {

    var manuType = document.querySelector("#cardType");
    manuType.classList.add("hidden");
    manuType = document.querySelector("#addType");
    manuType.classList.remove("hidden");

}

function unhideType() {

    var manuType = document.querySelector("#cardType");
    manuType.classList.remove("hidden");
    manuType = document.querySelector("#addType");
    manuType.classList.add("hidden");

}

function clickToHighlight() {
    document.querySelector("#copyFrom").select();
}

function clickToClearSelections(){
    document.querySelector("#cardPlayer").value = "";
    document.querySelector("#cardNum").value = "";
}

function doNothing() {

}

function prefillDropDowns() {
    //Get API for teams here: https://github.com/dword4/nhlapi#teams
    //https://gitlab.com/dword4/nhlapi
    //https://statsapi.web.nhl.com/api/v1/teams

    var loadObj = hockeyObj;
    readData(loadObj);
}

function settingsPanel() {
    var settings = document.querySelector("#settingsPanel");
    showHide(settings);
}

function checkManualManu() {
    var settings = document.querySelector("#manualName");
    showHide(settings);
    settings = document.querySelector("#manuN");
    showHide(settings);
}

function checkManualName() {
    var settings = document.querySelector("#manualName");
    showHide(settings);
    settings = document.querySelector("#playerN");
    showHide(settings);
}

function checkManualTeam() {
    var settings = document.querySelector("#manualName");
    showHide(settings);
    settings = document.querySelector("#teamN");
    showHide(settings);
}

function showHide(settings) {
    if (settings.classList.contains("hidden")) {
        settings.classList.remove("hidden");
    } else {
        settings.classList.add("hidden");
    }
}

/****************************************************************************
 *               NO ADDITIONAL FUNCTIONS BEYOND HERE                        *
 ****************************************************************************/

//loading this way as temp work-around
var hockeyObj = {
    "manufacturer": [
        "",
        "Be a Player",
        "Be a Player In the Game",
        "Bowman",
        "Bowman's Best",
        "Bowman Chrome",
        "Bowman Draft Picks",
        "Classic",
        "Collector's Edge",
        "Donruss",
        "Donruss Elite",
        "Donrus Playoff",
        "Fleer",
        "Fleer SkyBox",
        "Leaf",
        "Leaf Limited",
        "OPC",
        "OPC Chrome",
        "Pacific",
        "Pacific Crown Royale",
        "Panini",
        "Parkhurst",
        "Pinnacle",
        "Pinnacle Select",
        "Press Pass",
        "ProCards",
        "Pro Set",
        "Score",
        "Topps",
        "Topps Chrome",
        "Topps Finest",
        "Topps Heritage",
        "Topps Stadium Club",
        "Topps T205",
        "Upper Deck",
        "Upper Deck SP Authentic",
        "Upper Deck MVP"],
    "type": [
        "",
        "Bens Bread",
        "Esso",
        "Humpty Dumpty",
        "Kellogs",
        "Kraft",
        "McDonalds",
        "Post",
        "Vachon",
        "Zellers",
        "",
        "Black",
        "Checklist",
        "Gold",
        "Insert",
        "Paralell",
        "Platinum",
        "Red",
        "Rookie Card",
        "Rookie Year",
        "Short Print",
        "Silver"
    ],
    "teams": [
        "",
        "New Jersey Devils",
        "New York Islanders",
        "New York Rangers",
        "Philadelphia Flyers",
        "Pittsburgh Penguins",
        "Boston Bruins",
        "Buffalo Sabres",
        "Montréal Canadiens",
        "Ottawa Senators",
        "Toronto Maple Leafs",
        "Carolina Hurricanes",
        "Florida Panthers",
        "Tampa Bay Lightning",
        "Washington Capitals",
        "Chicago Blackhawks",
        "Detroit Red Wings",
        "Nashville Predators",
        "St. Louis Blues",
        "Calgary Flames",
        "Colorado Avalanche",
        "Edmonton Oilers",
        "Vancouver Canucks",
        "Anaheim Ducks",
        "Dallas Stars",
        "Los Angeles Kings",
        "San Jose Sharks",
        "Columbus Blue Jackets",
        "Minnesota Wild",
        "Winnipeg Jets",
        "Arizona Coyotes",
        "Vegas Golden Knights"
    ],
    "players": [
        //Players are listed by First Name then Last name, sorted by Last name alphabetical
        "",
        "Chris Ahrens",
        "Claire Alexander",
        "Tony Amonte",
        "Glen Anderson",
        "Jim Anderson",
        "John Anderson",
        "Ron Anderson",
        "Davd Andreychuk",
        "Lou Angotti",
        "Chuck Arnason",
        "Syl Apps",
        "Al Arbour",
        "Steve Atkinson",
        "Normand Aubin",
        "Don Awrey",
        "Garnet Bailey",
        "Bill Barber",
        "Fred Barrett",
        "Michel Belhumeur",
        "Jean Beliveau",
        "Curt Bennett",
        "Jim Benning",
        "Drake Berehowsky",
        "Red Berenson",
        "Bill Berg",
        "Tommie Bergman",
        "Dwight Bialowas",
        "Tom Bladon",
        "Mike Bloom",
        "Greg Boddy",
        "Marc Boileau",
        "F. Boimistruck",
        "Ivan Boldirev",
        "Marcel Bonin",
        "Paulin Bordeleau",
        "Henry Boucha",
        "Dan Bouchard",
        "Pierre Bouchard",
        "Andre Boudrias",
        "Pat Boutette",
        "Johnny Bower",
        "Scotty Bowman",
        "Record Breaker",
        "Larry Brown",
        "Johnny Bucyk",
        "Dave Burrows",
        "Jerry Butler",
        "Jerry Byers",
        "Craig Cameron",
        "Gene Carr",
        "Larry Carriere",
        "Guy Charron",
        "Team Checklist",
        "Gerry Cheevers",
        "Chris Chelios",
        "Bobby Clarke",
        "Bill Clement",
        "Gary Coalter",
        "Bill Collins",
        "Rey Comeau",
        "Yvan Cournoyer",
        "Bruce Cowick",
        "Terry Crisp",
        "Sidney Crosby",
        "Gary Croteau",
        "Barry Cullen",
        "John Davidson",
        "Butch Deadmarsh",
        "Nelson Debenedet",
        "Alex Delvecchio",
        "Ab DeMarco",
        "Bill Derlago",
        "Marcel Dionne",
        "Gary Dornhoefer",
        "Jude Drouin",
        "Ken Dryden",
        "Gary Doak",
        "Rick Dudley",
        "Denis Dupere",
        "Andre Dupont",
        "Steve Durbano",
        "Bill Durnan",
        "Mike Eastwood",
        "Tim Ecclestone",
        "Jack Egers",
        "Dave Ellett",
        "Ron Ellis",
        "Tony Esposito",
        "Chris Evans",
        "Bill Fairbairn",
        "Doug Favell",
        "George Ferguson",
        "Bill Flett",
        "Rick Foley",
        "Dave Fortier",
        "Emile Francis",
        "Miroslav Frycer",
        "Grant Fuhr",
        "Bob Gagnon",
        "Bob Gainey",
        "Scott Garland",
        "Bernie Geoffrion",
        "Ed Giacomin",
        "Barry Gibbs",
        "Rod Gilbert",
        "Doug Gilmour",
        "Brian Glennie",
        "Larry Goodenough",
        "Glenn Goldup",
        "Jack Gordon",
        "John Gould",
        "Danny Grant",
        "Wayne Gretzky",
        "Bep Guidolin",
        "G. Hainsworth",
        "Jean Hamel",
        "Inge Hammarstrom",
        "Rick Hampton",
        "Ron Harris",
        "Doug Harvey",
        "Fred Harvey",
        "Lorne Henning",
        "Denis Herron",
        "Ernie Hicke",
        "Ken Hodge",
        "Bill Hogaboam",
        "Doug Horbul",
        "Garry Howatt",
        "Dave Hudson",
        "Bobby Hull",
        "Dennis Hull",
        "Peter Ihnacak",
        "Gary Inness",
        "Ted Irvine",
        "Doug Jarrett",
        "Pierre Jarry",
        "Joey Johnston",
        "Tom Johnson",
        "Greg Joly",
        "Sheldon Kannegiesser",
        "Dennis Kearns",
        "Bob Kelly",
        "Orest Kindrachuk",
        "Neil Komadoski",
        "Jerry Korab",
        "Jim Korn",
        "Cliff Koroll",
        "Dave Kryskow",
        "Yvon Labre",
        "Guy Lafleur",
        "Pete Laframboise",
        "Jean-Guy Lagace",
        "Bobby Lalonde",
        "Yvon Lambert",
        "Jacques Laperriere",
        "Guy Lapointe",
        "Michel Larocque",
        "Reg Leach",
        "Team Leaders",
        "Bob Leiter",
        "Richard Lemieux",
        "Don Lever",
        "Dave Lewis",
        "Nick Libett",
        "Bill Lochead",
        "Ross Lonsberry",
        "Jim Lorentz",
        "Ron Low",
        "Don Luce",
        "Joe Lundrigan",
        "Jack Lynch",
        "Tom Lysiak",
        "Lowell MacDonald",
        "Rick MacLeish",
        "Keith Magnuson",
        "Chico Maki",
        "Wayne Maki",
        "Bill Macmillan",
        "Jamie Macoun",
        "Phil Maloney",
        "Kent Manderville",
        "Randy Manery",
        "Cesare Maniago",
        "Bob Manno",
        "Gilles Marotte",
        "Pit Martin",
        "Rick Martin",
        "Don Marshall",
        "Ted McAneeley",
        "Keith McCreary",
        "Lanny McDonald",
        "Peter McDuffe",
        "Bob McGill",
        "Jim McKenny",
        "Gord McRae",
        "Gerry Meehan",
        "Gilles Meloche",
        "Barry Melrose",
        "Wayne Merrick",
        "Stan Mikita",
        "Bill Mikkelson",
        "Dmitri Mironov",
        "Lyle Moffat",
        "Dickie Moore",
        "Lew Morrison",
        "Bob Murray",
        "Bob Murdoch",
        "Lou Nanne",
        "Mats Naslund",
        "Bob Neely",
        "Bob Nevin",
        "Simon Nolet",
        "Bill Nyrop",
        "Chris Oddleifson",
        "Gerry O'Flaherty",
        "Murray Oliver",
        "Wilf Paiemont",
        "Mike Palmateer",
        "Bob Paradise",
        "Bernie Parent",
        "Brad Park",
        "Mike Pelyk",
        "Gil Perreault",
        "Pierre Pilote",
        "Jacques Plante",
        "Pierre Plante",
        "Michel Plasse",
        "Walt Poddubny",
        "Felix Potvin",
        "Jean Potvin",
        "Lynn Powis",
        "Tracy Pratt",
        "Dean Prentice",
        "Noel Price",
        "Jean Pronovost",
        "Bob Pulford",
        "Pat Quinn",
        "Craig Ramsay",
        "Jean Ratelle",
        "Bill Reay",
        "Dick Redmond",
        "Mickey Redmond",
        "Henri Richard",
        "Jaques Richard",
        "Doug Risebrough",
        "Tom Reid",
        "Rene Robert",
        "Phil Roberto",
        "Doug Roberts",
        "Jim Roberts",
        "Larry Robinson",
        "Mike Robitaille",
        "Dale Rolfe",
        "Larry Romanchych",
        "Darcy Rota",
        "Randy Rota",
        "Bobby Rousseau",
        "Patrick Roy",
        "Phil Russell",
        "Gary Sabourin",
        "Joe Sakic ",
        "Rocky Saganiuk",
        "Don Saleski",
        "Borje Salming",
        "Serge Savard",
        "Jim Schoenfeld",
        "Ron Schock",
        "Dave Schultz",
        "Rod Seiling",
        "Fred Shero",
        "Steve Shutt",
        "Darryl Sittler",
        "Billy Smith",
        "Brian Spencer",
        "Fred Stanfield",
        "Frank St.Marseille",
        "Wayne Stephenson",
        "Ralph Stewart",
        "Jean Guy Talbot",
        "Dale Talon",
        "Wayne Thomas",
        "Floyd Thompson",
        "Walt Tkaczuk",
        "Mario Tremblay",
        "Ian Turnbull",
        "Norm Ullman",
        "Gary Unger",
        "Rogie Vachon",
        "Eric Vail",
        "Rick Vaive",
        "Jack Valiquette",
        "Ed VanImpe",
        "Vic Venasky",
        "Steve Vickers",
        "Gilles Villemure",
        "Bryan Watson",
        "Jim Watson",
        "Joe Watson",
        "Stan Weir",
        "Ed Westfall",
        "Juha Widing",
        "Tom Williams",
        "Bert Wilson",
        "Murray Wilson",
        "Dunc Wilson",
        "Rick Wilson",
        "Lorne \"Gump\" Worsley",
        "Ken Wregget"
    ]
};
