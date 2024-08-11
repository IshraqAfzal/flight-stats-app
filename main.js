
//declaring  variables
var today, max, min, maxDate, maxYear, maxMonth, maxYear, minDate, minYear, minMonth, minDay, selectedDateStringFetch, selectedDateStringHeading, dateElement, selectedDateYear, selectedDateMonth, selectedDateDay, selectedDateDayHeading, selectedDateMonthHeading, selectedDateStringFetch, selectedDateStringHeading, depTotal, arrTotal, destinations, origins, depSpecialCases, arrSpecialCases, val

//finding the max possible date and min possible date for form validation
today = new Date()
max = new Date( today - 24 * 60 * 60 * 1000 )
min = new Date( today - 91 * 24 * 60 * 60 * 1000 )
maxYear = max.getFullYear()
maxMonth = (max.getMonth() + 1) < 10 ? '0' + (max.getMonth() + 1) : (max.getMonth() + 1)
maxDay = max.getDate() < 10 ? '0' + max.getDate() : max.getDate()
minYear = min.getFullYear()
minMonth = (min.getMonth() + 1) < 10 ? '0' + (min.getMonth() + 1) : (min.getMonth() + 1)
minDay = min.getDate() < 10 ? '0' + min.getDate() : min.getDate()
maxDate = `${maxYear}-${maxMonth}-${maxDay}`
minDate = `${minYear}-${minMonth}-${minDay}`
dateElement = document.getElementById("date")
dateElement.setAttribute("min", minDate)
dateElement.setAttribute("max", maxDate)
//creating objects to store the flight times and the origin and departures
var originArr = []
var destinationArr = []

var arrivalTimes = [{ hours : '01' , num : 0 }, { hours : '02' , num : 0 }, { hours : '03' , num : 0 }, { hours : '04' , num : 0 }, { hours : '05' , num : 0 }, { hours : '06' , num : 0 }, { hours : '07' , num : 0 }, { hours : '08' , num : 0 }, { hours : '09' , num : 0 }, { hours : '10' , num : 0 }, { hours : '11' , num : 0 }, { hours : '12' , num : 0 }, { hours : '13' , num : 0 }, { hours : '14' , num : 0 }, { hours : '15' , num : 0 }, { hours : '16' , num : 0 }, { hours : '17' , num : 0 }, { hours : '18' , num : 0 }, { hours : '19' , num : 0 }, { hours : '20' , num : 0 }, { hours : '21' , num : 0 }, { hours : '22' , num : 0 }, { hours : '23' , num : 0 }]
var departureTimes = [{ hours : '01' , num : 0 }, { hours : '02' , num : 0 }, { hours : '03' , num : 0 }, { hours : '04' , num : 0 }, { hours : '05' , num : 0 }, { hours : '06' , num : 0 }, { hours : '07' , num : 0 }, { hours : '08' , num : 0 }, { hours : '09' , num : 0 }, { hours : '10' , num : 0 }, { hours : '11' , num : 0 }, { hours : '12' , num : 0 }, { hours : '13' , num : 0 }, { hours : '14' , num : 0 }, { hours : '15' , num : 0 }, { hours : '16' , num : 0 }, { hours : '17' , num : 0 }, { hours : '18' , num : 0 }, { hours : '19' , num : 0 }, { hours : '20' , num : 0 }, { hours : '21' , num : 0 }, { hours : '22' , num : 0 }, { hours : '23' , num : 0 }]

//function that determines what is to be done when the submit button is clicked
function FormSubmitListener(event)
{
    event.preventDefault()

    if (dateElement.value === "")
    {
        document.getElementById("error").innerText = "Please enter a date for the search"
    }
    else if (new Date(dateElement.value) >= max)
    {
        document.getElementById("error").innerText = "Select any date before today"
    }
    else if (new Date(dateElement.value) <= min)
    {
        document.getElementById("error").innerText = `Select any date after ${minDate}`
    }
    else
    {
        document.getElementById("error").innerText = ""

        //creating the date string for the json fetch and for the heading above the charts
        selectedDateYear = new Date(dateElement.value).getFullYear()
        selectedDateMonth = new Date(dateElement.value).getMonth() + 1
        selectedDateMonthHeading = (new Date(dateElement.value).getMonth() + 1) < 10 ? '0' + (new Date(dateElement.value).getMonth() + 1) : (new Date(dateElement.value).getMonth()  + 1)
        selectedDateDay = new Date(dateElement.value).getDate()
        selectedDateDayHeading = new Date(dateElement.value).getDate() < 10 ? '0' + new Date(dateElement.value).getDate() : new Date(dateElement.value).getDate()
        selectedDateStringFetch = `${selectedDateYear}-${selectedDateMonth}-${selectedDateDay}`
        selectedDateStringHeading = `${selectedDateYear}-${selectedDateMonthHeading}-${selectedDateDayHeading}`
        
        //emptying the date input field
        dateElement.value = "";

        //for the heading over the charts
        document.getElementById("flightStatistics").innerText = "Flight Statistics on " + selectedDateStringHeading

        //calling the function that performs the json fetch
        AjaxRequest()
    }
}

