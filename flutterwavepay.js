const forge = require('node-forge');
const request = require('request-promise-native');
const md5 = require('md5');

var options = {
	url: "",
	method: "",
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	},
	body: {
		"PBFPubKey": "",
		"alg": "3DES-24",
		client: "",
	},
	json: true
}


var verify = {
	url: "",
	method: "",
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	},
	body: {
		"PBFPubKey": "",
		"transaction_reference": "",
		"otp": "12345"
	},
	json: true
}

var verifyToken = {
	// url: "https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/v2/verify",
	url: "https://api.ravepay.co/flwv3-pug/getpaidx/api/v2/verify",
	method: "",
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	},
	body: {
		"SECKEY": "",
	},
	json: true
}

var chargeWithToken = {
	// url: "https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/tokenized/charge",
	url:"https://api.ravepay.co/flwv3-pug/getpaidx/api/tokenized/charge",
	method: "",
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	},
	body: {
		"SECKEY": "",
		"currency": "NGN",

	},
	json: true
}

class Rave {
	/**
	 * Rave object constructor
	 * @param {*} public_key This is a string that can be found in merchant rave dashboard
	 * @param {*} secret_key This is a string that can be found in merchant rave dashboard
	 */
	constructor(public_key, secret_key) {
		this.public_key = public_key;
		this.secret_key = secret_key;
	}

	encryptCardDetails(card_details) {
		card_details = JSON.stringify(card_details);
		let cipher = forge.cipher.createCipher('3DES-ECB', forge.util.createBuffer(this.getKey()));
		cipher.start({ iv: '' });
		cipher.update(forge.util.createBuffer(card_details, 'utf-8'));
		cipher.finish();
		let encrypted = cipher.output;
		return (forge.util.encode64(encrypted.getBytes()));
	}

	getKey() {
		let sec_key = this.secret_key;
		let keymd5 = md5(sec_key);
		let keymd5last12 = keymd5.substr(-12);

		let seckeyadjusted = sec_key.replace('FLWSECK-', '');
		let seckeyadjustedfirst12 = seckeyadjusted.substr(0, 12);

		return seckeyadjustedfirst12 + keymd5last12;
	}

	initiatePayment(card_details) {
		return new Promise((resolve, reject) => {
			let encrypted_card_details = this.encryptCardDetails(card_details);
			let payment_options = Object.assign({}, options);
			// payment_options.url = 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/charge';
			 payment_options.url = 'https://api.ravepay.co/flwv3-pug/getpaidx/api/charge';
			payment_options.body.client = encrypted_card_details;
			payment_options.method = 'POST';
			payment_options.body.PBFPubKey = this.public_key; // set public key

			request(payment_options)
				.then((result) => {
					resolve(result);
				}).catch((err) => {
					reject(err);
				});
		})
	}

	validatePayment(card_details){
		return new Promise((resolve, reject) => {
			let encrypted_card_details = this.encryptCardDetails(card_details);
			let payment_options = Object.assign({}, options);
			// payment_options.url = 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/charge';
			 payment_options.url = 'https://api.ravepay.co/flwv3-pug/getpaidx/api/charge';
			payment_options.body.client = encrypted_card_details;
			payment_options.method = 'POST';
			payment_options.body.PBFPubKey = this.public_key; // set public key

			request(payment_options)
				.then((result) => {
					resolve(result);
				}).catch((err) => {
					reject(err);
				});
		})
	}

	verifyPayment(payload) {
		return new Promise((resolve, reject) => {
			let payment_verification = Object.assign({}, verify);
			// payment_verification.url = 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/validatecharge';
			payment_verification.url = 'https://api.ravepay.co/flwv3-pug/getpaidx/api/validatecharge';
			payment_verification.body = payload;
			payment_verification.method = 'POST';
			payment_verification.body.PBFPubKey = this.public_key; // set public key

			request(payment_verification)
				.then((result) => {
					resolve(result);
				}).catch((err) => {
					reject(err);
				});
		})
	}

