

const express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');



const app = express();


app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(cors());


const axios = require('axios').default;


const SECRET_KEY = process.env.FLUTTER_WAVE_SECRET_KEY
const PUBLICK_KEY= process.env.FLUTTER_WAVE_PUBLICK_KEY
const {Rave} = require('./flutterwavepay');
//  
app.post('/api/pay',(req, res) => {
  
    var rave = new Rave(PUBLICK_KEY,SECRET_KEY);

    // Normal payment without escrow
    // "cardno": "5531886652142950",
    // "cvv": "564",
    // "expirymonth": "09",
    // "expiryyear": "22",
    // "currency": "NGN",
    // "country": "NG",
    // "amount": "4050",
    // "pin": "3310",    
    // "suggested_auth": "PIN",
    // "subaccounts": [
    //     {
    //       "id": "RS_1AB0B88CBFCA6DD4A8E95528591BBDC2"
    //     }
    //   ],
    // "email": "adedesola.ade3@gmail.com",
    // "phonenumber": "0902620185",
    // "firstname": "temi",
    // "lastname": "desola",
    // "txRef": "MRS-" + Date.now(),
    // "redirect_url": "https://rave-webhook.herokuapp.com/receivepayment",


    // {
    //     "cardno": "5531886652142950",
    //     "cvv": "564",
    //     "expirymonth": "09",
    //     "expiryyear": "22",
    //     "currency": "NGN",
    //     "country": "NG",
    //     "amount": "4850",
    //     "pin": "3310",    
    //     "suggested_auth": "PIN",
    //     "subaccounts": [
    //         {
    //           "id": "RS_1AB0B88CBFCA6DD4A8E95528591BBDC2"
    //         }
    //       ],
    //     "meta": [{metaname: "rave_escrow_tx", metavalue: 1}],
    //     "email": "adedesola.ade3@gmail.com",
    //     "phonenumber": "0902620185",
    //     "firstname": "temi",
    //     "lastname": "desola",
    //     "txRef": "MRS-" + Date.now(),
    //     "redirect_url": "https://rave-webhook.herokuapp.com/receivepayment",
    //   }

rave.initiatePayment(req.body).then((result) =>{

    // i will send the result to the client
    // and use the result to make teh other request
    
    console.log('My data');
    
    console.log(result.data);
    
    res.send(result)
    
//    res.send(result);
//check if result is complete status code 00   "data": {
        //     "responsecode": "00",
        //     "responsetoken": "mocktoken",
        //     "responsemessage": "successful"
        // },
  
    // axios.post('https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/validatecharge',Payload).then(
    //     (result)=>{ res.send(result)}
    // ).catch((error)=> res.send(error))
    //validate payment
    
  }
  )
    // console.log(result))
    .catch((error) =>{ 
        console.log(error);
        
        res.sendStatus(401).send(error)
    
    });
})

app.post('/api/payEscrow',(req, res) => {
  
    var rave = new Rave(PUBLICK_KEY,SECRET_KEY);

 //"txid": 348813, is whta is used to settle escrow
    rave.initiatePayment(req.body).then((result) =>{

    // i will send the result to the client
    // and use the result to make teh other request
    
    console.log('My data');

  
    
    console.log(result.data);
    
    
    res.send(result)
    
//    res.send(result);
//check if result is complete status code 00   "data": {
        //     "responsecode": "00",
        //     "responsetoken": "mocktoken",
        //     "responsemessage": "successful"
        // },
  
    // axios.post('https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/validatecharge',Payload).then(
    //     (result)=>{ res.send(result)}
    // ).catch((error)=> res.send(error))
    //validate payment
    
  })
    .catch((error) =>{ 
        console.log(error);
        
        res.status(401).send(error)});
})

app.post('/api/otp',(req,res)=>{
    var rave = new Rave(PUBLICK_KEY,SECRET_KEY);
    // console.log(JSON.parse(req.body));
    console.log(req.body);
    
    let result = req.body

    var Payload ={
        PBFPubKey: "",
        transaction_reference: "", 
        otp: ""
    };
    Payload.PBFPubKey = "FLWPUBK_TEST-1bd678e781fd42b1ecd1085f0b74cc53-X"
    Payload.transaction_reference = result.transaction_reference
    Payload.otp = result.otp

    rave.verifyPayment(Payload).then((result) => res.send(result))
    .catch((error)=>res.status(400).send(error) );
   



})


app.post('/api/chargewithToken',(req, res) => {
  
    var rave = new Rave(PUBLICK_KEY,SECRET_KEY);
    rave.chargeWithSaveCard({
        "currency":"NGN",
        "token":"flw-t0-bd7a95ab64b4146aed122cfe1e6fe10a-m03k",
        "country":"NG",
        "amount":4500,
        "email":"adedesola.ade3@gmail.com",
        "firstname":"temi",
        "lastname":"Oyekole",
        "txRef":"MC-7666-YU"
    }).then((result)=>{

       
        res.send(result);

    }).catch(error => res.send(error));



})

app.post('/api/updateEmailToken',(req, res) => {
  
    var rave = new Rave(PUBLICK_KEY,SECRET_KEY);
    rave.updateEmailToken({
        
        "embed_token":"flw-t0-bd7a95ab64b4146aed122cfe1e6fe10a-m03k",
        "email":"adedesola.ade3@gmail.com",
        
    }).then((result)=>{

       
        res.send(result);

    }).catch(error => res.send(error));



})