document.getElementById("form").addEventListener("submit", FormSubmitListener)

//this function sends the ajax request and performs some functions accordingly
function AjaxRequest()
{
    //fetching departure data
    fetch(`flight.php?date=${selectedDateStringFetch}&lang=en&cargo=false&arrival=false`)
    .then( response => response.json())
    .then( data => CreateDepartureFlightStatistics(data))
    .catch( error => console.error(error))

    //fetching arrival data
    fetch(`flight.php?date=${selectedDateStringFetch}&lang=en&cargo=false&arrival=true`)
    .then( response => response.json())
    .then( data => CreateArrivalFlightStatistics(data))
    .catch( error => console.error(error))
}

function CreateArrivalFlightStatistics(data)
{   
    document.getElementById("heading2").innerHTML = "Arrivals"
    arrTotal = 0
    let next = 0;
    let prev = 0;
    let cancellations = 0;
    let delays = 0;
    for ( var x = 0; x < data.length; x++)
    {   
        if ( data[x].date == selectedDateStringHeading )
        {
            for (var y = 0; y < data[x].list.length; y++)
            {
                let found = false
                arrTotal += 1
                //checking the originArr array to see if the origin is already present
                    for (let i of originArr)
                    {
                        if (i.name == data[x].list[y].origin[0])
                        {
                            i.value += 1
                            found = true
                            break
                        }
                    }
                    if (found === false)
                    {
                        originArr.push({name: data[x].list[y].origin[0], value: 1})
                    }

                if( data[x].list[y].status == "Cancelled" )
                {
                    cancellations += 1
                }
                else if ( data[x].list[y].status == "Delayed" )
                {
                    delays +=1 
                }
                else if ( data[x].list[y].status.length == 13 )
                {
                    for (let j = 0; j < arrivalTimes.length; j++)
                    {
                        if (arrivalTimes[j].hours == data[x].list[y].status.slice(8, 10))
                        {
                            arrivalTimes[j].num += 1
                        }
                    }
                }
            }
        }
    } 

    document.getElementById("arrivals").innerHTML = "<b>Total Flights</b>: " + arrTotal
    document.getElementById("origins").innerHTML = "<b>Origins</b>: " + originArr.length

    var specialCases = ""
    
    val = cancellations > 0 ? `Cancelled: ${cancellations}` : ""
    specialCases += val

    val = delays > 0 ? ` Delayed: ${delays}` : ""
    specialCases += val

    document.getElementById("ASpecial").innerHTML = `<b>Special Cases</b>: ${specialCases}`

    //creating the arrival histograms
    for (let x of arrivalTimes)
    {   
        const div = document.createElement("div")
        div.style.textAlign = "left";
        div.style.height = "40px"
        div.style.width = "400px"

        const axis = document.createElement("span")
        axis.innerHTML = x.hours
        axis.style.marginLeft = "1rem"
        axis.style.marginRight = "1rem"

        const bar = document.createElement("span")
        bar.style.marginLeft = "1 rem"
        bar.style.display = "inline-flex"
        bar.style.color = "#FFC0CB"
        bar.style.width = `${x.num*5}px`
        bar.style.height = "20px"
        bar.style.backgroundColor = "#FFC0CB"
 
        const value = document.createElement("span")
        value.innerHTML = x.num > 0 ? x.num : ""
        value.style.marginLeft = "1rem"

        document.getElementById("histogram2").appendChild(div)
        div.appendChild(axis)
        div.appendChild(bar)
        div.appendChild(value)
    }

    //creating the top10 originis part
    originArr.sort((a, b) => b.value - a.value)
    document.getElementById("title2").innerHTML = "Top Ten Origins"
    document.getElementById("airport2").innerHTML = "Airport"
    document.getElementById("flightNum2").innerHTML = "No. of Flights"
    fetch("iata.json")
    .then(response => response.json())
    .then(data => {
        for (let a = 0; a < 10; a++)
        {
            for (let b of data)
            {
                if (b.iata_code == originArr[a].name){
                    CreateTableElements( "topOrigins", originArr[a].name, b.name, originArr[a].value)
                }
            }
        }
    })
    .catch(error =>
        {
            console.error(error);
        })

}

