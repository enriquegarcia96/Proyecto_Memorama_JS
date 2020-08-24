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
        this.numeroIntentos = 0

        //* registros los elementos del HTML; con un signo de $
        this.$contedorGeneral  = document.querySelector('.contenedor-general')
        this.$contenedorTarjetas = document.querySelector('.contenedor-tarjetas')
        this.$pantallaBloqueada = document.querySelector('.pantalla-bloqueada')
        this.$mensaje = document.querySelector('h2.mensaje')//.mensaje es la classe de la etiqueta h2
        
        //* Llevar el conteo de todos los errores(mensaje)
        this.$errorContenedor = document.createElement('div')
        this.$nivelDificultad = document.createElement('div')


        //llamado a los eventos
        this.eventos()
    }

    //se encarga de cargar la pantalla este metodo 
    eventos(){
        addEventListener('DOMContentLoaded', () =>{
            this.seleccionDificultad()
            this.cargaPantalla() // llamo al metodo

            //evento para el bloqueo del click derecho
            // window.addEventListener('contextmenu', (e) =>{
            //     e.preventDefault()
            // }, false)//para tenga efecto en esta parte (false)
        })
    }

    //* Metodo para la seleccion de dificultad
    seleccionDificultad(){
        const mensaje = prompt('Seleccione el nivel de difilcultad: facil, intermedio o dificil, si no seleccionas ningun nivel  por defecto el nivel sera intermedio')

        if(!mensaje){
            this.numeroIntentos = 5
            this.nivelDificultad = 'Intermedio'
        }else{
            //cuando el usuario si seleccione el nivel
            if(mensaje.toLowerCase() === 'facil' || mensaje.toLowerCase() === 'fácil'){
                this.numeroIntentos = 7
                this.nivelDificultad = 'Fácil'
            }else if(mensaje.toLowerCase() === 'intermedio'){
                this.numeroIntentos = 5
                this.nivelDificultad = 'Intermedio'
            }else if(mensaje.toLowerCase() === 'dificil' || mensaje.toLowerCase() === 'difícil'){
                this.numeroIntentos = 3
                this.nivelDificultad = 'Difícil'
            }else{//si pone otro nivel de dificultad se pone intermedio
                this.numeroIntentos = 5
                this.nivelDificultad = 'Intermedio'
            }
        }
        
        //llamo al metodo; para que pueda tener el numero de errores o el nivel de dificultad
        this.contenedorError()

        this.mensajeIntentos()
        //console.log(this.numeroIntentos, this.nivelDificultad)
        
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
        // y tambien para saber si ya no queda ninguna tarjeta
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
                // console.log(e.target.classList)

                //mi DIV no contenga mi aclase acertada osea el if debe evaluar un false
                //! daba problemas que mostraba la lista DIV
                if(!e.target.classList.contains('acertada') && !e.target.classList.contains('tarjeta-img')){
                    
                    this.clickTarjeta(e)//le mando el evento (e) click al metodo Click tarjeta
                }
            })
        })
    }

    //* metodo, recibe el evento de comienzajuego
    clickTarjeta(e){

        //llamo el metodo 
        this.efectoVoltearTarjeta(e)

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

        //llamo al metodo
        this.comparadorTarjetas()
    }

    //para poder voltear la tarjeta 
    efectoVoltearTarjeta(e){
        e.target.style.backgroundImage = 'none'//le quite el color 
        e.target.style.backgroundColor = 'white'
        e.target.childNodes[1].style.display = 'block'//la pocision 1, le agrego un estilo
    }

    

    fijarParAcertado(arrTarjetasAcertadas){
        //itera el array recibido, de forma individual
        //y las coloco con una clase de css que las fija
        arrTarjetasAcertadas.forEach(tarjeta => {
            tarjeta.classList.add('acertada')//una clase de CSS 
            
            //llamo al arreglo y las agrego la tarjeta que esta correcta
            this.imagenesCorrectas.push(tarjeta)//la guardo en este arreglo

            this.victoriaJuego() //una vez que alla ganado el juego
        })
    }

    //este metodo me ayuda en darle vuelta a la tarjeta cuando le equivoca de tarjeta
    reversoTarjetas(arrTarjetasNoAcertadas){
        arrTarjetasNoAcertadas.forEach(tarjeta =>{
            setTimeout(() =>{

                //de vuelve la propiedad de la tarjeta asu estado normal
                tarjeta.style.backgroundImage = 'url(../img/cover.jpg)'//dirrecion de la imagen
                tarjeta.childNodes[1].style.display = 'none'//en su nodo hijo pocision 1 regrese a su estado normal
            },1000)//tarjetas que se regrese despues de 1 segundo(cuando se equivoca de tarjeta)
        })
    }

    //* metodo que me ayuda a comparar las tarjetas
    comparadorTarjetas(){

        // compara si el numero de elementos es igual a 2 tarjetas
        if(this.verificadorTarjetas.length == 2){
            
            //compara el par de tarjetas en el arreglo
            if(this.verificadorTarjetas[0] === this.verificadorTarjetas[1]){
                this.fijarParAcertado(this.agregadorTarjetas)//si co incide las tarjetas; mando el arreglo al metodo
            }else{
                //para darle de reverso a la tarjeta este metodo
                this.reversoTarjetas(this.agregadorTarjetas)//este agregadortarjetas tiene el DIV de cada tarjetas
                this.errores++
                this.incrementadorError()//llamo al metodo cuando nos equivoquemos de tarjetas
                this.derrotaJuego()// y este evento lo escuchara para actualizar
            }

            //* libero los arreglos para eliminar los elementos existentes
            this.verificadorTarjetas.splice(0)//cero porque libero los elementos existentes
            this.agregadorTarjetas.splice(0)
        }   
    }

    //* defino el metodo para verificar cuando se gane el juego
    victoriaJuego(){

        //para saber que ya no queda ninguna tarjeta que voltear
        if(this.imagenesCorrectas.length === this.numeroTarjetas){
            setTimeout(() =>{
                this.$pantallaBloqueada.style.display = 'block'
                this.$mensaje.innerText = '!Felicidades! Has ganado el juego'
            },1000)

            //cuando el jugador gane, la pantalla  vuelvan a su estado original
            setTimeout(() =>{
                location.reload()
            },5000)
        }

    }

    //* metodo derrota juego
    derrotaJuego(){
        if(this.errores === this.numeroIntentos){//comparo los intentos 

            setTimeout(() =>{
                //accedo al comportamiento para mostrar la pantalla bloqueada
                this.$pantallaBloqueada.style.display = 'block'
            },1000)
            
            //para una vez se  pierda el juego, la pantalla se vuelva a cargar
            setTimeout(() =>{
                location.reload()
            },4000)

        }
    }


    incrementadorError(){

        //este contenedor tiene el numero de errores conforme se equivoque en el juego
        this.$errorContenedor.innerText = `Errores: ${this.errores}`
    }

    
    contenedorError(){
        this.$errorContenedor.classList.add('error')//añado la clase error de CSS
        this.incrementadorError()
        this.$contedorGeneral.appendChild(this.$errorContenedor)//añado el errorcontenedor(fijo los errores)
    }
    
    mensajeIntentos(){
        this.$nivelDificultad.classList.add('nivel-dificultad')//CSS
        this.$nivelDificultad.innerHTML = `Nivel de difilcultad: ${this.nivelDificultad}`//añado el nivel
        this.$contedorGeneral.appendChild(this.$nivelDificultad)//lo meto al contenedor 
    }


}


new Memorama()