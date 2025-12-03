recentNames = []

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                text = allText;
            }
        }
    }
    rawFile.send(null);
}

function specialCompleteScreen()
{
    card.innerHTML = "<p>Your job is done</p>";
}

function showRandomPunishment()
{
    card.innerHTML = "<p></p>";
    // Punishment cards
    instruction = punishments[Math.floor(Math.random()*punishments.length)];
    instruction = prepareInstruction(instruction);
    
    card.querySelector("p").innerHTML = instruction;
}

function markPerson(button)
{
    let name = button.target.innerHTML;
    markedPeople.push(name);
    console.log(markedPeople);
    specialCompleteScreen();
}

function prepareInstruction(instruction)
{
    if (instruction.match(/^SPECIAL/g))
    {
        instruction = instruction.substr("SPECIAL: ".length);
        if (instruction.match(/Guess/g))
        {
            return "This really shouldn't have happened. Take a sip for breaking the game!";
        }
        else if (instruction.match(/^Make a choice./g))
        {
            console.log("Creating special \"Make a choice\" card");
            
            drinkButton = document.createElement("button");
            drinkButton.innerHTML = "Finish";
            drinkButton.addEventListener("click",specialCompleteScreen);
            card.appendChild(drinkButton);

            punishmentButton = document.createElement("button");
            punishmentButton.innerHTML = "Random";
            punishmentButton.addEventListener("click",showRandomPunishment);
            card.appendChild(punishmentButton);

            return instruction;
        }
        else if (instruction.match(/^Waterfall relay/g))
        {
            console.log("Creating special \"Waterfall relay\" card");
            
            drinkButton = document.createElement("button");
            drinkButton.innerHTML = "Give out 5 sips";
            drinkButton.addEventListener("click",specialCompleteScreen);
            card.appendChild(drinkButton);

            relayButton = document.createElement("button");
            relayButton.innerHTML = "Waterfall relay";
            relayButton.addEventListener("click",function(){
                card.innerHTML = "<p></p>";
                // Waterfall relay activated!
                instruction = "<i>Looks like you want everyone to hate you...</i><br>Divide the room into two teams. Each person in a team must finish their drink before the next person starts. Last team to finish all their drinks loses and must do a shot each.";
                instruction = prepareInstruction(instruction);
                
                card.querySelector("p").innerHTML = instruction;
            });
            card.appendChild(relayButton);

            return "Choose one of the following:<br><span style='color:red;'>(Waterfall Relay is deadly)</span>";
        }
        else // Goes to original SPECIAL card
        {
            console.log(names);
            for (let person of names)
            {
                personButton = document.createElement("button");
                personButton.innerHTML = person;
                personButton.addEventListener("click",markPerson);
                card.appendChild(personButton);
            }
            return instruction;
        }
    }
    // Reduces chance of the same name being picked too much
    selectedPrsn = names[Math.floor(Math.random()*names.length)];
    if (recentNames.includes(selectedPrsn))
    {
        selectedPrsn = names[Math.floor(Math.random()*names.length)];
    }
    if (recentNames.length > names.length/2)
    {
        recentNames.pop();
    }
    recentNames.unshift(selectedPrsn);
    console.log(`Recent names: ${recentNames}`);

    instruction = instruction.replaceAll('prsn',`<b>${selectedPrsn}</b>`) // Randomly put in players names to suitable marked positions
    console.log(instruction.match(/[^\[\]]+(?=\])/g))
    if (instruction.match(/[^\[\]]+(?=\])/g) != null)
    {
        options = instruction.match(/[^\[\]]+(?=\])/g)[0].split(",");
        console.log(options);
        console.log(Math.random()*options.length)
        instruction = instruction.replace(/\[([^}]*)\]/g,options[Math.floor(Math.random()*options.length)])
    }
    return instruction;
}

function formatNamesList(list)
{

    if (list.length > 1)
    {
        sentence = "";
        for (let x=0; x<list.length-2; x++)
        {
            sentence += `<b>${list[x]}</b>, `;
        }
        sentence += `<b>${list[list.length-2]}</b> and <b>${list[list.length-1]}</b>`;
        return sentence;
    }
    else
    {
        return `<b>${list[0]}</b>`;
    }
}

