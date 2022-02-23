let Keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

main_theme.volume = 0.1;
boss_theme.volume = 0.1;
slash.volume = 0.15;
get_hit.volume = 0.2;
npc_blood.volume = 0.2;
npc_bones.volume = 0.6;
exe_slash_audio.volume = 0.3;
exe_skill1_audio.volume = 0.1;
exe_skill2_audio.volume = 0.1;
let x1 = x2 = x3 = x4 = flag = gameOver = start = ready = score = scoreMulti = 0;
let y = 7, y2 = 6;
let cnv = document.querySelector("canvas");
let ctx = cnv.getContext("2d");
let bgWidth = cnv.getAttribute("width");
let bgHeight = cnv.getAttribute("height");
let heroImgSize = 64, heroAtkImgSize = 74;
let npcImgSize = 150;
let posY = bgHeight - heroImgSize - 150, posY2 = bgHeight - heroAtkImgSize - 150;
let posX = posX2 = 0;
let startPos1 = startPos2 = startPos3 = startPos4 = 0;
let time = time2 = timer = cTimer1 = cTimer2 = 0;
let state = "walk";
let npcs = [];
let vfxs = [];
let npcPic, npcType, npcPicAtk, npcPicDeath, npcPicSkill1, npcPicSkill1Vfx, npcPicSkill2, npcPicSkill2Vfx;
let vfxImgSizeX, vfxImgSizeY;
let rndTime = 5000;
let rWalk, rAtk, rDeath, rSkill1, rSkillVfx, rSkill2, rRange;
let ply = document.getElementById('main_theme');
let plyB = document.getElementById('boss_theme');
let lives = 5, bLives = 10;
let buildup = 1;

document.body.onload = function () {
    ctx.drawImage(spark_logo, 0, 0);
    setTimeout(() => {
        ready = 1;
        ply.play();
        ctx.drawImage(bgc, 0, 0);
        ctx.drawImage(start_screen, 0, 0, canvas.width, canvas.height);
    }, 3000);
}

function begin() {
    if (gameOver) {
        ply.pause();
        ctx.drawImage(game_over, bgWidth / 2 - 324 / 2, bgHeight / 2 - 324 / 2);
        return;
    }
    moveH();
    requestAnimationFrame(begin);
    let p = 0;
    let now = Date.now();
    if (now - time < 30) {
        return;
    }
    //pws 8a to kanw na mhn spawnarei otan to npc.dead == 1;
    if (now - timer > rndTime) {
        let boss1 = 10;
        if (npcs.length == boss1) {
            pickBoss(1);
            ply.pause();
            plyB.play();
            npcs.push(NPC());
            timer = now;
        }
        else if (npcs.length < boss1 || npcs.length > boss1 + 1) {
            pickNPC();
            npcs.push(NPC());
            timer = now;
        }
        else if (!npcs.at(-1).stateN.localeCompare(" ") && !npcs.at(-1).type.localeCompare("executioner")) {
            pickNPC();
            ply.currentTime = 0;
            ply.play();
            plyB.pause();
            npcs.push(NPC());
            timer = now;
        }
    }
    time = now;
    cnv.width += 0; // Clear canvas
    drawL1();
    drawL2();
    drawL3();
    while (p < npcs.length) {
        drawNPC(npcs[p]);
        detectCollision(npcs[p++]);
    }

    drawH();
    drawL4();
    drawScore();

    x1 = (x1 + 1) % 192;
    x2 = (x2 + 1) % 120;
    x3 = (x3 + 1) % 96;
    x4 = (x4 + 1) % 80;
}

function drawL1() { //zwgrafizei to 1o layer
    let startx = Math.round(startPos1);
    let clippedWidth = Math.min(bgWidth - startx, bgWidth);
    ctx.drawImage(bg, startx, 0, clippedWidth, bg.height, 0, 0, clippedWidth, bgHeight);

    if (clippedWidth < bgWidth) {
        // An den gemisei o kanvas
        var remaining = bgWidth - clippedWidth;
        ctx.drawImage(bg, 0, 0, remaining, bg.height,
            clippedWidth, 0, remaining, bgHeight);
    }
    // metakinhsh tou startPos1
    startPos1 = x1 * 5;
    startPos1 %= bg.width;
}

