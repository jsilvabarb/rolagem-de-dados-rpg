
//Declaração das Variáveis Globais
var aux = 0;
var contHist = 0;
var resultado = -1;
var mesa = new Mesa();
var intervalo = 3000;

//Objetos
function Mesa() {
    //Atributos
    this.dadoEscolhido = -1;        
    this.dados = [];
    this.jogada = 0;
    this.jogadas = [];
    
    this.escolheDado = function(idDado) {
        
        if (this.dadoEscolhido < 0 || this.dadoEscolhido == idDado) {
            this.dadoEscolhido = idDado
            this.dados[idDado].addDado();
        } else {
            alert("Nao pode escolher outro dado a nao ser de: " + this.dados[this.dadoEscolhido].getLados());
        }
    }
    this.sorteio = function() {
        var cont = 0;
        var valor = 0; 

        resultado = 0;    

        while(cont < this.dados[this.dadoEscolhido].qtd) {
            valor = this.dados[this.dadoEscolhido].lancar();
            resultado = resultado + valor;    

            cont++;         
        }
        this.showResultado();   
        
        var idLoader = document.getElementById("load"+aux);           

        setTimeout(function(){ idLoader.style.display= "none"; }, intervalo);

        setTimeout(function(){  document.getElementById("resultado").innerHTML = resultado; }, intervalo);

        //document.getElementById("resultado").innerHTML = resultado; 

        
        this.jogadas[this.jogadas.length] = new Jogada (resultado, this.jogada); 
        this.jogada++;
        aux++;

        this.geraHistorico();

        this.continuar(); 
        
        return resultado;
    }
    this.createModal = function () {
        var auxModal = document.createElement("div");
        auxModal.setAttribute("id", "modal");
        auxModal.innerHTML = "Vamos lá!" + 
                            "<br> O limite máx de dados é 10!<br><br>";
        document.getElementById("body").appendChild(auxModal);

        var btnLancarDado = document.createElement("button");
        btnLancarDado.setAttribute("id", "btnLancarDado");
        btnLancarDado.setAttribute("onclick", "mesa.sorteio()");
        btnLancarDado.innerHTML = "LANÇAR!!!";
        document.getElementById("modal").appendChild(btnLancarDado);           
    }
    this.showModal = function () {
        var elModal = document.getElementById("modal");
        elModal.style.display = "block";
        
    } 
    this.hiddenModal = function () {
        return document.getElementById("modal").style.display = "none";
    }
    this.showResultado = function () {

        var elRolagem = document.createElement("img");
        elRolagem.setAttribute("id", "load"+aux);
        elRolagem.setAttribute("class", "loader");
        elRolagem.src ="img/rolagem.gif";
        elRolagem.style.zIndex ="99999";
        elRolagem.style.marginLeft = "-100px";
        elRolagem.style.marginTop = "-100px";
        document.getElementById("modal").appendChild(elRolagem);

        var elResultado = document.createElement("p");
        elResultado.setAttribute("id", "resultado");
        document.getElementById("modal").appendChild(elResultado);
    }
    this.contador = function () {
        var elContador = document.createElement("div");
        elContador.setAttribute("id", "cont");
        document.getElementById("body").appendChild(elContador);

    }       
    this.populaDados = function() {
        var lado = 2;
        var aux = 0;
        
        var auxMesa = document.createElement("div");
        auxMesa.setAttribute("id", "mesa");
        document.body.appendChild(auxMesa);

        while(lado < 20){
            
            if(lado == 12) {
                lado = lado + 8;
            }else { 
                lado = lado + 2;
            }

            this.dados[this.dados.length] = new Dado(lado);               
                
            var elementoDiv = document.createElement("div");
            elementoDiv.setAttribute("id", "d"+aux);   // d4 d6 d8.addDado d10 d12 d20  dados[0].lados;
            elementoDiv.setAttribute("onclick", "mesa.escolheDado("+aux+");" ); 
            
            elementoDiv.style.margin = "10px";
            elementoDiv.style.backgroundRepeat = "no-repeat";
            elementoDiv.style.width ="250px";
            elementoDiv.style.height = "150px";
            elementoDiv.style.backgroundColor = "none";        
            elementoDiv.style.backgroundImage =  this.dados[aux].getImgUrl();

            elMesa = document.getElementById("mesa");
            elMesa.appendChild(elementoDiv);  
            aux++;          
        }    
    }
    this.zeraMesa = function () {
        this.dados[this.dadoEscolhido].qtd = 0;
        this.dadoEscolhido = -1;           
        aux++;
        this.jogada++;
    }       
    this.continuar = function() {
        var elContinue = document.getElementById("continua");
        elContinue.style.display = "block";
        elContinue.setAttribute("onclick", "mesa.hiddenModal(), mesa.zeraMesa();");

        var auxHistorico = document.getElementById("btnHistorico");
        auxHistorico.style.display = "block";
        auxHistorico.setAttribute("onclick", "mesa.showHistorico();");
    }
    this.geraHistorico = function () {
        
        var elCorpoHistorico = document.createElement("p");
        elCorpoHistorico.setAttribute("class", "hist");       
    
        elCorpoHistorico.innerHTML = "Jogada: " +this.jogadas[contHist].contJogada +  "<br>" +
                                "Resultado: " +this.jogadas[contHist].resultado;
    
        document.getElementById("historico").appendChild(elCorpoHistorico);

        contHist++;            
    }
    this.showHistorico = function () {
        document.getElementById("historico").style.display = "block";
    } 
    this.hiddenHistorico = function () {
        document.getElementById("historico").style.display = "none";
    } 
}

