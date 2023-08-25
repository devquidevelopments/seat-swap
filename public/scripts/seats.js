document.addEventListener("DOMContentLoaded", function (e) {
    var selectedSeat = document.getElementById("selected_seat").innerHTML;
    document.getElementById(selectedSeat).style.appearance = "none";
    document.getElementById(selectedSeat).style.backgroundColor = "green";

    const selections = [];
    const inputElems = document.getElementsByTagName("input");
    const hiddenSeatElem = document.getElementById("hidden_seats");
    const seatsElem = document.getElementById("selected_seats");

    for (let i = 0; i < inputElems.length; i++) {
        if (inputElems[i].type === "checkbox") {
            inputElems[i].addEventListener("click", displayCheck);
        }
    }

    function displayCheck(e) {
        if (e.target.checked) {
            selections.push(e.target.value);
        } else {
            const index = selections.indexOf(e.target.value);
            if (index > -1) {
                selections.splice(index, 1)
            }
        }

        if (selections.length > 5 || selections[0] == selectedSeat) {
            e.preventDefault();
            const index = selections.indexOf(e.target.value);
            if (index > -1) {
                selections.splice(index, 1)
            }
            return;
        }

        seatsElem.innerHTML = selections.join(",");
        hiddenSeatElem.value = selections;
    }
});