function nextCard()
{
    console.log("Next card please");
    card.innerHTML = "<p>Loading card...</P>";
    rand = Math.random()
    chanceOfCommon = 0.4;
    chanceOfUncommon = 0.2;
    chanceOfAssasination = markedPeople.length/50; // Gets more likely to assinate the more targets there are
    if (rand<chanceOfAssasination)
    {
        instruction = "";
        // Assasinate card selector
        let multipleMarkedPeople = [...new Set(markedPeople.filter((item, index) => markedPeople.indexOf(item) != index))];
        // Multiple pick task (when people are selected multiple times)
        if (multipleMarkedPeople.length > 0)
        {
            if (multipleMarkedPeople.length == 1)
            {
                instruction = `<b>${multipleMarkedPeople[0]}</b> was selected multiple times so must down their drink!`;
            }
            else
            {
                instruction += formatNamesList(multipleMarkedPeople);
                /*for (let person of multipleMarkedPeople)
                {
                    instruction += `<b>${person}</b><br>`;
                }*/
                instruction += " were selected multiple times so must down their drinks!";
            }
        }
        else
        {
            // Standard task
            if (markedPeople.length == 1)
            {
                instruction = `<b>${markedPeople[0]}</b> must do a dance for 20 seconds`;
            }
            else
            {
                instruction += formatNamesList(markedPeople);
                /*for (let person of markedPeople)
                {
                    instruction += `<b>${person}</b><br>`;
                }*/
                instruction += " must do a 30 second dance together";
            }
        }
        markedPeople = []; // Resets marked people
        
        card.querySelector("p").innerHTML = instruction;
    }
    else if (rand<chanceOfAssasination+chanceOfCommon)
    {
        // Common cards
        instruction = common[Math.floor(Math.random()*common.length)];
        instruction = prepareInstruction(instruction);
        
        card.querySelector("p").innerHTML = instruction;
    }
    else if(rand<chanceOfAssasination+chanceOfCommon+chanceOfUncommon)
    {
        // Uncommon cards
        instruction = uncommon[Math.floor(Math.random()*uncommon.length)];
        instruction = prepareInstruction(instruction);
        
        card.querySelector("p").innerHTML = instruction;
    }
    else
    {
        // Rare cards
        var index = Math.floor(Math.random()*rare.length); // Index used to remove card once played
        instruction = rare[index];
        instruction = prepareInstruction(instruction);

        card.querySelector("p").innerHTML = instruction;
        rare.splice(index,1);
    }
}

function addName()
{
    // Gets name value and clears field
    console.log("Adding player");
    var name = nameInput.value.replace(/^\s|\s$/g,''); // Removes spaces;
    if (name != "")
    {
        nameInput.value = "";
        console.log(name);

        // Adds name to list and makes a new player card
        /*names.push(name);
        var nameCard = document.createElement("div"); // Not made a button so the cross can be added inside
        nameCard.classList.value = "button";
        nameCard.innerHTML = name;
        */
       // Make new name item
        let newName = document.createElement("div");
        newName.className = "confirmed-box";
        newName.innerHTML = `
            <a>Person</a>
            <img id="remove-person" src="../legacy media/Cross.png" />
        `;
        newName.querySelector("a").textContent = name;
        newName.querySelector("#remove-person").addEventListener("click", removeElement);

        namesContainer.appendChild(newName);
        names.push(name);
    }
}

function removeElement(event) {
    let item = event.currentTarget.parentElement;
    nameValue = item.querySelector("a").textContent;
    item.remove();
    names = names.filter(n => n != nameValue);
    console.log("Item removed");
}

const nextButton = document.querySelector('#next-button');
const card = document.querySelector('.card');
const nameInput = document.querySelector('#name');
const namesContainer = document.querySelector('#names');
const nameForm = document.querySelector("#name-form");
nameForm.addEventListener("submit",function(e){e.preventDefault();});

var instruction
var names = [];
var markedPeople = [];
card.querySelector("p").innerHTML = "Welcome To Drinkage!";

var text = "No cards found!";


readTextFile("https://ueacs.co.uk/Drinkage/common.txt");

//console.log("Common:"+text);
const common = text.split('\n');

readTextFile("https://ueacs.co.uk/Drinkage/uncommon.txt");

//console.log("Uncommon:"+text);
const uncommon = text.split('\n');

readTextFile("https://ueacs.co.uk/Drinkage/rare.txt");

//console.log("Rare:"+text);
const rare = text.split('\n');

readTextFile("https://ueacs.co.uk/Drinkage/punishments.txt");

//console.log("Rare:"+text);
const punishments = text.split('\n');

nextButton.addEventListener("click", nextCard);