if(process.env.NODE_ENV === 'development'){
    module.exports = {
        'connection': {
            'host': '127.0.0.1', // localde iseniz bu , local değilse ip adresini yazınız .
            'user': 'root', // kullanıcı adı 
            'password': '', // şifreniz 
            'database': 'amash_pay'// database ismi .
        },
        'database': 'amash_pay',
    }
}else{
    module.exports = {
        
    }
}



