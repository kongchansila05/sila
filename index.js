const TelegramBot = require("node-telegram-bot-api");
// const {BakongKHQR, khqrData, IndividualInfo,MerchantInfo, SourceInfo} = require("bakong-khqr");
const {
    BakongKHQR,
    khqrData,
    IndividualInfo,
    MerchantInfo,
    } = require("bakong-khqr");
const { createCanvas, registerFont } = require('canvas');
registerFont('Nokora-Regular.ttf', { family: 'Nokora' });
const QRCode = require('qrcode'); 
const axios = require("axios");
require("dotenv").config();
const API_KEY =
    process.env.API_KEY || "7806217113:AAFlIuLrnq3g74zNNEOeSBC3NnJLufl4R-I";
const bot = new TelegramBot(API_KEY, { polling: true });

const REGISTER_API = "https://p-api.sbc369.club/api/cash/registration/";
const LOGIN_API = "https://p-api.sbc369.club/api/cash/login/";
const CAPTION ="សំរាប់ចម្ងល់ឬបញ្ហាផ្សេងៗ នឹង ដាក់/ដក ប្រាក់ ចុចទីនេះ 👉🏻 @KH88BET  បញ្ជាក់៖ នេះជាម៉ាសុីនសម្រាប់តែបង្កើតអាខោន មិនចេះឆ្លើយតបទេ។ សូមអរគុណ!";
const CERT = "3Wum85V6T95x9CD6trrXiS";
const IMAGE_welcome = "https://i.imgur.com/uA4RXoi.jpeg";
const IMAGE_88 = "https://i.imgur.com/i5Ra3MQ.jpeg";
const IMAGE_10 = "https://i.imgur.com/Wnupuzi.jpeg";
const IMAGE_5 = "https://i.imgur.com/eJP0yVv.jpeg";
const Authorization = "Token e3543a091350bec511dbe18c6acfcbe4ed4a4b97";
function generateNineDigitNumber() {
    return Math.floor(100000000 + Math.random() * 900000000);
}

function handleContactCommand(chatId) {
    bot.sendPhoto(chatId, IMAGE_welcome, {
        caption: CAPTION,
        parse_mode: "HTML", // Use HTML formatting for the caption
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "👩‍💻ផ្នែកសេវាកម្ម 24/7", url: "https://t.me/KH88BET" }
                ]
            ]
        }
    });
}

bot.onText(/\/(register|start)/, async (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || "";
    const lastName = msg.from.last_name || "";
    const UserName = msg.from.username || "";
    const Full_Name = `${firstName}${lastName}`.trim();
    const FullName = Full_Name.replace(/\s+/g, '');
    const Password = msg.from.id;
    const Phone = generateNineDigitNumber();
    let data_l = {
        username: FullName,
        password: Password,
        cert: CERT,
    };
    let data_r = {
        account: FullName,
        name: UserName,
        password: Password,
        contact: Phone,
        affiliate: "",
        cert: CERT,
    };
    const headers = {
        "Content-Type": "application/json",
        Authorization: Authorization,
    };
    axios.post(LOGIN_API,data_l,{
        headers: headers
      }).then((response)=>{
        if(response.status == '200'){
            const { domain, sessionid, userid } = response.data;
            const rehref = `${domain}/?sid=${sessionid}&uid=${userid}&cert=${CERT}&language=EN`;
            bot.sendMessage(
                chatId,
                `👤ឈ្មោះ​គណនី: <code>${FullName}</code>\n🔐 លេខសម្ងាត់: <code>${Password}</code>\n🌐 ចូលលេង: <a href="${rehref}">KH88BET</a>`,
                { parse_mode: "HTML" }
            ).then(() => {
                handleContactCommand(chatId);
            });
        }
    }).catch(error => {
        const errorMessage = error.response.data.message;
        if (errorMessage === "Username or password is not valid!") {
            axios.post(REGISTER_API, data_r, { headers })
            .then((response) => {
                if (response.status === 201) {
                    axios.post(LOGIN_API, data_l, { headers })
                    .then((responseLogin) => {
                        if (responseLogin.status === 200) {
                            const { domain, sessionid, userid } = responseLogin.data;
                            const rehref = `${domain}/?sid=${sessionid}&uid=${userid}&cert=${CERT}&language=EN`;
                            bot.sendMessage(
                                chatId,
                                `👤ឈ្មោះ​គណនី: <code>${FullName}</code>\n🔐 លេខសម្ងាត់: <code>${Password}</code>\n🌐 ចូលលេង: <a href="${rehref}">KH88BET</a>`,
                                { parse_mode: "HTML" }
                            ).then(() => {
                                handleContactCommand(chatId);
                            });
                        }
                    });
                }
            })
            .catch((errorr) => {
                if (errorr.response && errorr.response.data) {
                    const errorMessage = errorr.response.data.message;
                if (errorMessage === "The account is already exists!") {
                    bot.sendMessage(
                        chatId,
                        `ឈ្មោះរបស់អ្នកមានរួចហេីយសូមធ្វេីការដូរឈ្មោះតេឡេក្រាមលោកអ្នក!`
                    );
                } else if (errorMessage === "The phone number is already exists!") {
                        bot.sendMessage(chatId, `លេខទូរស័ព្ទមានហើយ!`);
                } else if (errorMessage === "Minimum username 6 digits and maxiumm 10 digits!") {
                        bot.sendMessage(
                            chatId,
                            `ឈ្មោះអ្នកប្រើអប្បបរមា 6 ខ្ទង់ និងអតិបរមា 10 ខ្ទង់!`
                        );
                } else if (errorMessage === "Username contains space!") {
                        bot.sendMessage(
                            chatId,
                            `ឈ្មោះអ្នកប្រើប្រាស់មានកន្លែងទំនេរ!`
                        );
                }else {
                        bot.sendMessage(
                            chatId,
                            `Unexpected error: ${errorMessage}`
                        );
                    }
                } else {
                    bot.sendMessage(
                        chatId,
                        `Bot is temporarily down. Please try again later.`
                    );
                }
            });
        }
    });
});
bot.onText(/\/contact/, (msg) => {
    const chatId = msg.chat.id;
    handleContactCommand(chatId);
});
bot.onText(/\/deposit/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 
        `សូមជ្រើសរើសទឹកប្រាក់ជា ( USD/KHR )`, 
        {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "USD", callback_data: "currency_us" }],
                    [{ text: "KHR", callback_data: "currency_kh" }]
                ]
            }
        }
    );
});