function CreateDepartureFlightStatistics(data)
{   
    document.getElementById("heading1").innerHTML = "Departures"
    let depTotal = 0
    let prev = 0;
    let cancellations = 0
    let delays = 0
    for ( var x = 0; x < data.length; x++)
    {   
        if ( data[x].date == selectedDateStringHeading )
        {
            for (var y = 0; y < data[x].list.length; y++)
            {
                depTotal += 1

                let found = false
                for (let i of destinationArr)
                {
                    if (i.name == data[x].list[y].destination[0])
                    {
                        i.value += 1
                        found = true
                    }
                }
                if (found == false)
                {
                    destinationArr.push( {name: data[x].list[y].destination[0], value: 1})
                }
                if( data[x].list[y].status == "Cancelled" )
                {
                    cancellations += 1
                }
                else if ( data[x].list[y].status == "Delayed" )
                {
                    delays +=1 
                }
                else if ( data[x].list[y].status.length == 9)
                {
                    for (let j = 0; j < departureTimes.length; j++)
                    {
                        if (departureTimes[j].hours == data[x].list[y].status.slice(4, 6))
                        {
                            departureTimes[j].num += 1
                        }
                    }
                }
            }
        }
    }
    document.getElementById("departures").innerHTML = "<b>Total Flights</b>: " + depTotal
    document.getElementById("destinations").innerHTML = "<b>Destinations</b>: " + destinationArr.length

    var specialCases = ""
    
    var val = cancellations > 0 ? `Cancelled: ${cancellations}` : ""
    specialCases += val

    val = delays > 0 ? ` Delayed: ${delays}` : ""
    specialCases += val

    document.getElementById("DSpecial").innerHTML = `<b>Special Cases</b>: ${specialCases}`

    for (let x of departureTimes)
    {   
        const div = document.createElement("div")
        div.style.textAlign = "left";
        div.style.height = "40px"
        div.style.width = "400px"

        const axis = document.createElement("span")
        axis.innerHTML = x.hours
        axis.style.marginLeft = "1rem"
        axis.style.marginRight = "1rem"

        const bar = document.createElement("span")
        bar.style.display = "inline-block"
        bar.style.width = `${x.num*5}px` 
        bar.style.height = "20px"
        bar.style.backgroundColor = "#FFC0CB"
 
        const value = document.createElement("span")
        value.innerHTML = x.num > 0 ? x.num : ""
        value.style.marginLeft = "1rem"

        document.getElementById("histogram1").appendChild(div)
        div.appendChild(axis)
        div.appendChild(bar)
        div.appendChild(value)
    }
    //sorting the destinationArr to find the top 10 destinations IATA code
    destinationArr.sort((a, b) => b.value - a.value)
    document.getElementById("title1").innerHTML = "Top Ten Destinations"
    document.getElementById("airport1").innerHTML = "Airport"
    document.getElementById("flightNum1").innerHTML = "No. of Flights"
    fetch("iata.json")
    .then(response => response.json())
    .then(data => {
        for (let a = 0; a < 10; a++)
        {
            for (let b of data)
            {
                if (b.iata_code == destinationArr[a].name){
                    CreateTableElements( "topDestinations", destinationArr[a].name, b.name, destinationArr[a].value)
                }
            }
        }
    })
    .catch(error =>
        {
            console.error(error);
        })
}

function CreateTableElements( tableID, iataCode, airportName, numFlights ){
    var tr = document.createElement("tr")
    var td1 = document.createElement("td")
    td1.innerHTML = iataCode
    td1.style.fontWeight = "bold"
    td1.style.textAlign = "center"
    var td2 = document.createElement("td")
    td2.innerHTML = airportName
    td2.style.textAlign = "center"
    var td3 = document.createElement("td")
    td3.innerHTML = numFlights
    td3.style.textAlign = "center"
    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)
    document.getElementById(tableID).appendChild(tr)
    dateElement.addEventListener("click", ClearPage)
}

function ClearPage()
{
    document.getElementById("flightStatistics").innerHTML = ""
    document.getElementById("main").innerHTML = ""
}


















