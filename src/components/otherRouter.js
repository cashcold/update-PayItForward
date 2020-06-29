Router.put('/forgotpassword', async(req,res)=>{
    const user = await User.findOne({email: req.body.email})
    if(!user){
        return res.status(400).send('Email Not Found')
    }
    const payload = {
               
        full_Name: user.full_Name,
        user_Name: user.user_Name,
        email: user.email,
        password: user.password,
        bitcoin: user.bitcoin,
        bitcoinCash: user.bitcoinCash,
        perfectMoney: user.perfectMoney,
        payPal: user.payPal,           
        date: user.date,
   }
   const token = jwt.sign(payload, process.env.resetPasswordKey,)
   
   var api_key = '3b010ce36a840e4798ab908cde0d52fd-1b6eb03d-21fbd240';
   var domain = 'sandboxcbf865f82fc74bdbb3a49a174cc9af61.mailgun.org';
   var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
    
   var data = {
     from: 'PayItForward <payitforwardinvestmentlimited@gmail.com>',
     to: 'frankainoo@gmail.com',
     subject: 'Hello',
     html: ` <h1>Please Follow the link to restart your password </h1>
           <p>${process.env.forgotPasswordLink}/${token}</p>
     `
   };

   return user.updateOne({restartLinkPassword: token},(err, success)=>{
       if(err){
           return res.status(400).send('Password restart fail, Please try again')
       }else{
            mailgun.messages().send(data, function (error, body) {
                if(error){
                    return res.status(400).send(error.message)
                }
                return res.status(200).send('Link have sent to email address')
          });
       }
   })



})

Router.put('/activitpassword',(req,res)=>{
    const {restartLinkPassword, newPassword} = req.body;
    if(restartLinkPassword){
        jwt.verify(restartLinkPassword,process.env.resetPasswordKey,(err, decoded)=>{
            if(err){
                return res.status(400).send('Incorrect Token Enter')
            }
            User.findOne({restartLinkPassword},(err, user)=>{
                if(err || !user){
                    return res.status(400).send('User with this token not exist')
                }
                const obj = {
                    password: newPassword
                }
                user = _.extend(user, obj)
                user.save((err,result)=>{
                    if(err){
                        return res.status(400).send('Error happen while trying to Restart Password')
                    }else{
                        var api_key = '3b010ce36a840e4798ab908cde0d52fd-1b6eb03d-21fbd240';
                        var domain = 'sandboxcbf865f82fc74bdbb3a49a174cc9af61.mailgun.org';
                        var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
                         
                        var data = {
                          from: 'PayItForward <payitforwardinvestmentlimited@gmail.com>',
                          to: 'frankainoo@gmail.com',
                          subject: 'Hello',
                          html: ` <h1>Congratulation your password restart successful</h1>
                          `
                        };
                        mailgun.messages().send(data, function (error, body) {
                            if(error) return res.status(400).send(error.message)
                            res.status(200).send('Password restart')
                            console.log(body); 
                        });
                        
                    }
                })
            })

        })
    }else{
        return res.status(400).send('Authentication Error')
    }
})





Router.post('/activitypassword/:token',(req,res)=>{
    async.waterfall([
        (done)=>{
            User.findOne({restartLinkPassword: req.params.token},(err, user, nex)=>{
                if(!user){
                    res.status(400).send('Restart Passowrd Token Expire Just and hour')
                }
                user.password = req.body.password;
                user.restartLinkPassword = undefined;
                user.save((err,user)=>{
                    done( err,user)
                })
            })
        },
        (user,done)=>{
            var api_key = '3b010ce36a840e4798ab908cde0d52fd-1b6eb03d-21fbd240';
            var domain = 'sandboxcbf865f82fc74bdbb3a49a174cc9af61.mailgun.org';
            var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
             
            var data = {
              from: 'PayItForward <payitforwardinvestmentlimited@gmail.com>',
              to: 'frankainoo@gmail.com',
              subject: 'Congratulation',
              html: ` Please Your password have successful change</p>
              Don't share your password with anyone
              `
            }; mailgun.messages().send(data, function (error, body) {
                if(error){
                    return res.status(400).send(error.message)
                }
                return res.status(200).send('Link have sent to email address')
          });
    

        },
        
    ])

})