app.post('/api/createSubPlan',(req, res) => {
  
    var rave = new Rave(PUBLICK_KEY,SECRET_KEY);
    rave.createSubscription({
        "email":"adedesola.ade3@gmail.com",
        "name": "Fudap Subscription",
        "interval": "daily",
        "amount": 1300,
        "duration":2
        
    }).then((result)=>{

       // then accept the card details of the csrd to cshrge the subscription on
       rave.initiatePayment({
        "cardno": "5531886652142950",
        "cvv": "564",
        "expirymonth": "09",
        "expiryyear": "22",
        "currency": "NGN",
        "country": "NG",
        "amount": "700",
        "payment_plan":result.data.id,
        "pin": "3310",    
        "suggested_auth": "PIN",
        "email": "adedesola.ade3@gmail.com",
        "phonenumber": "0902620185",
        "firstname": "temi",
        "lastname": "desola",
        "txRef": "MRS-" + Date.now(),
        "redirect_url": "https://rave-webhook.herokuapp.com/receivepayment",
      }).then((result) =>{
    
        var Payload ={
            PBFPubKey: "",
            transaction_reference: "", 
            otp: "12345"
        };
        Payload.PBFPubKey = "FLWPUBK_TEST-1bd678e781fd42b1ecd1085f0b74cc53-X"
        Payload.transaction_reference = result.data.flwRef
       
    
        rave.verifyPayment(Payload).then((result) => res.send(result)).catch((error)=>res.send(error) );
      
        
      }
      ).catch(error => res.send(error));
    }).catch(error => res.send(error));

})

app.post('/api/cancelSubPlan',(req,res)=>{

    var rave = new Rave(PUBLICK_KEY,SECRET_KEY);
    rave.cancelSubcription(5003).then((result)=> res.send(result)).catch((error)=>res.send(error));
})

app.post('/api/editSubPlan',(req,res)=>{
    var rave = new Rave(PUBLICK_KEY,SECRET_KEY);
    rave.editSubcription({"status":"active","name":"Fudap Subscription","id":5003})
    .then((result)=>{
        res.send(result)
    }).catch((error)=>{
        res.send(error)
    })
})
    
    
    app.post('/api/chargewithToken',(req, res) => {
      
        var rave = new Rave(PUBLICK_KEY,SECRET_KEY);
        rave.chargeWithSaveCard({
            "currency":"NGN",
            "token":"flw-t0-bd7a95ab64b4146aed122cfe1e6fe10a-m03k",
            "country":"NG",
            "amount":4500,
            "email":"adedesola.ade3@gmail.com",
            "firstname":"temi",
            "lastname":"Oyekole",
            "txRef":"MC-7666-YU"
        }).then((result)=>{
    
           
            res.send(result);
    
        }).catch(error => res.send(error));


    })


    app.post('/api/createSubacct',(req, res) => {
      
        var rave = new Rave(PUBLICK_KEY,SECRET_KEY);
        rave.createSubAccount(req.body).then((result)=>{
    
           
            res.send(result);
    
        }).catch(error => res.status(403).send(error));
    
    


    })

    app.post('/api/updateSubacct',(req, res) => {
      
        var rave = new Rave(PUBLICK_KEY,SECRET_KEY);
        rave.createSubAccount({
            "id": "",
            "account_bank": "044",
            "account_number": "0690000035",
            "business_name": "JK Services",
            "business_email": "jk@services.com",
            "business_contact": "Seun Alade",
            "business_contact_mobile": "090890382",
            "business_mobile": "09087930450",
        }).then((result)=>{
    
           
            res.send(result);
    
        }).catch(error => res.send(error));
    
    


    })

    // delete sub acct

    app.post('api/deleteSubacct',(req,res)=>{

        var rave = new Rave(PUBLICK_KEY,SECRET_KEY);
        rave.deleteSubAcct("").then((result)=>{
    
           
            res.send(result);
    
        }).catch(error => res.send(error));

    })


    app.post('/api/settleEscrow',(req, res) => {

           // After Initiation and verification 
            // with a payload that indicates the payment is an escrow
            // the response should show that the payment is on escrow
           // data.txid is what will be used to settle the escrow
           //"data.tx.id is the new settlement ways"
  
           var rave = new Rave(PUBLICK_KEY,SECRET_KEY);
            rave.settleEscrow("1197308").then((result)=>{
        
            
                res.send(result);
        
            }).catch(error => res.send(error));
    
    })


    app.post('/api/refundEscrow',(req, res) => {

        // refund can be done when the escrow is not settled

        var rave = new Rave(PUBLICK_KEY,SECRET_KEY);
         rave.refundEscrow({"id":"1197314",
         "comment":"Freelancer did not deliver",
        }).then((result)=>{
     
         
             res.send(result);
     
         }).catch(error => res.send(error));
 
 })

 app.post('/api/generateOtp',(req, res) => {

    // refund can be done when the escrow is not settled

    var rave = new Rave(PUBLICK_KEY,SECRET_KEY);
     rave.generateOtp().then((result)=>{
 
     
         res.send(result);
 
     }).catch(error => res.send(error));

})

 app.get('/api/getAllBanks',(req,res)=>{

    var rave = new Rave(PUBLICK_KEY,SECRET_KEY);
    rave.getAllBanks().then((result)=>{
        res.send(result)
    }).catch((err)=> res.status(403).send(err))
    

})


app.post('/api/createOrder',(req,res)=>{
    Order.create(req.body).then((data) => {
        console.log('Order has been made')
        // todo pusher and notification
        res.send(data) ;
    }).catch(err => {
        console.error('Franchise could not be saved: ', err)
            res.status(403).send(err)
        });

})



app.listen(process.env.PORT || 4000, () =>
    console.log(`🚀 Server ready at `)
)