const externalRequest = require('request');

const SUCCESSFUL_RESPONSE = "ok";
const ERROR_RESPONSE = "error";
const VK_API_VERSION = "5.102";

const CONFIRMATION_RESPONSE = process.env.CONFIRMATION_RESPONSE;
const TARGET_POST_ID = parseInt(process.env.TARGET_POST_ID);
const COMMUNITY_ID = parseInt(process.env.COMMUNITY_ID);
const COMMUNITY_API_KEY = process.env.COMMUNITY_API_KEY;

function generateRandomInt() {
    return Math.round(Math.random()*10000000000);
}

function randomAction() {
    let actions = [
        'прокукарекать',
        'помяукать',
        'сказать "я люблю козявки"',
        'сказать "я люблю таракашек"',
        'рассказать свой самый большой секрет',
        'вежливо попросить чаю с медом',
        'рассказать детскую считалочку',
        'рассказать стишок',
        'признаться, что ты скрываешь пышный хвост',
    ];

    let randomIndex = Math.floor(Math.random()*actions.length)
    return actions[randomIndex];
}

function randomDoubleDareMessage() {
    let postUrl = "https://vk.com/wall-" + COMMUNITY_ID + "_" + TARGET_POST_ID;
    return `Слабо в этом посте ${randomAction()}? ${postUrl}`;
}

function sendDoubleDareDirectMessage(userId, callback) {
    let sendMessageMethodUrl = 'https://api.vk.com/method/messages.send';
    let methodParams = {
        user_id: userId,
        random_id: generateRandomInt(),
        peer_id: "-" + COMMUNITY_ID,
        group_id: COMMUNITY_ID,
        message: randomDoubleDareMessage(),
        access_token: COMMUNITY_API_KEY,
        v: VK_API_VERSION
    }

    externalRequest({
            url: sendMessageMethodUrl,
            qs: methodParams
        },
        callback);
}

module.exports = {
    confirmation: function (request, response) {
        response.send(CONFIRMATION_RESPONSE);
    },

    wall_reply_new: function (request, response) {
        let comment = request.body.object;
        let postId = comment.post_id;

        if (postId === TARGET_POST_ID) {
            let userId = comment.from_id;
            sendDoubleDareDirectMessage(userId, function(error, sendResponse, sendResultBody) {
                if (error) {
                    console.log(error);
                    response.send(ERROR_RESPONSE);
                    return;
                }

                let sendResultJSON = JSON.parse(sendResultBody);
                let messageId = sendResultJSON.response;
                let hasMessageId = messageId > 0;

                if (hasMessageId) {
                    response.send(SUCCESSFUL_RESPONSE);
                }
                else {
                    response.send(ERROR_RESPONSE);
                }
            });
        }
        else {
            response.send(SUCCESSFUL_RESPONSE);
        }
    }
}