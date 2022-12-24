browser.storage.local.onChanged.addListener((changes, area) => {
    if (Object.keys(changes).includes("timer"))
    {
        updateUiTimer();
    }
})



class UiButton
{
    constructor(pageName, caption, id)
    {
        this.pageName = pageName;
        this.caption = caption;
        this.id = id;
    }
}

// list of UI buttons
let uiButtons = [
    new UiButton("battle", "Battle!", "popup-battle"),
    new UiButton("inventory", "Inventory", "popup-inventory"),
    new UiButton("distractions", "Distractions", "popup-distractions")
];

insertUiButtons(uiButtons);
updateUiTimer();

function onError()
{
    console.log("Error")
}

function insertUiButtons(buttons)
{
    let buttonElements = [];

    buttons.forEach(uiButton => {
        // create element
        let newButton = document.createElement("div");
        // update from array item
        newButton.className="popup-button";
        newButton.id = uiButton.id;
        newButton.innerHTML = uiButton.caption;
        newButton.addEventListener("click", function(){launchWindow(uiButton.pageName)});
        // push to element array
        buttonElements.push(newButton);        
    });

    document.getElementsByClassName("popup-grid")[0].lastChild.after(...buttonElements);
}

function updateUiTimer()
{
    getStoredObject("timer").then((result) => 
    {
        if (result != null)
        {
            document.getElementById("popup-streak").innerHTML = result.streak;
            document.getElementById("popup-total").innerHTML = result.total;
        }
    });
}

function launchWindow(pageName)
{
    console.log(pageName);
    let createData = {
            type: "detached_panel",
            url: `../extension/${pageName}.html`,
            width: 500,
            height: 300
        };
    let creating = browser.windows.create(createData);
}

