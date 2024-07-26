import { ICard } from "../types";

interface Props {
    card: ICard;
    disabled?: boolean;
    onClick?: (card: ICard) => void
}
const CardComponent = ({ card, disabled = false, onClick }: Props) => {
    return (
        <div className={`card ${disabled && 'disabled'}`} onClick={() => !disabled && onClick ? onClick(card) : false}>
            <div className="card-body d-flex justify-content-center align-items-center flex-column">
                <span
                    className={`fs-2 ${["♥️", "♦️"].includes(card.color) && 'text-danger'}`}>
                    {card.color}
                </span>
                <span className='fs-6 fw-bold'>{card.number}</span>
            </div>
        </div>
    )
}

export default CardComponent