angular.module('myApp', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'paginas/home.html',
                controller: 'homeController'
            })
            .when('/emails', {
                templateUrl: 'paginas/emails.html',
                controller: 'emailController'
            })

            .when('/mobiles', {
                templateUrl: 'paginas/mobiles.html',
                controller: 'mobileController'
            })
            .when('/login', {
                templateUrl: 'paginas/login.html',
                controller: 'loginController'
            })
            .when('/usuarios', {
                templateUrl: 'paginas/usuarios.html',
                controller: 'usuariosController'
            })
            .when('/acessoNegado', {
                templateUrl: 'paginas/acessoNegado.html',
                controller: 'acessoNegadoController'
            })
            .otherwise({ redirectTo: '/home'});

})
.controller('pageController', function ($scope, usuariosService) {

    $scope.logout = function(){
        usuariosService.logout();
    }

})
.controller('homeController', function ($scope) {

})

.controller('emailController', function ($scope, emailsService) {
    $scope.emails = emailsService.getEmails();
    
})

.controller('mobileController', function ($scope, mobilesService) {
    $scope.mobiles = mobilesService.getMobiles();
    
})
.controller('loginController', function ($scope, usuariosService) {

    $scope.logar = function(user){
        usuariosService.validaLogin(user);
    }
})

.controller('usuariosController', function ($scope, usuariosService) {
    $scope.usuarios = usuariosService.getUsers();
    
})
.controller('acessoNegadoController', function ($scope) {
    
})

.service('usuariosService', function ($rootScope, $location) {

    /*Nesta função, vamos fazer o papel de validação que seria feito no backend */
    this.validaLogin = function(user){
        //Vamos criar usuários fictícios que possam ser usados pela página e pra validar o login
        var usuarios = [{username:'Admin', password:'123', admin:true},
            {username:'UserA', password:'123', admin:false},
            {username:'UserB', password:'123', admin:false},
            {username:'UserC', password:'123', admin:false}
        ]

        //Aqui, faremos um for para validar o login
        angular.forEach(usuarios, function(value, index){
            if(value.username == user.username &&
                value.password == user.password){
                delete value.password;
                $rootScope.usuarioLogado = value;
                $location.path('/home')
            }
        })
    }

    this.logout = function(){
        $rootScope.usuarioLogado = null;
        $location.path('/home')
    }
    this.getUsers = function(){
      return [{nome:'Admin', admin:true},
          {nome:'UserA', admin:false},
            {nome:'UserB', admin:false},
            {nome:'UserC', admin:false}
      ]
   }

})
.service('emailsService', function () {
    //busca emails
    this.getEmails = function(){
        return [{ matricula:'UserA', nome:'Antonio' , endereco:'antonio.net@net.com' },
            {matricula:'UserB', nome:'Joao' , endereco:'joao.net@net.com' },
            {matricula:'UserC', nome:'Paulo' , endereco:'paulo.net@net.com' }
        ];
    }
})


.service('mobilesService', function () {
    //busca emails
    this.getMobiles = function(){
        return [{ matricula:'UserA', nome:'Antonio' , device:'Sony XPERIA' },
                { matricula:'UserB', nome:'Joao' , device:'Sansung Galaxy' },
                 { matricula:'UserC', nome:'Paulo' , device:'Asus Zenfone' }

        ];
    }
})

.run(function ($rootScope, $location) {
    //Rotas que necessitam do login
    var rotasBloqueadasUsuariosNaoLogados = ['/usuarios', '/emails', '/mobiles'];
    var rotasBloqueadasUsuariosComuns = ['/usuarios'];

    $rootScope.$on('$locationChangeStart', function () { //iremos chamar essa função sempre que o endereço for alterado
        /*  podemos inserir a logica que quisermos para dar ou não permissão ao usuário.
         Neste caso, vamos usar uma lógica simples. Iremos analisar se o link que o usuário está tentando acessar (location.path())
         está no Array (rotasBloqueadasUsuariosNaoLogados) caso o usuário não esteja logado. Se o usuário estiver logado, iremos
         validar se ele possui permissão para acessar os links no Array de strings 'rotasBloqueadasUsuariosComuns'
         */
        if($rootScope.usuarioLogado == null && rotasBloqueadasUsuariosNaoLogados.indexOf($location.path()) != -1){
            $location.path('/acessoNegado');
        }else
        if($rootScope.usuarioLogado != null &&
            rotasBloqueadasUsuariosComuns.indexOf($location.path()) != -1 &&
            $rootScope.usuarioLogado.admin == false){
            $location.path('/acessoNegado')
        }
    });
});