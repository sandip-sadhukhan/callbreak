const allColors = ["♠️", "♥️", "♦️", "♣️"] as const;
const allNumbers = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q",
    "K", "A"] as const;

type cardColorType = typeof allColors[number];
type cardNumberType = typeof allNumbers[number];

class Card {
    color: cardColorType;
    number: cardNumberType;

    constructor(color: cardColorType, number: cardNumberType) {
        this.color = color;
        this.number = number;
    }
}

const generateAllCards = (): Card[] => {
    const availableCards: Card[] = [];

    allColors.forEach(color => {
        allNumbers.forEach(number => {
            const card = new Card(color, number);
            availableCards.push(card);
        })
    })

    return availableCards;
}

const shuffleCards = (allCards: Card[]) => {
    let currentIndex = allCards.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [allCards[currentIndex], allCards[randomIndex]] = [
            allCards[randomIndex], allCards[currentIndex]];
    }
}

class Player {
    name: string;
    isBot: boolean;
    cardsHave: Card[];
    cardOnBoard: Card | null;
    point: number;

    constructor(name: string, isBot: boolean) {
        this.name = name;
        this.isBot = isBot;
        this.cardsHave = [];
        this.cardOnBoard = null;
        this.point = 0;
    }

    giveInitCard(card: Card) {
        this.cardsHave.push(card);
    }
}

const distributeAllCards = function (allCards: Card[], allPlayers: Player[]): Card | null {
    let index = 0;
    let lastCard: Card | null = null;

    while (allCards.length !== 0) {
        const card = allCards.shift() as Card;

        allPlayers[index % 4].giveInitCard(card);

        index += 1;

        if (index === allCards.length) {
            lastCard = card;
        }
    }

    return lastCard;
}

export { allColors, allNumbers, Card, generateAllCards, shuffleCards, Player, distributeAllCards }

export type { cardColorType, cardNumberType }