function drawL2() { //zwgrafizei to 2o layer
    let startx = Math.round(startPos2);
    let clippedWidth = Math.min(bgWidth - startx, bgWidth);
    ctx.drawImage(rocks, startx, 0, clippedWidth, bg.height, 0, 0, clippedWidth, bgHeight);

    if (clippedWidth < bgWidth) {
        // An den gemisei o kanvas
        var remaining = bgWidth - clippedWidth;
        ctx.drawImage(rocks, 0, 0, remaining, bg.height,
            clippedWidth, 0, remaining, bgHeight);
    }
    // metakinhsh tou startPos1
    startPos2 = x2 * 8;
    startPos2 %= bg.width;
}

function drawL3() { //zwgrafizei to 3o layer
    let startx = Math.round(startPos3);
    let clippedWidth = Math.min(bgWidth - startx, bgWidth);
    ctx.drawImage(ground, startx, 0, clippedWidth, bg.height, 0, 0, clippedWidth, bgHeight);

    if (clippedWidth < bgWidth) {
        // An den gemisei o kanvas
        var remaining = bgWidth - clippedWidth;
        ctx.drawImage(ground, 0, 0, remaining, bg.height,
            clippedWidth, 0, remaining, bgHeight);
    }
    // metakinhsh tou startPos3
    startPos3 = x3 * 10;
    startPos3 %= bg.width;
}

function drawL4() { //zwgrafizei to 4o layer
    let startx = Math.round(startPos4);
    let clippedWidth = Math.min(bgWidth - startx, bgWidth);
    ctx.drawImage(ground_front, startx, 0, clippedWidth, bg.height, 0, 0, clippedWidth, bgHeight);

    if (clippedWidth < bgWidth) {
        // An den gemisei o kanvas
        var remaining = bgWidth - clippedWidth;
        ctx.drawImage(ground_front, 0, 0, remaining, bg.height,
            clippedWidth, 0, remaining, bgHeight);
    }
    // metakinhsh tou startPos4
    startPos4 = x4 * 12;
    startPos4 %= bg.width;
}

function drawH() { //zwgrafizei ton hrwa
    if (!state.localeCompare("walk")) {
        ctx.drawImage(hero, y * heroImgSize, 0, heroImgSize, heroImgSize, posX, posY, heroImgSize * 2.5, heroImgSize * 2.5);
        y2 = 6;
        let now = Date.now();
        if (now - time2 < 150) {
            return;
        }
        --y == 0 ? y = 7 : y;
        time2 = now;
    }
    else {
        ctx.drawImage(hero_atk, y2 * heroAtkImgSize, 0, heroAtkImgSize, heroAtkImgSize, posX2, posY2, heroAtkImgSize * 2.5, heroAtkImgSize * 2.5);
        y = 7;
        let now = Date.now();
        if (now - time2 < 40) {
            return;
        }
        --y2 <= 0 ? state = "walk" : y2;
        time2 = now;
    }
}

