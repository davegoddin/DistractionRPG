document.getElementById("item-submit").addEventListener("click", submit);

// initialise UI list
getStoredObject("distractions").then((result) => {
    if (result == null) { return;}
    result.forEach(distraction => {
        let savedDistraction = new Distraction(distraction.url, distraction.id);
        addUiListItem(savedDistraction);
    });
});

function submit()
{
    // get input from form
    let input = document.getElementById("new-url");
    let url = input.value;

    // insert and update UI
    addDistraction(url);
    //reset input
    input.value="";
    
}



function addDistraction(url)
{
    
    let distraction = new Distraction(url);
    
    let updatedStoredDistractions = [];
    
    getStoredObject("distractions").then((result) => {
        if (result != null && result.length > 0)
        {
            updatedStoredDistractions = result
            if (updatedStoredDistractions.find(d => d.url === distraction.url) != undefined) {
                return;
            }
        }

        updatedStoredDistractions.push(distraction);
        browser.storage.local.set({distractions: updatedStoredDistractions});
        addUiListItem(distraction);
    });
}

function addUiListItem(distraction)
{
    let newItem = document.createElement('div');
    let list = document.getElementsByClassName("distraction-list")[0];
    list.appendChild(newItem);
    newItem.outerHTML = distraction.html();
    list.lastChild.getElementsByClassName("item-remove-button")[0].addEventListener("click", function(){removeDistraction(distraction.id)});
}

function removeDistraction(id)
{
    //update local storage
    getStoredObject("distractions").then((result) =>
    {   
        let updatedStoredDistractions = []
        if (result == null || result.length == 0)
        {
            return;
        }
        else
        {
            updatedStoredDistractions = result;
            let distractionIndex = updatedStoredDistractions.findIndex(d => d.id === id);
            if (distractionIndex > -1) {
                updatedStoredDistractions.splice(distractionIndex, 1);
            }
            browser.storage.local.set({distractions: updatedStoredDistractions});
            removeUiListItem(id);
            console.log(updatedStoredDistractions);
        }        
    });
}

function removeUiListItem(id)
{
    document.getElementById(id).remove();
}



class Distraction {

    constructor(url, id){
        this.url = url;
        if (id ===undefined)
        {
            this.id = new Date().getTime();
        }
        else {
            this.id = id;
        }
    }

    // returns html component for UI
    html() {
        return `<div class="distraction-list-item" id="${this.id}">
                    <div class="item-url">${this.url}</div>
                    <div class="item-remove-button">
                        <?xml version="1.0" encoding="UTF-8"?>
                            <svg version="1.1" viewBox="0 0 30.468 30.468">
                                <g transform="translate(-44.1 -60.804)">
                                    <path d="m59.334 60.804a15.234 15.234 0 0 0-15.234 15.234 15.234 15.234 0 0 0 15.234 15.234 15.234 15.234 0 0 0 15.234-15.234 15.234 15.234 0 0 0-15.234-15.234zm-9.0713 13.1h18.143v4.5356h-18.143z" opacity=".996" stroke-dasharray="1, 1" stroke-linecap="square" style="paint-order:markers fill stroke"/>
                                </g>
                            </svg>
                        </div>
                </div>`;
    }
}