	verifyPaymentToken(payload) {
		return new Promise((resolve, reject) => {
			let payment_verification = Object.assign({}, verifyToken);
			// payment_verification.url = 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/validatecharge';
			payment_verification.url = 'https://api.ravepay.co/flwv3-pug/getpaidx/api/validatecharge';
			payment_verification.body = payload;
			payment_verification.method = 'POST';
			payment_verification.body.SECKEY = this.secret_key; // set public key

			request(payment_verification)
				.then((result) => {
					resolve(result);
				}).catch((err) => {
					reject(err);
				});
		})
	}

	chargeWithSaveCard(cardTokenPayload) {

		return new Promise((resolve, reject) => {
			let pay_with_token = Object.assign({}, chargeWithToken);
			pay_with_token.body = cardTokenPayload;
			pay_with_token.method = 'POST';
			pay_with_token.body.SECKEY = this.secret_key; // set public key

			request(pay_with_token)
				.then((result) => {
					resolve(result);
				}).catch((err) => {
					reject(err);
				});
		})
	}

	updateEmailToken(payload) {
		//update the email of the token


		var updateEmailPayload = {
			// url: `https://ravesandboxapi.flutterwave.com/v2/gpx/tokens/${payload.embed_token}/update_customer`,
			url: `https://api.ravepay.co/v2/gpx/tokens/${payload.embed_token}/update_customer`,
			method: "",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: {

				"secret_key": ""

			},
			json: true
		}
		return new Promise((resolve, reject) => {
			let update_token = Object.assign({}, updateEmailPayload);
			update_token.body = payload;
			update_token.method = 'POST';
			update_token.body.secret_key = this.secret_key; // set public key

			request(update_token)
				.then((result) => {
					resolve(result);
				}).catch((err) => {
					reject(err);
				});
		})

	}

	getAllBanks() {

		var Payload = {
			// url: `https://ravesandboxapi.flutterwave.com/v2/banks/NG?public_key=${this.public_key}`,
			url: `https://api.ravepay.co/v2/banks/NG?public_key=${this.public_key}`,
			method: "GET",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},

			json: true
		}