bot.onText(/\/promotion/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 
        `🌟<b>ការផ្តល់ជូនពិសេស KH88BET</b> 🌟\n\n 🎁ស្វាគមន៏សមាជិថ្មី 88%\n 🎁ប្រាក់បន្ថែមរៀងរាល់ថ្ងៃ 10%\n 🎁ប្រាក់បង្វិលប្រចាំខែ 5%`, 
        {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "ស្វាគមន៏សមាជិថ្មី 88%", callback_data: "promo_80" }],
                    [{ text: "ប្រាក់បន្ថែមរៀងរាល់ថ្ងៃ 10%", callback_data: "promo_10" }],
                    [{ text: "ប្រាក់បង្វិលប្រចាំខែ 5%", callback_data: "promo_5" }],
                ]
            }
        }
    );
});
async function generateQrWithTitle(data,amount) {
    const canvas = createCanvas(340, 340); // Create a canvas with space for title
    const ctx = canvas.getContext('2d');

    try {
        await QRCode.toCanvas(canvas, data, {
            width: 340,
        });
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const circleRadius = canvas.width * 0.06;
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
        ctx.fill();
        if(amount === '$'){
            ctx.font = `bold 20px 'Arial'`;
        }else{
            ctx.font = `bold 20px 'Nokora'`;
        }
        ctx.fillStyle = 'white'; // Text color
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if(amount === '$'){
            ctx.fillText('$', centerX, centerY);
        }else{
            ctx.fillText('៛', centerX, centerY);
        }
        return canvas.toBuffer(); // Return the final buffer
    } catch (err) {
        console.error('Error generating QR with title:', err);
        throw err;
    }
}
bot.on('callback_query',async (callbackQuery) => {
    const message = callbackQuery.message;
    const data = callbackQuery.data;

    if (data.startsWith("currency_")) {
        const currency = data.split("_")[1];
        if (currency === 'us') {
            bot.sendMessage(message.chat.id, 
            `💵បញ្ចូលទឹកប្រាក់ (អប្បបរមា: $5 / អតិបរមា: $500)`, 
                {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "5$", callback_data: "depositus_5" },{ text: "10$", callback_data: "depositus_10" },{ text: "20$", callback_data: "depositus_20" }],
                            [{ text: "50$", callback_data: "depositus_50" },{ text: "100$", callback_data: "depositus_100" },{ text: "500$", callback_data: "depositus_500" }],
                        ]
                    }
                }
            );
        }else{
            bot.sendMessage(message.chat.id, 
                `💵បញ្ចូលទឹកប្រាក់ (អប្បបរមា: 20,000រៀល / អតិបរមា: 4,000,000រៀល)`, 
                    {
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "20,000រៀល", callback_data: "depositkh_20000" },{ text: "40,000រៀល", callback_data: "depositkh_40000" },{ text: "80,000រៀល", callback_data: "depositkh_80000" }],
                                [{ text: "200,000រៀល", callback_data: "depositkh_200000" },{ text: "400,000រៀល", callback_data: "depositkh_400000" },{ text: "4,000,000រៀល", callback_data: "depositkh_4000000" }],
                            ]
                        }
                    }
            );
        }
    }
    else if (data.startsWith("depositus_")) {
        const amount = data.split("_")[1];
        const optionalData = {
            currency: khqrData.currency.usd,
            amount: amount,
            mobileNumber: "855968877203",
            storeLabel: "Coffee Shop",
            terminalLabel: "Cashier_1",
            // purposeOfTransaction: "oversea",
            // languagePreference: "km",
            // merchantNameAlternateLanguage: "ចន សីន",
            // merchantCityAlternateLanguage: "ៀមប",
            // upiMerchantAccount: "0001034400010344ABCDEFGHJIKLMNO"
            };
            const merchantInfo = new MerchantInfo(
            "kong_chansila@aclb",
            "B Coffe",
            "PHNOM PENH",
            "003029442",
            "B Coffe",
            optionalData);
            const KHQR = new BakongKHQR();
            const response = KHQR.generateMerchant(merchantInfo); 
            // let khqrString = response.data.qr;
            // const isKHQR = BakongKHQR.verify(khqrString);

            // console.log("qr: " + merchant.data.qr);
            console.log("md5: " + response.data.md5);
        if (
            response &&
            response.status &&
            response.status.code === 0 &&
            response.data &&
            response.data.qr
        ) {
            try {
                const qrBuffer = await generateQrWithTitle(response.data.qr, '$');
    
                bot.sendPhoto(message.chat.id, qrBuffer, {
                    caption: `✅ សូមស្កេន QR Code ដើម្បីបង់ប្រាក់ $${amount}.`
                });
            } catch (err) {
                bot.sendMessage(message.chat.id, '❌ មានបញ្ហាក្នុងការបង្កើត QR Code។');
            }
        } else {
            bot.sendMessage(message.chat.id, "❌ មានបញ្ហាក្នុងការទទួលទិន្នន័យ QR Code។ សូមព្យាយាមម្ដងទៀត។");
            console.error("Invalid response data:", response);
        }
    }
    else if (data.startsWith("depositkh_")) {
        const amount = data.split("_")[1];
        const optionalData = {
            currency: khqrData.currency.khr,
            amount: amount,
            mobileNumber: "855968877203",
            storeLabel: "Coffee Shop",
            terminalLabel: "Cashier_1",
            };
            const merchantInfo = new MerchantInfo(
            "kong_chansila@aclb",
            "B Coffe",
            "PHNOM PENH",
            "003029442",
            "B Coffe",
            optionalData);
            const KHQR = new BakongKHQR();
            const response = KHQR.generateMerchant(merchantInfo); 
        if (
            response &&
            response.status &&
            response.status.code === 0 &&
            response.data &&
            response.data.qr
        ) {
            try {
                const qrBuffer = await generateQrWithTitle(response.data.qr, '៛');
    
                bot.sendPhoto(message.chat.id, qrBuffer, {
                    caption: `📲 ស្កេន QR Code ដើម្បីបង់ប្រាក់ ${amount} រៀល.`
                });
            } catch (err) {
                bot.sendMessage(message.chat.id, '❌ មានបញ្ហាក្នុងការបង្កើត QR Code។');
            }
        } else {
            bot.sendMessage(message.chat.id, "❌ មានបញ្ហាក្នុងការទទួលទិន្នន័យ QR Code។ សូមព្យាយាមម្ដងទៀត។");
            console.error("Invalid response data:", response);
        }
    
    }
    else if (data === "promo_80") {
        bot.sendPhoto(message.chat.id, IMAGE_88, {
            caption: `🎁ស្វាគមន៏សមាជិថ្មី 80%🧧\n\n - វិលជុំ x7 (ហ្គេមស្លុត)\n - វិលជុំ x13 (ហ្គេមឡាយផ្ទាល់, បាញ់ត្រី)\n - ដាក់ប្រាក់តិចបំផុត $10\n - ដកប្រាក់ធំបំផុត $288`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "👩‍💻ផ្នែកសេវាកម្ម 24/7", url: "https://t.me/KH88BET" }
                    ]
                ]
            }
        });
    } else if (data === "promo_10") {
        bot.sendPhoto(message.chat.id, IMAGE_10, {
            caption: `🧧ប្រាក់បន្ថែមរៀងរាល់ថ្ងៃ 20%🧧\n\n - វិលជុំ x4 (ហ្គេមស្លុត)\n - វិលជុំ x8 (ហ្គេមឡាយផ្ទាល់, បាញ់ត្រី)\n - ដាក់ប្រាក់តិចបំផុត $10\n - ដកប្រាក់ធំបំផុត $188`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "👩‍💻ផ្នែកសេវាកម្ម 24/7", url: "https://t.me/KH88BET" }
                    ]
                ]
            }
        });
    } else if (data === "promo_5") {
        bot.sendPhoto(message.chat.id, IMAGE_5, {
            caption: `🧧 ប្រាក់បង្វិលប្រចាំខែ 5%🧧\n\n - វិលជុំ x4 (ហ្គេមស្លុត)\n - វិលជុំ x8 (ហ្គេមឡាយផ្ទាល់, បាញ់ត្រី)\n - ដាក់ប្រាក់តិចបំផុត $10\n - ដកប្រាក់ធំបំផុត $188`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "👩‍💻ផ្នែកសេវាកម្ម 24/7", url: "https://t.me/KH88BET" }
                    ]
                ]
            }
        });
    } else if (data === "register") {
        bot.sendMessage(message.chat.id, "You clicked on Register Now!");
    } 
});


const express = require("express");
const { log } = require("console");
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Bot is running!"));
app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
);