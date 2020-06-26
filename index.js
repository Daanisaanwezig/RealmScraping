const axios = require("axios");
const cheerio = require("cheerio");

let urls = ["https://www.realmeye.com/player/broodman", "https://www.realmeye.com/player/AkhilBeta", "https://www.realmeye.com/player/BlueTv", "https://www.realmeye.com/player/WizAdinek"];

urls.forEach(url => {
    console.log(url);
    axios.get(url, { headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'} })
    .then(async (response) => {
        let $ = cheerio.load(response.data);

        let summaryGeneral = await playerSummary($);
        let summaryCharacters = await characterSummary($);
    }).catch(err => console.log(err));
});

function playerSummary($) {

    let summary = {
        characters: [$('.summary')[0].children[0].children[0].children[1].children[0].data],
        skins: [$('.summary')[0].children[0].children[1].children[1].children[0].children[0].data],
        fame: [$('.summary')[0].children[0].children[2].children[1].children[0].children[0].data],
        exp: [$('.summary')[0].children[0].children[3].children[1].children[0].children[0].data],
        rank: [$('.summary')[0].children[0].children[4].children[1].children[0].children[0].data],
        accountFame: [$('.summary')[0].children[0].children[5].children[1].children[0].children[0].data],
        guild: [$('.summary')[0].children[0].children[6].children[1].children[0].children[0].data],
        guildRank: [$('.summary')[0].children[0].children[7].children[1].children[0].data],
        firstSeen: [$('.summary')[0].children[0].children[8].children[1].children[0].data],
        lastSeen: [$('.summary')[0].children[0].children[9].children[1].children[0].data]
    }

    let summaryJson = JSON.stringify(summary);

    return summaryJson;
}

function characterSummary($) {

    let characters = []

    if (!$('.table-responsive')[0]) { return; }

    $('.table-responsive')[0].children[1].children[1].children.forEach(child => {

        if (!child.children[9]) { return; }
        if (!child.children[9].children[0].attribs) { return; }
        let purgeJson = JSON.parse(JSON.stringify(child.children[9].children[0].attribs).split('-').join(""));
        
        let totalStats = purgeJson.datastats.split("[",)[1].split("]")[0].split(",")
        let bonusStats = purgeJson.databonuses.split("[")[1].split("]")[0].split(",")

        let Class = child.children[2].children[0].data;
        let classes = require("./classes.json");
        let classStats = classes[Class];

        let hp = totalStats[0] - classStats.hp - bonusStats[0];
        let mp = totalStats[1] - classStats.mp - bonusStats[1];
        let att = totalStats[2] - classStats.att - bonusStats[2];
        let def = totalStats[3] - classStats.def - bonusStats[3];
        let spd = totalStats[4] - classStats.spd - bonusStats[4];
        let vit = totalStats[5] - classStats.vit - bonusStats[5];
        let wis = totalStats[6] - classStats.wis - bonusStats[6];
        let dex = totalStats[7] - classStats.dex - bonusStats[7]; 

        let character = {
            class: [child.children[2].children[0].data],
            level: [child.children[3].children[0].data],
            cqc: [child.children[4].children[0].data],
            fame: [child.children[5].children[0].data],
            exp: [child.children[6].children[0].data],
            equipment: {
                weapon: [child.children[8].children[0].children[0].children[0].attribs.title],
                ability: [child.children[8].children[1].children[0].children[0].attribs.title],
                armor: [child.children[8].children[2].children[0].children[0].attribs.title],
                ring: [child.children[8].children[3].children[0].children[0].attribs.title]
            },
            totalStats: {
                hp: [totalStats[0]],
                mp: [totalStats[1]],
                att: [totalStats[2]],
                def: [totalStats[3]],
                spd: [totalStats[4]],
                vit: [totalStats[5]],
                wis: [totalStats[6]],
                dex: [totalStats[7]]
            },
            statBoost: {
                hp: [bonusStats[0]],
                mp: [bonusStats[1]],
                att: [bonusStats[2]],
                def: [bonusStats[3]],
                spd: [bonusStats[4]],
                vit: [bonusStats[5]],
                wis: [bonusStats[6]],
                dex: [bonusStats[7]]
            },
            stats: {
                hp: hp,
                mp: mp,
                att: att,
                def: def,
                spd: spd,
                vit: vit,
                wis: wis,
                dex: dex
            }
        }

        characters.push(character);

    })
    console.log(characters);
}