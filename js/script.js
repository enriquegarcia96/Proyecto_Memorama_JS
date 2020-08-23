//creo la clase 
class Memorama{

    constructor(){
        //todos los valores del juego comienzan desde 0
        this.totalTarjetas = []
        this.numeroTarjetas = 0
        this.verificadorTarjetas = []
        this.errores = 0//contador de errores
        this.nivelDificultad = ''
        this.imagenesCorrectas = []
        //uso arreglos para poder manipular la informacion
        this.agregadorTarjetas = []

        //* registros los elementos del HTML; con un signo de $
        this.$contedorGeneral  = document.querySelector('.contenedor-general')
        this.$contenedorTarjetas = document.querySelector('.contenedor-tarjetas')
        this.$pantallaBloqueada = document.querySelector('.pantalla-bloqueada')
        this.$mensaje = document.querySelector('h2.mensaje')//.mensaje es la classe de la etiqueta h2
        
        //llamado a los eventos
        this.eventos()
    }

    //se encarga de cargar la pantalla este metodo 
    eventos(){
        addEventListener('DOMContentLoaded', () =>{
            this.cargaPantalla() // llamo al metodo
        })
    }

    // metodo para mostrar las tarjetas en la pantalla
    //* lo hago con las funciones async/await para no ocurrir las promesas con .then()
    async cargaPantalla(){
        //llamo a mi archivo JSON
        const respuesta = await fetch('../memo.json')
        const data = await respuesta.json()//me trae los datos en formato JSON
        this.totalTarjetas = data  //selo asigno ala propiedad en el constructor
        
        //para poder mostrar las tarjetas en el navegador
        if(this.totalTarjetas.length > 0){
            
            //funcion que permite que las tarjetas se ordene en forma aleatoria
            const ordenFuntion = (a,b) =>{
                return Math.random() - 0.5 
            }
            
            this.totalTarjetas.sort(ordenFuntion)//llamano ala funtion
        }
        //console.log(this.totalTarjetas)
        //console.log(data)
        //console.log(respuesta.json())

        //* mostrando las cartas en pantalla
        this.numeroTarjetas = this.totalTarjetas.length //me permite saber cuantas tarjetas estoy contando 

        let html =  ''
        this.totalTarjetas.forEach(card =>{//recorre el arreglo y tener las tarjetas de forma individual
            html  +=  `<div class="tarjeta">
                        <img class="tarjeta-img" src=${card.src} alt="imagen memorama"  >
                    </div>
            `//acumula las tarjetas que aparecen (src => lo saco de la propieda src en .JSON)
        })
        this.$contenedorTarjetas.innerHTML = html//le asigno el html que cree 
        this.comienzaJuego()//llamo al metodo porque cuando ya esten cargadas las tarjetas puedo tener acceso al queryslectall
    }

    //* metodo para detectar click en la tarjeta
    comienzaJuego(){
        const tarjetas = document.querySelectorAll('.tarjeta')//seleciono todas las  tarjetas de la variable => html
        tarjetas.forEach(tarjeta => {
            //para que se muestre el lado inverso y se comience a comparar los pares
            tarjeta.addEventListener('click', (e) =>{
                this.clickTarjeta(e)//le mando el evento (e) click al metodo Click tarjeta
            })
        })
    }

    //* metodo, recibe el evento de comienzajuego
    clickTarjeta(e){
        //para saber cual imagen le di click 
        let sourceImage = e.target.childNodes[1].attributes[1].value //para saber el src que imagen le dimos click(nombre de la imagen)
        
        //va a ir conteniendo las imagenes al arreglo, le anexo la tarjeta atraves de la variable
        this.verificadorTarjetas.push(sourceImage)//voy a tener acceso al nombre de la imagen

        //conozco la tarjeta
        let tarjeta = e.target
        console.log(tarjeta)//se imprime todo el elemento DIV

        //este arreglo que me lleva el conteo de las tarjetas acertadas, le añado las tarjetas
        this.agregadorTarjetas.unshift(tarjeta)//tengo acceso al todo el DIV de la tarjeta

        console.log(sourceImage)//miro el nombre de la img
        //console.log(e)//imprimo el click
    }

    //* metodo que me ayuda a comparar las tarjetas
    comparadorTarjetas(){

    }


}

new Memorama()