		return new Promise((resolve, reject) => {


			request(Payload)
				.then((result) => {
					resolve(result);
				}).catch((err) => {
					reject(err);
				});
		})

	}

	createSubscription(payload) {
		// https://api.ravepay.co/v2/gpx/paymentplans/create

		var createSubPayload = {
			// url: 'https://ravesandboxapi.flutterwave.com/v2/gpx/paymentplans/create',
			url: 'https://api.ravepay.co/v2/gpx/paymentplans/create',
			method: "",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: {

				"seckey": ""

			},
			json: true
		}

		return new Promise((resolve, reject) => {
			let create_subplan = Object.assign({}, createSubPayload);
			create_subplan.body = payload;
			create_subplan.method = 'POST';
			create_subplan.body.seckey = this.secret_key; // set public key

			request(create_subplan)
				.then((result) => {
					resolve(result);
				}).catch((err) => {
					reject(err);
				});
		})
	}



	cancelSubcription(id) {
		// https://api.ravepay.co/v2/gpx/paymentplans/id/cancel

		var SubPayload = {
			// url: `https://ravesandboxapi.flutterwave.com/v2/gpx/paymentplans/${id}/cancel`,
			url: `https://api.ravepay.co/v2/gpx/paymentplans/${id}/cancel`,
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: {

				"seckey": this.secret_key

			},
			json: true
		}


		return new Promise((resolve, reject) => {



			request(SubPayload)
				.then((result) => {
					resolve(result);
				}).catch((err) => {
					reject(err);
				});
		})



	}


	editSubcription(payload) {
		// https://api.ravepay.co/v2/gpx/paymentplans/id/cancel

		var SubPayload = {
			// url: `https://ravesandboxapi.flutterwave.com/v2/gpx/paymentplans/${payload.id}/edit`,
			url: `https://api.ravepay.co/v2/gpx/paymentplans/${payload.id}/edit`,
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: {

				"seckey": this.secret_key,
				"name": payload.name,
				"status": payload.status,
				"id": payload.id
			},
			json: true
		}


		return new Promise((resolve, reject) => {



			request(SubPayload)
				.then((result) => {
					resolve(result);
				}).catch((err) => {
					reject(err);
				});
		})



	}

	createSubAccount(payload) {
		// https://ravesandboxapi.flutterwave.com/v2/gpx/subaccounts/create
		var SubAcctPayload = {

			url: 'https://api.ravepay.co/v2/gpx/subaccounts/create',
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: {

				"seckey": this.secret_key,
				"split_value": "50",
				"country": "NG",
			},
			json: true
		}


		return new Promise((resolve, reject) => {
			let subacct_token = Object.assign({}, SubAcctPayload);
			subacct_token.body = { ...subacct_token.body, ...payload };

			request(subacct_token)
				.then((result) => {
					resolve(result);
				}).catch((err) => {
					reject(err);
				});
		})

	}

	updateSubAccount(payload) {
		var SubAcctPayload = {
			// url: 'https://ravesandboxapi.flutterwave.com/v2/gpx/subaccounts/edit',
			url: 'https://api.ravepay.co/v2/gpx/subaccounts/edit',
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: {

				"split_value": "50",

			},
			json: true
		}


		return new Promise((resolve, reject) => {
			let subacct_token = Object.assign({}, SubAcctPayload);
			subacct_token.body = { ...subacct_token.body, ...payload };

			request(subacct_token)
				.then((result) => {
					resolve(result);
				}).catch((err) => {
					reject(err);
				});
		})


	}

	deleteSubAcct(id) {
		var SubAcctPayload = {
			url: 'https://ravesandboxapi.flutterwave.com/v2/gpx/subaccounts/edit',
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: {
				"seckey": this.secret_key,
				"id": id
			},
			json: true
		}


		return new Promise((resolve, reject) => {
			let subacct_token = Object.assign({}, SubAcctPayload);


			request(subacct_token)
				.then((result) => {
					resolve(result);
				}).catch((err) => {
					reject(err);
				});
		})
	}

	settleEscrow(id) {
		var EscrowPayload = {
			// url: 'https://ravesandboxapi.flutterwave.com/v2/gpx/transactions/escrow/settle',
			url: 'https://api.ravepay.co/v2/gpx/transactions/escrow/settle',
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: {

				"id": id,
				"secret_key": this.secret_key,

			},
			json: true
		}


		return new Promise((resolve, reject) => {
			let escrow_token = Object.assign({}, EscrowPayload);

			request(escrow_token)
				.then((result) => {
					resolve(result);
				}).catch((err) => {
					reject(err);
				});
		})
	}

	refundEscrow(payload) {
		var EscrowPayload = {
			// url: 'https://ravesandboxapi.flutterwave.com/v2/gpx/transactions/escrow/refund',
			url: 'https://api.ravepay.co/v2/gpx/transactions/escrow/refund',
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: {

				"id": payload.id,
				"comment": payload.comment,
				"secret_key": this.secret_key,

			},
			json: true
		}


		return new Promise((resolve, reject) => {
			let escrow_token = Object.assign({}, EscrowPayload);

			request(escrow_token)
				.then((result) => {
					resolve(result);
				}).catch((err) => {
					reject(err);
				});
		})
	}


	generateOtp() {
		// https://ravesandboxapi.flutterwave.com/v2/gpx/subaccounts/create
		var Generateotp = {

			url: 'https://api.ravepay.co/v2/services/confluence/',
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: {

				"seckey": this.secret_key,
				"service": "fUdap food delivery",
				"service_method": "post",
				"service_version": "v1",
				"service_channel": "rave",
				"send_as_is": 1,
				// "service_payload": {
				"length_of_otp": 6,
				"send_otp_to_customer": true,
					"medium": [
						"whatsapp",
						"sms"
					],
					"customer_info": {
						"first_name": "Tope",
						"email": "temitopeayp01@gmail.com",
						"mobile": "07064515676"
					},
					"otp_expires_in_minutes": 6,
					"sender_business_name": "Fudap",
					"send_same_otp": true
				// },
			},
				json: true
			}


		return new Promise((resolve, reject) => {
				// let subacct_token = Object.assign({}, SubAcctPayload);
				// subacct_token.body = { ...subacct_token.body, ...payload };

				request(Generateotp)
					.then((result) => {
						resolve(result);
					}).catch((err) => {
						reject(err);
					});
			})

		}

	}

	exports.Rave = Rave;