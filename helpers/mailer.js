const SibApiV3Sdk = require('sib-api-v3-sdk')
//Create a new instance and api key
const client = SibApiV3Sdk.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.SENDINBLUE_API
//create new transaction email instance
const mailOptions = new SibApiV3Sdk.TransactionalEmailsApi()
//Specify the sender
const sender = {
	email: 'noreply@zentask37.io',
	name: 'zentask37.io',
}
exports.sendVerificationMail = (name, email, url) => {
	const recipients = [
		{
			email: email,
		},
	]
	mailOptions
		.sendTransacEmail({
			sender,
			to: recipients,
			subject: 'Zentask37 email verification',
			htmlContent: `<div><div style="padding:2rem;display:flex;align-items:center"><h2 style="display:inline-block;margin-left:5rem;font-weight:300">Action Required:<span style="color:#a3a3a3;font-weight:200">Activate your<span style="color:#93c050">Account</span>!</span></h2></div><hr style="color:#93c050;width:95%;opacity:50%;margin-bottom:1rem"><div style="padding:2rem"><p style="font-size:1.8em">Hello ${name},</p><p style="font-size:1.4em;line-height:1.5">You recently registered a new account with us<br>Please verify your email to finish your registration.</p></div><div style="padding-left:2rem"><a href=${url} style="text-decoration:none;color:#fff"><button style="width:12rem;padding:1rem;background-color:#93c050;font-weight:600;color:#f7f7f7;border-radius:.25rem;border:none;cursor:pointer">Verify</button></a></div><div style="padding:2rem"></div></div>`,
		})
		.then(console.log)
		.catch(console.log)
}

exports.sendResetCode = (name, email, resetCode) => {
	const recipients = [
		{
			email: email,
		},
	]
	mailOptions
		.sendTransacEmail({
			sender,
			to: recipients,
			subject: 'Zentask37 Reset Code',
			htmlContent: `<div><div style="padding:2rem;display:flex;align-items:center"><h2 style="display:inline-block;margin-left:5rem;font-weight:300">Action Required:<span style="color:#a3a3a3;font-weight:200">Activate your<span style="color:#93c050">Account</span>!</span></h2></div><hr style="color:#93c050;width:95%;opacity:50%;margin-bottom:1rem"><div style="padding:2rem"><p style="font-size:1.8em">Hello ${name},</p><h2 style="display:inline-block;padding:1rem;letter-spacing:.5rem;background-color:#93c05075;color:#a50100">${resetCode}</h2></div></div>`,
		})
		.then(console.log)
		.catch(console.log)
}