function randomIntFromInterval(min, max) { //pairnei tuxaia enan int apo min ews max
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function pickNPC() { //dialegei tuxaia ex8ro
    rndTime = randomIntFromInterval(2500, 5000);
    let rnd = randomIntFromInterval(1, 4)
    npcImgSize = 150;
    if (rnd === 1) {
        npcType = "eye";
        npcPic = document.getElementById("eye");
        rWalk = 7;
        npcPicAtk = document.getElementById("eye_atk");
        rAtk = 7;
        npcPicDeath = document.getElementById("eye_death");
        rDeath = 3;
        scoreMulti = 1;
        rRange = 200;
    }
    else if (rnd === 2) {
        npcType = "goblin";
        npcPic = document.getElementById("goblin");
        rWalk = 7;
        npcPicAtk = document.getElementById("goblin_atk");
        rAtk = 7;
        npcPicDeath = document.getElementById("goblin_death");
        rDeath = 3;
        scoreMulti = 2;
        rRange = 200;
    }
    else if (rnd === 3) {
        npcType = "mushroom";
        npcPic = document.getElementById("mushroom");
        rWalk = 7;
        npcPicAtk = document.getElementById("mushroom_atk");
        rAtk = 7;
        npcPicDeath = document.getElementById("mushroom_death");
        rDeath = 3;
        scoreMulti = 2;
        rRange = 200;
    }
    else if (rnd === 4) {
        npcType = "skeleton";
        npcPic = document.getElementById("skeleton");
        rWalk = 3;
        npcPicAtk = document.getElementById("skeleton_atk");
        rAtk = 7;
        npcPicDeath = document.getElementById("skeleton_death");
        rDeath = 3;
        scoreMulti = 3;
        rRange = 200;
    }
}

function pickBoss(c) {
    if (c == 1) {
        npcImgSize = 300;
        npcType = "executioner";
        npcPic = document.getElementById("executioner");
        rWalk = 3;
        npcPicAtk = document.getElementById("executioner_atk");
        rAtk = 11;
        npcPicDeath = document.getElementById("executioner_death");
        rDeath = 9;
        npcPicSkill1 = document.getElementById("executioner_skill1");
        rSkill1 = 11;
        npcPicSkill1Vfx = document.getElementById("executioner_skill1_vfx");
        rSkillVfx = 9;
        scoreMulti = 50;
        rRange = 50;
        vfxImgSizeX = 80;
        vfxImgSizeY = 64;
        vfxs.push(VFX());
        vfxs[0].dmg = 1;

        npcPicSkill2 = document.getElementById("executioner_skill2");
        rSkill2 = 4;
        npcPicSkill2Vfx = document.getElementById("executioner_skill2_vfx");
        rSkillVfx = 15;
        vfxImgSizeX = 96;
        vfxImgSizeY = 128;
        vfxs.push(VFX());
    }
}

function NPC() {
    let type = npcType;
    let size = npcImgSize;
    let rnd = randomIntFromInterval(70, 130);
    let posXN = posXNB = bgWidth;
    let posYN = posYNB = bgHeight - npcImgSize - rnd;
    let stateN = "walk";
    let n = rWalk;
    let n2 = rAtk;
    let n3 = rDeath;
    let n4 = rSkill1;
    let n5 = rSkill2;
    let time = timeB = bp = dead = 0;
    let score = 100 * scoreMulti;
    let dmg = 0;
    let atkRange = rRange;
    let rndSkill = randomIntFromInterval(1, 2);
    return {
        posXN: posXN, posYN: posYN, posXNB: posXNB, posYNB: posYNB, stateN: stateN, n: n, n2: n2, n3: n3,
        n4: n4, n5: n5, time: time, timeB: timeB, bp: bp, type: type, score: score, size: size, dmg: dmg,
        dead: dead, atkRange: atkRange, rndSkill: rndSkill
    }
}

function VFX() {
    let maxN = rSkillVfx;
    let n = rSkillVfx;
    let sizeX = vfxImgSizeX;
    let sizeY = vfxImgSizeY;
    let posXV1 = 700;
    let posXV2 = posX;
    let posYV = posY;
    let timeA = 0;
    let dmg = 0;
    return { n: n, posXV1: posXV1, posXV2: posXV2, posYV: posYV, timeA: timeA, dmg: dmg, sizeX: sizeX, sizeY: sizeY, maxN: maxN }
}

function drawNPC(npc) { //zwgrafise ena npc(non playable character)
    let speed = 40;
    if (!npc.type.localeCompare("executioner") && npc.stateN.localeCompare("death") && npc.stateN.localeCompare("corpse") && npc.stateN.localeCompare(" ")) {
        npc.posYN = bgHeight - npc.size * 1.75;
        speed = 200;
        npc.n2 <= 0 ? npc.stateN = npc.n2 = rAtk : npc.n2;
        npc.stateN = pickAttack(npc);

    }
    if (npc.posXN + npc.size < 0) {
        npc.stateN = " ";
        npc.dead = 1;
    }
    if (!npc.stateN.localeCompare("walk")) {
        if (npc.type.localeCompare("executioner") && posX >= npc.posXN - 200 && posX < npc.posXN && (posY >= npc.posYN - 100 || posY <= npc.posYN + 100)) {
            npc.stateN = "atk";
        }
        ctx.drawImage(npcPic, npc.n * npc.size, 0, npc.size, npc.size, npc.posXN, npc.posYN, npc.size * 2, npc.size * 2);
        npc.n2 = rAtk;
        npc.n3 = rDeath;
        npc.n4 = rSkill1;
        npc.n5 = rSkill2;
        moveN(npc, 15, 0);
        moveB(npc, npc.posXN, npc.posYN);
        let now = Date.now();
        if (now - npc.time < 100) {
            return;
        }
        --npc.n <= 0 ? npc.n = rWalk : npc.n;
        npc.time = now;
    }
    else if (!npc.stateN.localeCompare("atk")) {
        ctx.drawImage(npcPicAtk, npc.n2 * npc.size, 0, npc.size, npc.size, npc.posXN, npc.posYN, npc.size * 2, npc.size * 2);
        npc.n = rWalk;
        npc.n3 = rDeath;
        npc.n4 = rSkill1;
        npc.n5 = rSkill2;
        moveN(npc, 15, 0);
        moveB(npc, npc.posXN, npc.posYN);
        let now = Date.now();
        if (now - npc.time < speed) {
            return;
        }
        --npc.n2;
        if (!npc.type.localeCompare("executioner")) {
            if (npc.n2 == 2) {
                npc.dmg = 1;
                exe_slash_audio.play();
            }
            else {
                npc.dmg = 0;
            }
        }
        else {
            if (npc.n2 <= 2) {
                npc.dmg = 1;
            }
            else {
                npc.dmg = 0;
            }
        }
        npc.n2 <= 0 ? npc.stateN = "walk" : npc.n2;
        npc.time = now;
    }
    else if (!npc.stateN.localeCompare("death")) {
        ctx.drawImage(npcPicDeath, npc.n3 * npc.size, 0, npc.size, npc.size, npc.posXN, npc.posYN, npc.size * 2, npc.size * 2);
        npc.type.localeCompare("skeleton") == 0 ? npc.type : drawBlood(npc);
        if (!npc.dead) {
            score += npc.score;
            npc.dead = 1;
        }
        npc.n = rWalk;
        npc.n2 = rAtk;
        npc.n4 = rSkill1;
        npc.n5 = rSkill2;
        moveN(npc, 15, 0);
        moveB(npc, npc.posXNB + 1, npc.posYN);
        let now = Date.now();
        if (now - npc.time < 150) {
            return;
        }
        --npc.n3 <= 0 ? npc.stateN = "corpse" : npc.n3;
        npc.time = now;
    }
    else if (!npc.stateN.localeCompare("skill1")) {
        let a = vfxs[0];
        ctx.drawImage(npcPicSkill1, npc.n4 * npc.size, 0, npc.size, npc.size, npc.posXN, npc.posYN, npc.size * 2, npc.size * 2);
        ctx.drawImage(npcPicSkill1Vfx, a.n * a.sizeX, 0, a.sizeX, a.sizeY, a.posXV1, a.posYV, a.sizeX * 2, a.sizeY * 2);
        npc.n = rWalk;
        npc.n2 = rAtk;
        npc.n3 = rDeath;
        npc.n5 = rSkill2;
        moveN(npc, 15, 0);
        moveB(npc, npc.posXN, npc.posYN);
        let now = Date.now();

        if (a.posXV1 <= 0 - a.sizeX * 2) {
            a.posXV1 = 700;
            a.posYV = posY;
            a.n = a.maxN;
            exe_skill1_audio.currentTime = 0;
            exe_skill1_audio.play();
            buildup = 1;
        }
        a.posXV1 -= 20 + buildup;
        if (now - npc.time < 110) {
            return;
        }
        --a.n <= 0 ? a.n = a.maxN : 0;
        --npc.n4 <= 0 ? npc.n4 = rSkill1 : 0;
        buildup++;
        npc.time = now;
    }
    else if (!npc.stateN.localeCompare("skill2")) {
        let a = vfxs[1];
        ctx.drawImage(npcPicSkill2, npc.n5 * npc.size, 0, npc.size, npc.size, npc.posXN, npc.posYN, npc.size * 2, npc.size * 2);
        ctx.drawImage(npcPicSkill2Vfx, a.n * a.sizeX, 0, a.sizeX, a.sizeY, a.posXV2, a.posYV, a.sizeX * 2, a.sizeY * 2);
        npc.n = rWalk;
        npc.n2 = rAtk;
        npc.n3 = rDeath;
        npc.n4 = rSkill1;
        moveN(npc, 30, 0);
        moveB(npc, npc.posXN, npc.posYN);
        let now = Date.now();
        if (now - npc.time < 120) {
            return;
        }
        if (--a.n <= 0) {
            a.posXV2 = posX;
            a.posYV = posY - 80;
            a.n = a.maxN;
            a.dmg = 0;
            exe_skill2_audio.currentTime = 0;
            exe_skill2_audio.play();
        }
        else if (--a.n < 2) {
            a.dmg = 1;
        }
        if (now - npc.time < 133) {
            return;
        }
        --npc.n5 <= 0 ? npc.n5 = rSkill2 : 0;

        npc.time = now;
    }
    else if (!npc.stateN.localeCompare("corpse")) {
        if (!npc.type.localeCompare("executioner")) {
            npc.stateN = " ";
            return;
        }
        ctx.drawImage(npcPicDeath, 0 * npc.size, 0, npc.size, npc.size, npc.posXN, npc.posYN, npc.size * 2, npc.size * 2);
        moveN(npc, 15, 0);
        moveB(npc, npc.posXNB + 1, npc.posYNB);
    }

}

function pickAttack(npc) { //dialekse epithesi
    let attack;
    if (npc.posXN > 530) {
        return "walk";
    }
    if (posX > 600) {
        attack = "atk";
        npc.rndSkill = randomIntFromInterval(1, 2);
    }
    else {
        if (npc.rndSkill == 1) {
            attack = "skill1";
        }
        else {
            attack = "skill2";
        }
    }

    return attack;
}

function moveN(npc, x, y) {
    if (!npc.type.localeCompare("executioner") && npc.posXN <= 530) {
        return;
    }
    npc.posXN -= x;
    npc.posYN += y;
}

function moveB(npc, x, y) {
    npc.posXNB = x;
    npc.posYNB = y;
}

function drawBlood(npc) { //zwgrafise aima otan varas kapoion
    let xSize = 119, ySize = 93;
    ctx.drawImage(slash_blood, npc.bp * xSize, 0, xSize, ySize, npc.posXNB + npc.size / 2, npc.posYNB + npc.size / 2, xSize * 1.5, ySize * 1.5);
    let now = Date.now();
    if (now - npc.timeB < 100) {
        return;
    }
    npc.bp++;
    npc.timeB = now;
}

function drawScore() {
    ctx.font = '24px DotGothic16';
    ctx.fillStyle = "#AC0000";
    ctx.fillText('SCORE:' + score, 10, 30);
}

function gotHit(z) {
    let now = Date.now();
    if (now - cTimer1 < z) {
        return;
    }
    cTimer1 = now;
    get_hit.currentTime = 0;
    get_hit.play();
    --lives == 0 ? gameOver = 1 : lives;
}

function detectCollision(a) { //anixneuei sugkrouseis
    if (!a.type.localeCompare("executioner")) {
        let i = vfxs[0];
        if (posX > 600 && !a.stateN.localeCompare("atk") && a.dmg) {
            gotHit(1500);
        }
        if (i.dmg && (posX + heroImgSize >= i.posXV1 && posX + heroImgSize <= i.posXV1 + i.sizeX) && (posY + heroImgSize / 2 >= i.posYV && posY + heroImgSize / 2 <= i.posYV + i.sizeY) && !a.stateN.localeCompare("skill1")) {
            gotHit(500);
        }
        i = vfxs[1];
        if (i.dmg && (posX + heroImgSize >= i.posXV2 && posX + heroImgSize <= i.posXV2 + i.sizeX) && (posY + heroImgSize / 2 >= i.posYV && posY + heroImgSize / 2 <= i.posYV + i.sizeY) && !a.stateN.localeCompare("skill2")) {
            gotHit(500);
        }
        if (posX > 700 && !state.localeCompare("atk")) {
            let now = Date.now();
            if (now - cTimer2 < 500) {
                return;
            }
            cTimer2 = now;
            npc_bones.currentTime = 0;
            npc_bones.play();
            --bLives <= 0 ? a.stateN = "death" : bLives;
        }
    }
    else {
        if (posX > a.posXN && posX < a.posXN + a.size / 2 && posY > a.posYN && posY < a.posYN + a.size / 2 && state.localeCompare("atk") && !a.stateN.localeCompare("atk") && a.dmg) {
            get_hit.currentTime = 0;
            get_hit.play();
            lives == 0 ? gameOver = 1 : lives--;
        }
        else if (posX > a.posXN && posX < a.posXN + a.size / 2 && posY > a.posYN && posY < a.posYN + a.size / 2 && !state.localeCompare("atk")) {
            a.stateN = "death";
            a.type == "skeleton" ? npc_bones.play() : npc_blood.play();
        }
    }


}

function moveH() { //kinhsh tou hrwa
    if (Keys.up && posY > bgHeight - heroImgSize - 180) {
        posY -= 3;
        posY2 -= 3;
    }

    if (Keys.down && posY < bgHeight - heroImgSize - 80) {
        posY += 3;
        posY2 += 3;
    }

    if (Keys.right && posX < bgWidth - heroImgSize - 80) {
        posX += 5;
        posX2 += 5;
    }

    if (Keys.left && posX > 0 + heroImgSize - 80) {
        posX -= 5;
        posX2 -= 5;
    }
}

document.body.onkeydown = function (evt) { //ta controls
    let kc = evt.keyCode;
    if (kc === 87 || kc === 38) { //otan pataei kapoios to w h to panw velaki
        Keys.up = true;
        evt.preventDefault();
    }
    if (kc === 83 || kc === 40) { //otan pataei kapoios to s h to katw velaki
        Keys.down = true;
        evt.preventDefault();
    }
    if (kc === 68 || kc === 39) { //otan pataei kapoios to deksi velaki h to d
        Keys.right = true;
        evt.preventDefault();
    }
    if (kc === 65 || kc === 37) { //otan pataei kapoios to aristero velaki h to a
        Keys.left = true;
        evt.preventDefault();
    }
    if (evt.key === " " && !state.localeCompare("walk")) { //otan pataei kapoios to space
        state = "atk";
        slash.currentTime = 0;
        slash.play();
        evt.preventDefault();
    }
}
document.body.onkeyup = function (evt) {
    let kc = evt.keyCode;
    if (kc === 87 || kc === 38) {
        Keys.up = false;
        evt.preventDefault();
    }
    if (kc === 83 || kc === 40) {
        Keys.down = false;
        evt.preventDefault();
    }
    if (kc === 68 || kc === 39) {
        Keys.right = false;
        evt.preventDefault();
    }
    if (kc === 65 || kc === 37) {
        Keys.left = false;
        evt.preventDefault();
    }
}

canvas.addEventListener('click', function () {
    if (!start && ready)
        begin();
}, false);
