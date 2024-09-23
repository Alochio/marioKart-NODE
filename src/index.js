const readline = require('readline-sync');

const players = [
    {
        NOME: "Mario",
        VELOCIDADE: 4,
        MANOBRABILIDADE: 3,
        PODER: 3,
        PONTOS: 0
    },
    {
        NOME: "Bowser",
        VELOCIDADE: 5,
        MANOBRABILIDADE: 2,
        PODER: 5,
        PONTOS: 0
    },
    {
        NOME: "Peach",
        VELOCIDADE: 3,
        MANOBRABILIDADE: 4,
        PODER: 2,
        PONTOS: 0
    },
    {
        NOME: "Yoshi",
        VELOCIDADE: 2,
        MANOBRABILIDADE: 4,
        PODER: 3,
        PONTOS: 0
    },
    {
        NOME: "Luigi",
        VELOCIDADE: 3,
        MANOBRABILIDADE: 4,
        PODER: 4,
        PONTOS: 0
    },
    {
        NOME: "Donkey Kong",
        VELOCIDADE: 2,
        MANOBRABILIDADE: 2,
        PODER: 5,
        PONTOS: 0
    }
];

function selectCharacter(isRival = false) {
    const role = isRival ? "rival" : "personagem";
    console.log(`Escolha seu ${role}:`);
    players.forEach((player, index) => {
        console.log(`${index + 1}: ${player.NOME}`);
    });

    const playerNumber = readline.questionInt(`Selecione o numero do seu ${role} (1-6): `);
    const selectedIndex = playerNumber - 1;

    if (selectedIndex < 0 || selectedIndex >= players.length) {
        console.log("Escolha um numero válido entre 1 e 6.");
        return null;
    }
    return players[selectedIndex];
}

async function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
    let random = Math.random();
    if (random < 0.33) return "RETA";
    if (random < 0.66) return "CURVA";
    return "CONFRONTO";
}

async function logRollResult(characterName, block, diceResult, attribute) {
    console.log(`${characterName} 🎲 rolou o dado de ${block}: ${diceResult} + ${attribute} = ${diceResult + attribute}`);
}

async function playRaceEngine(character1, character2) {
    for (let round = 1; round <= 5; round++) {
        console.log(`🏁 Rodada ${round}`);

        let block = await getRandomBlock();
        console.log(`Bloco: ${block}`);

        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        let totalTestSkill1 = 0;
        let totalTestSkill2 = 0;

        if (block === "RETA") {
            totalTestSkill1 = diceResult1 + character1.VELOCIDADE;
            totalTestSkill2 = diceResult2 + character2.VELOCIDADE;

            await logRollResult(character1.NOME, "velocidade", diceResult1, character1.VELOCIDADE);
            await logRollResult(character2.NOME, "velocidade", diceResult2, character2.VELOCIDADE);

            if (totalTestSkill1 > totalTestSkill2) {
                console.log(`${character1.NOME} marcou um ponto!`);
                character1.PONTOS++;
            } else if (totalTestSkill2 > totalTestSkill1) {
                console.log(`${character2.NOME} marcou um ponto!`);
                character2.PONTOS++;
            } else {
                console.log(`${character1.NOME} e ${character2.NOME} empataram!! ⚔️`);
            }
        }

        if (block === "CURVA") {
            totalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE;
            totalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE;

            await logRollResult(character1.NOME, "manobrabilidade", diceResult1, character1.MANOBRABILIDADE);
            await logRollResult(character2.NOME, "manobrabilidade", diceResult2, character2.MANOBRABILIDADE);

            if (totalTestSkill1 > totalTestSkill2) {
                console.log(`${character1.NOME} marcou um ponto!`);
                character1.PONTOS++;
            } else if (totalTestSkill2 > totalTestSkill1) {
                console.log(`${character2.NOME} marcou um ponto!`);
                character2.PONTOS++;
            } else {
                console.log(`${character1.NOME} e ${character2.NOME} empataram!! ⚔️`);
            }
        }

        if (block === "CONFRONTO") {
            let powerResult1 = diceResult1 + character1.PODER;
            let powerResult2 = diceResult2 + character2.PODER;

            console.log(`${character1.NOME} confrontou ${character2.NOME}! 🥊`);
            await logRollResult(character1.NOME, "poder", diceResult1, character1.PODER);
            await logRollResult(character2.NOME, "poder", diceResult2, character2.PODER);

            if (powerResult1 > powerResult2 && character2.PONTOS > 0) {
                console.log(`🏆 ${character1.NOME} venceu o confronto!\n🐢 ${character2.NOME} perdeu 1 ponto!`);
                character2.PONTOS--;
            } else if (powerResult2 > powerResult1 && character1.PONTOS > 0) {
                console.log(`🏆 ${character2.NOME} venceu o confronto!\n🐢 ${character1.NOME} perdeu 1 ponto!`);
                character1.PONTOS--;
            }

            if (powerResult1 === powerResult2) {
                console.log(`${character1.NOME} e ${character2.NOME} empataram! ⚔️`);
            }
        }

        console.log("______________________________________________________________________");
    }
}

async function declareWinner(character1, character2) {
    console.log("Resultado Final:");
    console.log(`${character1.NOME}: ${character1.PONTOS} ponto(s).`);
    console.log(`${character2.NOME}: ${character2.PONTOS} ponto(s).`);

    if (character1.PONTOS > character2.PONTOS) {
        console.log(`\n${character1.NOME} venceu a corrida! Parabéns! 🥇`);
    } else if (character2.PONTOS > character1.PONTOS) {
        console.log(`\n${character2.NOME} venceu a corrida! Parabéns! 🥇`);
    } else {
        console.log(`\nAmbos possuem ${character1.PONTOS}, os jogadores empataram!`);
    }
}

(async function main() {
    const player1 = selectCharacter();
    if (!player1) return; // Se o jogador 1 não for válido, sai da função.

    let player2;
    do {
        player2 = selectCharacter(true); // Seleciona o rival
        if (player1.NOME === player2.NOME) {
            console.log("Escolha um personagem diferente para o adversário.");
        }
    } while (player1.NOME === player2.NOME);

    console.log(`\n\n🏁🚨 Corrida entre o ${player1.NOME} e o ${player2.NOME}...\n`);

    await playRaceEngine(player1, player2);
    await declareWinner(player1, player2);
})();
