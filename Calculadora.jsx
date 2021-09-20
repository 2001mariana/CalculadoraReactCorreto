import React, { Component } from 'react'
import './Calculadora.css'

import Botao from '../components/Botoes'
import Display from '../components/Display'


//constante fora do objeto representando o estado inicial pois a função clearMemory for acionada, irá recuperar o estado inicial. 
const estadoInicial = {
    valorDisplay: '0',/*através do estado, o valor do display é dinamico. Aqui conterá extamente do value do display*/ 
    limparDisplay: false,
    operacao: null,
    values: [0,0],/*em momentos estarei digitando na posição 1 em em outros momentos na posição 0.
    Por exeplo, quando estou fazendo uma operação, o primeiro digito fica armazenado na posição 0 e quando digito
    a operação e em seguida o valor(isso que faz parte da operação) fica armazenado no segundo lugar do array */  
    current: 0
}

export default class Calculator extends Component {

    estado = { ...estadoInicial }//criando o estado (inicial)

    constructor(props) {
        super(props)
        this.clearMemory = this.clearMemory.bind(this)
        this.setOperacao = this.setOperacao.bind(this)
        this.addDigito = this.addDigito.bind(this)
    }

    clearMemory() {
        this.setState({ ...estadoInicial })//recuperando estado inicial
    }

    setOperacao(operacao) {
        //sofrerão alterações aqui:
        //current para 1(para que ao clicar em operação, o próximo valor digitado já esteja armazenado na posição 1 do array)
        //operacao deixará de ser null
        //limparDisplay passará a ser true para que após clicar em uma operação, ao clicar em um próximo numero a tela se limpe e mantenha apenas o novo valor digitado
        if ( this.estado.current === 0 ) {
            this.setState({ operacao: operacao, current: 1, limparDisplay: true })
        }else { //a partir daqui já estou trabalhando no segundo indice do array e preciso que, ao clicar em uma operação, processe o resultado e vá para o armazenamento do indice 0 para que o novo valor digitado fique no indice 1 e a nova conta possa ser feita.
            const equals = operacao === '='
            const operacaoCorrente = this.estado.operacao //se caiu aqui é pq já existe uma operação corrente e foi chamada uma nova operação, então preciso armazenar o operação que estava correndo ao invés de zerá-la e considerar apenas a última
            
            //clone de values:
            const values = [...this.estado.values]

            try{
                //abaixo: (o valor contido no indice 0 + (operação corrente) + o valor contido no indice 1)
                values[0] = eval(`${values[0]} ${operacaoCorrente} ${values[1]}`)
            } catch(e){
                values[0] = this.estado.values[0]//se der um erro eu pego o valor que está no estado
            }
            
            //esta expressão é processada pela função eval e seuresutado é armazenando no indice 0
            values[1] = 0 //tornando o indice 1 pronto para receber um novo valor 

            this.setState({
                valorDisplay: values[0],//estou mostrando o resultado da operação no display
                operacao: equals ? null : operacao, //verifiquei se a operação cliicada foi '=' (caso tenha sido, finaliza por aqui, portanto nada acontece) e se não foi igual, operacao é atualizado para a operação que tenha sido clicada
                current: equals ? 0 : 1, //se a operação clicada foi '=', o current vale 0 (isto é, o proximo valor digitado será armazenado na posição 0 do array) se for diferente de '=' o novo valor digitado será armazenado no indice 1 do array
                limparDisplay: !equals, //se a operação for diferente de '=' então a tela é limpa e fica pronta para continuar a receber valores para dar sequencia no cálculo, se o a operação digitada tiver sido '=' então a tela não é limpa
                values
            })
        }
    }

    addDigito(n) {

        if (n === '.' && this.estado.valorDisplay.includes('.')){
            return//verifica se a pessoa está tentando digitar . e no display já existe . Pois não existe numero com doispontos, neste caso, retorna nada
        }

        const limparDisplay = this.estado.valorDisplay === '0' || this.estado.limparDisplay === true
        //só será limpada a tela quando o display conter apenas um algarismo 0 (já que 0 a esquerda não faz sentido nem altera em nada) ou quando for verdadeiro, aí ele já é acionado.
        const currentValue = limparDisplay ? '' : this.estado.valorDisplay //se o valor corrente é vazio (quando o clear display é acionado) ou seja, current armazenará vazio. Se não, armazena o próprio digitado do display
        const valorDisplay = currentValue + n //armazena n (o que for digitado) +  current(valor corrente)
        //abaixo chamando setState e passando a constante valorDisplay que acabou de ser criada para alterar o estado do componente e já marcar limparDisplay como false
        this.setState({ valorDisplay, limparDisplay:false })

        //são considerados digito somente numeros e ponto. o if abaixo verifica se é numero e caso seja, armazenda dentro do array
        if(n != '.'){
            //i indica a posição do meu array que está sendo tratada se é 0 ou 1(isto é definido através do current)
            const i = this.estado.current //armazenei o verificador se estou mexendo na posição 0 ou 1 do meu array em uma constante 
            const newValue = parseFloat(valorDisplay)
            const values = [...this.estado.values]//estou clonando o meu array nesta constante values
            values[i] = newValue //se eu estiver mexendo no indice 0, este receberá o novo valor, se eu estiver no indice 1 o mesmo receberá novo valor
            this.setState({ values })
            console.log(values)
            //aqui foi definido: o que for digitado(numero) antes de qualquer operação é armazenado na posição 0 do array
        }
    }

    render(){
        
        return (
            <div className="calculator">
                <Display value={this.estado.valorDisplay} />
                <Botao label="AC" click={this.clearMemory} triple/>
                <Botao label="/" click={this.setOperacao} operacao/>
                <Botao label="7" click={this.addDigito} />
                <Botao label="8" click={this.addDigito} />
                <Botao label="9" click={this.addDigito} />
                <Botao label="*" click={this.setOperacao} operacao/>
                <Botao label="4" click={this.addDigito} />
                <Botao label="5" click={this.addDigito} />
                <Botao label="6" click={this.addDigito} />
                <Botao label="-" click={this.setOperacao} operacao/>
                <Botao label="1" click={this.addDigito} />
                <Botao label="2" click={this.addDigito} />
                <Botao label="3" click={this.addDigito} />
                <Botao label="+" click={this.setOperacao} operacao/>
                <Botao label="0" click={this.addDigito} double/>
                <Botao label="." click={this.addDigito} />
                <Botao label="=" click={this.setOperacao} operacao/>
            </div>
        )
    }
}
