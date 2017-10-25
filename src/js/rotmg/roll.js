function RollCalc() {
    var classInpt,
        lvlInpt,
        hpInpt,
        mpInpt,
        result,
        allClasses = [],
        characterTypes = [];

    function HeroClass(name, initHP, initMP, minHpGain, maxHpGain, minMpGain, maxMpGain) {
        var self = this;

        this.type = name;
        this.initialHp = initHP;
        this.initialMp = initMP;

        this.minHpGain = minHpGain;
        this.maxHpGain = maxHpGain;
        this.minMpGain = minMpGain;
        this.maxMpGain = maxMpGain;

        this.minHp = initHP + (minHpGain * 19);
        this.maxHp = initHP + (maxHpGain * 19);
        this.minMp = initHP + (minMpGain * 19);
        this.maxMp = initHP + (maxMpGain * 19);

        this.getAverageHpAtLevel = function (level) {
            return self.initialHp + ((self.minHpGain + self.maxHpGain) / 2) * (level - 1);
        };
        this.getminHpGainAtLevel = function (level) {
            return self.initialHp + self.minHpGain * (level - 1);
        };
        this.getAverageMpAtLevel = function (level) {
            return self.initialMp + ((self.minMpGain + self.maxMpGain) / 2) * (level - 1);
        };
    }
    function getHeroClassByType(text) {
        var i;

        if (!text) {
            return;
        }
        for (i = 0; i < allClasses.length; i++) {
            if (allClasses[i].type.length >= text.length &&
                    allClasses[i].type.toLowerCase().lastIndexOf(text.toLowerCase(), 0) === 0) {
                return allClasses[i];
            }
        }
    }
    function writeBasicClassInfo(charClass) {
        var title = result.getElementsByTagName('h1')[0],
            div = document.getElementById('avg-at-20'),
            h = document.createElement('h2'),
            p = document.createElement('p');

        if (div) {
            div.parentNode.removeChild(div);
        }

        div = document.createElement('div');

        title.childNodes[0].nodeValue = 'Compared to an average ' + charClass.type + '...';
        div.setAttribute('id', 'avg-at-20');

        h.appendChild(document.createTextNode('At level 20:'));
        div.appendChild(h);

        p.appendChild(document.createTextNode('Average Class HP: ' + charClass.getAverageHpAtLevel(20)));
        div.appendChild(p);

        p = document.createElement('p');
        p.appendChild(document.createTextNode('Average Class MP: ' + charClass.getAverageMpAtLevel(20)));
        div.appendChild(p);

        result.appendChild(div);
    }
    function writeLevelInfo(charClass, level) {
        var div = document.getElementById('avg-at-level'),
            h = document.createElement('h2'),
            p = document.createElement('p');

        if (div) {
            div.parentNode.removeChild(div);
        }

        div = document.createElement('div');
        div.setAttribute('id', 'avg-at-level');

        h.appendChild(document.createTextNode('At current level (' + level + '):'));
        div.appendChild(h);

        p.appendChild(document.createTextNode('Average HP: ' + charClass.getAverageHpAtLevel(level)));
        div.appendChild(p);

        p = document.createElement('p');
        p.appendChild(document.createTextNode('Average MP: ' + charClass.getAverageMpAtLevel(level)));
        div.appendChild(p);

        result.insertBefore(div, result.getElementsByTagName('h1')[0].nextSibling);
    }
    function writeHpInfo(charClass, level, hp) {
        var levelDiv = document.getElementById('avg-at-level'),
            twentyDiv = document.getElementById('avg-at-20'),
            p,
            span = document.createElement('span');

        p = levelDiv.getElementsByTagName('p')[0];
        span.appendChild(document.createTextNode('Your HP: ' + hp));
        span.className = 'stat';
        p.appendChild(span);

        p = twentyDiv.getElementsByTagName('p')[0];
        span = document.createElement('span');
        span.appendChild(document.createTextNode('You, Assuming Average Growth: ' + 
            (hp + (20 - level) * (charClass.minHpGain + charClass.maxHpGain) / 2)));
        span.className = 'stat';
        span.setAttribute('title',
            'This projection assumes your ' + charClass.type + '\'s HP increases at an average rate of ' +
            ((charClass.minHpGain + charClass.maxHpGain) / 2) + ' HP per level.');
        p.appendChild(span);

        if (level > 1) {
            span = document.createElement('span');
            span.appendChild(document.createTextNode('You, Assuming Current Growth: ' +
                Math.floor(hp + (20 - level) * (hp - charClass.initialHp) / (level - 1))));
            span.className = 'stat';
            span.setAttribute('title',
                'This projection assumes your ' + charClass.type + '\'s HP continues increasing at a rate of ' +
                Math.round((hp - charClass.initialHp) / (level - 1) * 100) / 100 + ' HP per level.');
            p.appendChild(span);
        }

        span = document.createElement('span');
        span.appendChild(document.createTextNode('Your Best-Case: ' + 
            (hp + (20 - level) * charClass.maxHpGain)));
        span.className = 'stat';
        span.setAttribute('title',
            'This projection assumes your ' + charClass.type + '\'s HP increases at the maximum rate of ' +
            charClass.maxHpGain + ' HP per level.');
        p.appendChild(span);

        span = document.createElement('span');
        span.appendChild(document.createTextNode('Your Worst-Case: ' + 
            (hp + (20 - level) * charClass.minHpGain)));
        span.className = 'stat';
        span.setAttribute('title',
            'This projection assumes your ' + charClass.type + '\'s HP increases at the minimum rate of ' +
            charClass.minHpGain + ' HP per level.');
        p.appendChild(span);
    }
    function writeMpInfo(charClass, level, mp) {
        var levelDiv = document.getElementById('avg-at-level'),
            twentyDiv = document.getElementById('avg-at-20'),
            p,
            span = document.createElement('span');

        p = levelDiv.getElementsByTagName('p')[1];
        span.appendChild(document.createTextNode('Your MP: ' + mp));
        span.className = 'stat';
        p.appendChild(span);

        p = twentyDiv.getElementsByTagName('p')[1];
        span = document.createElement('span');
        span.appendChild(document.createTextNode('You, Assuming Average Growth: ' + 
            (mp + (20 - level) * (charClass.minMpGain + charClass.maxMpGain) / 2)));
        span.className = 'stat';
        span.setAttribute('title',
            'This projection assumes your ' + charClass.type + '\'s MP increases at an average rate of ' +
            ((charClass.minMpGain + charClass.maxMpGain) / 2) + ' MP per level.');
        p.appendChild(span);

        if (level > 1) {
            span = document.createElement('span');
            span.appendChild(document.createTextNode('You, Assuming Current Growth: ' +
                Math.floor(mp + (20 - level) * (mp - charClass.initialMp) / (level - 1))));
            span.className = 'stat';
            span.setAttribute('title',
                'This projection assumes your ' + charClass.type + '\'s MP continues increasing at a rate of ' +
                Math.round((mp - charClass.initialMp) / (level - 1) * 100) / 100 + ' MP per level.');
            p.appendChild(span);
        }

        span = document.createElement('span');
        span.appendChild(document.createTextNode('Your Best-Case: ' + 
            (mp + (20 - level) * charClass.maxMpGain)));
        span.className = 'stat';
        span.setAttribute('title',
            'This projection assumes your ' + charClass.type + '\'s MP increases at the maximum rate of ' +
            charClass.maxMpGain + ' MP per level.');
        p.appendChild(span);

        span = document.createElement('span');
        span.appendChild(document.createTextNode('Your Worst-Case: ' + 
            (mp + (20 - level) * charClass.minMpGain)));
        span.className = 'stat';
        span.setAttribute('title',
            'This projection assumes your ' + charClass.type + '\'s MP increases at the minimum rate of ' +
            charClass.minMpGain + ' MP per level.');
        p.appendChild(span);
    }
    function updateResults() {
        var intro = document.getElementById('intro'),
            charClass = getHeroClassByType(classInpt.value),
            level = parseInt(lvlInpt.value, 10),
            hp = parseInt(hpInpt.value, 10),
            mp = parseInt(mpInpt.value, 10);

        if (charClass) {
            if (intro) {
                intro.parentNode.removeChild(intro);
            }
            writeBasicClassInfo(charClass);
            if (level && level > 0 && level < 21) {
                writeLevelInfo(charClass, level);
                if (hp && hp >= charClass.initialHp && hp <= charClass.maxHp) {
                    writeHpInfo(charClass, level, hp);
                }
                if (mp && mp >= charClass.initialMp && mp <= charClass.maxMp) {
                    writeMpInfo(charClass, level, mp);
                }
            }
        }
    }

    this.initialize = function () {
        var i, menu;

        classInpt = document.getElementById('class');
        lvlInpt = document.getElementById('level');
        hpInpt = document.getElementById('baseHP');
        mpInpt = document.getElementById('baseMP');
        result = document.getElementById('result');

        allClasses = [
            new HeroClass("Rogue", 150, 100, 20, 30, 2, 8),
            new HeroClass("Archer", 130, 100, 20, 30, 2, 8),
            new HeroClass("Wizard", 100, 100, 20, 30, 5, 15),
            new HeroClass("Priest", 100, 100, 20, 30, 5, 15),
            new HeroClass("Warrior", 200, 100, 20, 30, 2, 8),
            new HeroClass("Knight", 200, 100, 20, 30, 2, 8),
            new HeroClass("Paladin", 200, 100, 20, 30, 2, 8),
            new HeroClass("Assassin", 150, 100, 20, 30, 2, 8),
            new HeroClass("Necromancer", 100, 100, 20, 30, 5, 15),
            new HeroClass("Huntress", 130, 100, 20, 30, 2, 8),
            new HeroClass("Mystic", 100, 100, 20, 30, 5, 15),
            new HeroClass("Trickster", 150, 100, 20, 30, 2, 8),
            new HeroClass("Sorcerer", 100, 100, 20, 30, 5, 15)
        ];

        for (i = 0; i < allClasses.length; i++) {
            characterTypes.push(allClasses[i].type);
        }

        menu = new InputSuggestions('class', characterTypes);
        menu.initialize();

        classInpt.onkeyup = updateResults;

        classInpt.onblur = function () {
            var heroClass = getHeroClassByType(classInpt.value);

            updateResults();
            classInpt.value = heroClass.type;
        };
        lvlInpt.onkeyup = lvlInpt.onblur = lvlInpt.onclick = updateResults; 
        hpInpt.onkeyup = hpInpt.onblur = hpInpt.onclick = updateResults;
        mpInpt.onkeyup = mpInpt.onblur = mpInpt.onclick = updateResults;
        // onclick in case they click on the up/down buttons in the number input
    };
}
