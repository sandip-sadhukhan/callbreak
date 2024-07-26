
// import { Board, Card, Player, distributeAllCards, generateAllCards, shuffleCards } from './helpers'
import 'bootstrap/dist/css/bootstrap.min.css';
import CardComponent from './components/Card';
import { useEffect, useState } from 'react';
import { ICard, IPlayer, allColors, allNumbers, cardColorType } from './types';


function App() {
  const availableCards: ICard[] = [];

  const calculateCardNumber = (cardNumber: string): number => {

    if (!isNaN(cardNumber as any)) {
      return parseInt(cardNumber);
    } else {
      const costMap = {
        J: 11,
        Q: 12,
        K: 13,
        A: 14
      }
      return costMap[cardNumber] as any as number;
    }
  }

  allColors.forEach(color => {
    allNumbers.forEach(number => {
      const card: ICard = { color, number, key: `${color}-${number}`, numberValue: calculateCardNumber(number) }
      availableCards.push(card);
    })
  })

  // shuffle
  let currentIndex = availableCards.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [availableCards[currentIndex], availableCards[randomIndex]] = [
      availableCards[randomIndex], availableCards[currentIndex]];
  }


  const availablePlayers: IPlayer[] = [
    {
      id: 1,
      name: "You",
      isBot: false,
      position: "bottom",
      cardsHave: [],
      cardOnBoard: null,
      points: 0
    },
    {
      id: 2,
      name: "Bot 1",
      isBot: true,
      position: "left",
      cardsHave: [],
      cardOnBoard: null,
      points: 0
    },
    {
      id: 3,
      name: "Bot 2",
      isBot: true,
      position: "top",
      cardsHave: [],
      cardOnBoard: null,
      points: 0
    },
    {
      id: 4,
      name: "Bot 3",
      isBot: true,
      position: "right",
      cardsHave: [],
      cardOnBoard: null,
      points: 0
    },
  ]

  // Distribute all cards
  let index = 0;
  let lastCard: ICard | null = null;

  while (true) {
    const card = availableCards.shift() as ICard;

    availablePlayers[index % 4].cardsHave.push(card);

    index += 1;

    if (availableCards.length === 0) {
      lastCard = card
      break;
    }
  }

  const [allPlayers, setAllPlayers] = useState<IPlayer[]>(availablePlayers);
  const human = allPlayers.find(player => !player.isBot) as IPlayer;

  const [colorCard, setColorCard] = useState<ICard>(lastCard);
  const [playerIdTurn, setPlayerIdTurn] = useState<number>(1); // human first
  const [loading, setLoading] = useState<boolean>(false); // calculating


  const putCardOnBoard = (player_id: number, card: ICard) => {
    let newAllPlayers = [...allPlayers];

    newAllPlayers = newAllPlayers.map((player) => {
      if (player.id === player_id) {
        player.cardOnBoard = card;
        player.cardsHave = player.cardsHave
          .filter(_card => _card.key !== card.key);
      }

      return player;
    })

    setAllPlayers(newAllPlayers);
  }

  const botChooseCard = (player_id: number): ICard => {
    const bot = allPlayers.find(player => player.id === player_id) as IPlayer;
    const card = bot.cardsHave[0] as ICard;
    return card;
  }

  const botPlay = async (player_id: number): Promise<void> => {
    return new Promise<void>((res) => {
      setTimeout(() => {
        const chosenCard = botChooseCard(player_id);
        putCardOnBoard(player_id, chosenCard)
        res();
      }, 1000)
    })
  }

  const findCardValue = (card: ICard, firstColor: cardColorType): number => {
    let value = 0;

    if (card.color === firstColor || card.color === colorCard.color) {
      value = card.numberValue;
    }

    if (card.color === colorCard.color) {
      value += 14;
    }

    return value;
  }

  const calculateWinner = (players: IPlayer[]): Promise<IPlayer> => {
    return new Promise<IPlayer>((res) => {
      const firstColor = (players[0].cardOnBoard as ICard).color;

      let maxPlayer = players[0];
      let maxCardCost = findCardValue(maxPlayer.cardOnBoard as ICard, firstColor);

      players.forEach(player => {
        let cardCost = findCardValue(player.cardOnBoard as ICard, firstColor);

        if (maxCardCost < cardCost) {
          maxCardCost = cardCost;
          maxPlayer = player;
        }
      })

      setTimeout(function () {
        res(maxPlayer);
      }, 1500)
    })
  }

  const nextTurnPlay = async function () {
    let nextPlayerId = playerIdTurn + 1;

    if (nextPlayerId > 4) {
      nextPlayerId = 1;
    }

    console.log("nextTurnPlay", playerIdTurn)

    // check if board has all 4 cards or not
    if (allPlayers.findIndex(player => !player.cardOnBoard) === -1) {
      setLoading(true)

      let firstPlayer = allPlayers.find(_player => _player.id === nextPlayerId) as IPlayer;

      nextPlayerId += 1;

      if (nextPlayerId > 4) {
        nextPlayerId = 1;
      }

      let secondPlayer = allPlayers.find(_player => _player.id === nextPlayerId) as IPlayer;

      nextPlayerId += 1;

      if (nextPlayerId > 4) {
        nextPlayerId = 1;
      }

      let thirdPlayer = allPlayers.find(_player => _player.id === nextPlayerId) as IPlayer;

      nextPlayerId += 1;

      if (nextPlayerId > 4) {
        nextPlayerId = 1;
      }

      let forthPlayer = allPlayers.find(_player => _player.id === nextPlayerId) as IPlayer;

      let winner = await calculateWinner([firstPlayer, secondPlayer, thirdPlayer, forthPlayer]);

      // clear board and set turn to winner and add point
      let newAllPlayers = [...allPlayers];

      newAllPlayers = newAllPlayers.map(_player => {
        if (_player.id === winner.id) {
          _player.points += 1;
        }
        _player.cardOnBoard = null;

        return _player;
      })

      setAllPlayers(newAllPlayers);

      setLoading(false);
      nextPlayerId = winner.id;
    }

    setPlayerIdTurn(nextPlayerId);
  }

  const playerTurn = async function (playerIdTurn: number) {
    console.log("next player turn", playerIdTurn);

    if (playerIdTurn !== 1) {
      await botPlay(playerIdTurn);
      nextTurnPlay();
    }

  }

  useEffect(() => {
    playerTurn(playerIdTurn)
  }, [playerIdTurn]);


  const humanChoosedCard = async (card: ICard) => {
    putCardOnBoard(1, card)
    nextTurnPlay();
    // Calculate who win

    // add point then remove cards from board


    // Then winner's turn
  }


  return (
    <main>
      <div className="container-fluid">

        <div className="row">
          <div className="col-xl-5 col-md-8 mx-auto bg-light position-relative">
            {
              allPlayers.map(bot => (
                <div key={bot.name} className={`player player-${bot.position}`}>
                  {bot.name} ({bot.points})
                </div>
              ))
            }

            <div className="board">
              {allPlayers.map(player => (
                <div key={player.position} className={`middle-cards card-${player.position}`}>
                  {
                    player.cardOnBoard ? (
                      <CardComponent card={player.cardOnBoard} disabled />
                    ) : null
                  }
                </div>
              ))}
            </div>

            <div className='human-cards d-flex gap-2 flex-wrap'>
              {human.cardsHave.map(card =>
                (<CardComponent key={card.key} card={card} disabled={loading || playerIdTurn !== 1} onClick={humanChoosedCard} />)
              )}
            </div>

            {/* Color card */}
            {
              colorCard ? (
                <div className="last-card d-flex justify-content-end">
                  <h6>Color:
                    <span className={`${["♥️", "♦️"].includes(colorCard.color) && 'text-danger'}`}>
                      {colorCard.color}
                    </span>
                  </h6>
                </div>

              ) : null
            }
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