function Dado (lado) {
    //Atributos
    this.lado = lado; 
    this.qtd = 0;       // Controla a quantidade de dados solicitados

    this.getLados = function() {
        return this.lado + " faces";
    }
    this.addDado = function() {
        // Regra de negócio qtd máx de dados
        if (this.qtd == 0) {               
            if(mesa.jogada == 0) {
                mesa.createModal();
                mesa.showModal();       //exibindo Modal 
            } else {                    
                mesa.showModal();
            }               
        } if(this.qtd < 10 ) {               
            this.qtd++;
            document.getElementById("cont").innerHTML = "DADOS:" + this.qtd;
        } else {
            alert("Você atingiu o limite máx de dados!");
        }            
    }
    this.lancar = function() {           
        
        return Math.floor(Math.random() * this.lado + 1);
    }
    this.getImgUrl = function() {
        return "url(img/d" + this.lado + ".PNG)";
    }
}

function Jogada (resultado, contJogada) {
    this.resultado = resultado;
    this.contJogada = contJogada;       
}

//Métodos  
function escolherTema () {
    
    var el = document.getElementById("temas");
    el.addEventListener('click' , function(e) {
        if(e.target.id == "tema6") {
        document.getElementById("body").style.backgroundImage = "url(img/padrao.jpg)";
        } 
        else if(e.target.id == "tema5") {
        document.getElementById("body").style.backgroundImage = "url(img/piratas.jpg)";
        } 
        else if (e.target.id == "tema4") {
        document.getElementById("body").style.backgroundImage = "url(img/magia.jpg)";
        }
        else if (e.target.id == "tema3") {
        document.getElementById("body").style.backgroundImage = "url(img/vampiros.jpg)";
        }
        else if (e.target.id == "tema2") {
        document.getElementById("body").style.backgroundImage = "url(img/anime.png)";
        }
        else if (e.target.id == "tema1") {
        document.getElementById("body").style.backgroundImage = "url(img/medieval.jpg)";
        }
    })   
}    

function start() {
    document.getElementById("intro").style.display = "none";
    
    mesa.populaDados();
    mesa.contador();
}       
        
