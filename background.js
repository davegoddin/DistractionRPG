// initialise in-memory map (tabId => Distraction)
let currentDistractionTabs = new Map();

let timerStarted = false;

// initial check on browser load of all tabs
checkAllTabs();
startTimer();

// check updated tab
browser.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {  
  updateCurrentDistractionTabs(await checkTabs([tab]));
});

// check all tabs on updated storage
browser.storage.onChanged.addListener((changes, area) =>
{
  if (Object.keys(changes).includes("distractions"))
  {

    if (changes["distractions"].oldValue.length < changes["distractions"].newValue.length)  // distraction has been added
    {
      checkAllTabs();
    }
    else {  // distraction has been removed
      let removedItem = changes["distractions"].oldValue.filter(d => !changes["distractions"].newValue.includes(d))[0]; // identify removed site
      
      // iterate through currently stored tabs, delete any where removed distraction ID matches stored tab
      for (const [tabId, distraction] of currentDistractionTabs)
      {
        if (removedItem.id === distraction.id)
        {
          updateCurrentDistractionTabs(tabId);
        }
      }
    }
  }
  
});

browser.tabs.onRemoved.addListener((tabId) => {
  updateCurrentDistractionTabs(tabId);
});

function updateCurrentDistractionTabs(input) {
  switch (typeof input)
  {
    case "number":  // tabID
      if (currentDistractionTabs.get(input) != undefined)
      {
        currentDistractionTabs.delete(input);
      }
      break;
    case "object":  // map of new tabs to be logged
      if (input.size > 0) {
        // merge existing and new tabs in map
        currentDistractionTabs = new Map([...currentDistractionTabs, ...input]);
        startTimer();
      }
    default:
      break;
  }

  if (currentDistractionTabs.size == 0)
  {
    startTimer();
  }
  console.log(currentDistractionTabs);
}

async function checkTabs(tabs)    //takes tab array, returns map of tabId => distraction
{
  let activeDistractions = new Map();
  // get stored distraction sites
  return getStoredObject("distractions").then((distractions) => {
    console.log(distractions);
    // iterate through provided tab array
    for (let tIndex in tabs)
    {
      for (let dIndex in distractions)
      {
        if (compareUrls(distractions[dIndex].url, tabs[tIndex].url))
        {
          console.log("Distraction detected: " + tabs[tIndex].url);
          activeDistractions.set(tabs[tIndex].id, distractions[dIndex]);
          break;
        }
      }
    }
    return activeDistractions;
  });
}

function checkAllTabs()
{
  browser.tabs.query({}).then(async function (tabs) {
    updateCurrentDistractionTabs(await checkTabs(tabs));
  });
}

function compareUrls(storedUrl, liveUrl)
{
  const regex = /([A-Za-z]{3,9}:(?:\/\/)?)?(www\.)?([\S]+)/;
  let stored = storedUrl.match(regex)[3];
  let live = liveUrl.match(regex)[3];

  if (live.match(stored)) 
  {
    return true;
  }
  return false;
  
}



async function startTimer()
{
  
  if (!timerStarted)
  {
    let seconds = 0;
    let total = 0;
    let timerRecord = await getStoredObject("timer");
    if (timerRecord != null)
    {
      seconds = timerRecord.streak != null ? timerRecord.streak : 0;
      total = timerRecord.total != null ? timerRecord.total : 0;
    }
    
    timerStarted = true;
    let timer = setInterval(function() {
      if (currentDistractionTabs.size > 0)
      {
        clearInterval(timer);
        timerStarted = false;
        browser.storage.local.set({timer: {total: total, streak: 0}});
        return;
      }

      seconds++;
      total++;
      console.log(seconds + "(" + total + ")");
      
      browser.storage.local.set({timer: {total: total, streak: seconds}});
    }, 1000);
  }
}


  

  

  
