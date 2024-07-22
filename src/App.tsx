
import { Card, Player, distributeAllCards, generateAllCards, shuffleCards } from './helpers'
import 'bootstrap/dist/css/bootstrap.min.css';
import CardComponent from './components/Card';



function App() {
  let allCards = generateAllCards();

  shuffleCards(allCards);

  // 4 players, 3 bot 1 human
  const human = new Player("Sandip", false);
  const bots = [new Player("Bot 1", true), new Player("Bot 2", true), new Player("Bot 3", true)]
  const allPlayers = [human, ...bots];

  let lastCard = distributeAllCards(allCards, allPlayers) as Card;
  console.log(lastCard.color, lastCard.number)

  return (
    <main>
      <div className="row position-relative">
        <div className="col-md-4 mx-auto  my-md-5">
          <div className='d-flex gap-2 flex-wrap py-3'>
            {human.cardsHave.map(card =>
              (<CardComponent key={`${card.color}-${card.number}`} card={card} />)
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
