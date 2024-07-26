export const allColors = ["♠️", "♥️", "♦️", "♣️"] as const;
export const allNumbers = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q",
    "K", "A"] as const;

export type cardColorType = typeof allColors[number];
export type cardNumberType = typeof allNumbers[number];


export interface ICard {
    color: cardColorType;
    number: cardNumberType;
    key: string;
    numberValue: number;
}

export interface IPlayer {
    id: number;
    name: string;
    isBot: boolean;
    position: string;
    cardsHave: ICard[];
    cardOnBoard: ICard | null;
    points: number;
}
