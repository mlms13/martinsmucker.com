function FameCalc() {
    var fieldset,
        baseInpt,
        totalInpt,
        lastChangedBase = true,
        achievements = [];

    function Achievement(name, desc, multiplier, fixed) {
        this.name = name;
        this.description = desc;
        this.multiplier = multiplier; // the fame multiplier associated with this achievement (e.g. 1.25 for 25%)
        this.fixed = fixed || 0; // some achievements have a fixed fame bonus (e.g. 10 fame)
        this.active = false; // this achievement has been selected by the user
    }
    function calculateTotalFame() {
        var total, i;

        lastChangedBase = true;
        total = parseInt(baseInpt.value, 10) || 0;
        for (i = 0; i < achievements.length; i++) {
            if (achievements[i].active) {
                total = Math.floor(total * achievements[i].multiplier);
                total += achievements[i].fixed;
            }
        }
        totalInpt.value = total;
    }
    function calculateBaseFame() {
        var base, i;

        lastChangedBase = false;
        base = parseInt(totalInpt.value, 10) || 0;
        for (i = achievements.length - 1; i >= 0; i--) {
            if (achievements[i].active) {
                base -= achievements[i].fixed;
                base = Math.ceil(base / achievements[i].multiplier);
            }
        }
        baseInpt.value = base;
    }
    function makeHandler (input, index) {
        return function () {
            var calculate = lastChangedBase ? calculateTotalFame : calculateBaseFame;

            achievements[index].active = input.checked;
            calculate();
        };
    }
    function buildForm() {
        var container, input, label, i;
        
        for (i = 0; i < achievements.length; i++) {
            container = document.createElement('div');
            container.className = 'input-group';

            input = document.createElement('input');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('id', 'inpt' + i);
            input.setAttribute('value', achievements[i].name);
            input.onchange = makeHandler(input, i);
            
            label = document.createElement('label');
            label.setAttribute('for', 'inpt' + i);
            label.setAttribute('title', achievements[i].description);
            label.appendChild(document.createTextNode(achievements[i].name));

            container.appendChild(input);
            container.appendChild(label);
            fieldset.appendChild(container);
        }
    }
    this.initialize = function () {
        fieldset = document.getElementById('achievements');
        baseInpt = document.getElementById('base');
        totalInpt = document.getElementById('total');

        achievements = [
            new Achievement('Ancestor', 'First in a long line of heroes.', 1.1, 20),
            new Achievement('Pacifist', 'Never dealt any damage.', 1.25),
            new Achievement('Thirsty', 'Never drank a potion.', 1.25),
            new Achievement('Mundane', 'Never used an ability.', 1.25),
            new Achievement('Boots on the Ground', 'Never teleported.', 1.25),
            new Achievement('Accurate', 'Accuracy of better than 25%.', 1.1),
            new Achievement('Sharpshooter', 'Accuracy of better than 50%.', 1.1),
            new Achievement('Sniper', 'Accuracy of better than 75%.', 1.1),
            new Achievement('Tunnel Rat', 'Completed every type of dungeon.', 1.1),
            new Achievement('Enemy of the Gods', 'More than 10% of kills are gods.', 1.1),
            new Achievement('Slayer of the Gods', 'More than 50% of kills are gods.', 1.1),
            new Achievement('Explorer', 'More than 1000000 tiles uncovered.', 1.05),
            new Achievement('Cartographer', 'More than 4000000 tiles uncovered.', 1.05),
            new Achievement('Team Player', 'More than 100 party member level ups.', 1.1),
            new Achievement('Leader of Men', 'More than 1000 party member level ups.', 1.1),
            new Achievement('Doer of Deeds', 'More than 1000 quests completed.', 1.1),
            new Achievement('Oryx Slayer', 'Dealt the killing blow to Oryx.', 1.1),
            new Achievement('Friend of the Cubes', 'Never killed a cube.', 1.1),
            new Achievement('Legacy Builder', 'Beat previous best level for this class.', 1, 10),
            new Achievement('First Born', 'Best fame of any of your previous incarnations.', 1.1)
            ];

        buildForm();
        baseInpt.onkeyup = totalInpt.onclick = calculateTotalFame;
        totalInpt.onkeyup = totalInpt.onclick = calculateBaseFame;
    };
}
