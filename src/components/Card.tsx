import { Card } from '../helpers'

interface Props {
    card: Card
}

const CardComponent = ({ card }: Props) => {
    return (
        <div
            className='card px-3 py-2 d-flex justify-content-center align-items-center flex-column shadow-xl'
            style={{ width: "60px", cursor: "pointer" }}>
            <span
                className={`fs-2 ${["♥️", "♦️"].includes(card.color) && 'text-danger'}`}>
                {card.color}
            </span>
            <span className='fs-6 fw-bold'>{card.number}</span>
        </div>
    )
}

export default CardComponent