import React from 'react';
import './Botoes.css';

export default (props) => {

    let classes = 'botao '
    classes += props.operacao ? 'operacao' : ''
    classes += props.double ? 'double' : ''
    classes += props.triple ? 'triple' : ''
    classes += props.round ? 'round' : ''
    classes += props.total ? 'total' : ''

    return(
        <button 
        onClick={ e => props.click && props.click(e.target.innerHTML)}
        className={classes}>
        {props.label}
        </button>
    )

}

