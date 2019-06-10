/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Text, Card, Image, Suggestion, Payload} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

// link and image URLs
const keisLogoImageUrl = 'https://www.keis.or.kr/site/main/images/common/logo.png';
const keisUrl = 'https://www.keis.or.kr/main/index.do';
const askMeGifImageUrl = 'https://media1.tenor.com/images/04edcf23fe97643fc4b870a58d26b2bb/tenor.gif?itemid=6030434';


exports.knutConsultingBotFulfillment = functions.https.onRequest((request, response) => {

  // [START init]
  const agent = new WebhookClient({request, response});
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  // [END init]

  // [START set_intents]
  // [START welcomeIntent]
  function welcomeIntent(agent) {
    agent.add('');
    agent.add(new Card({
        title: '안녕하세요, 교통대 소프트웨어학과 인공지능 직업상단 챗봇입니다.',
        imageUrl: askMeGifImageUrl,
        text: '어떤 것이든 물어보세요!',
        buttonText: '고용정보원 바로가기',
        buttonUrl: keisUrl,
      })
    );
    agent.add('다음과 같이 한 번 물어보세요~');
    agent.add(new Suggestion('미래 예상 직업 정보'));
    agent.add(new Suggestion('서울 지역 채용 정보 알려줘'));
    agent.add(new Suggestion('취소'));
  }

  // [END welcomeIntent]

  function fallbackIntent(agent) {
    agent.add('어이쿠, 뭔가 문제가 있는 것 같아요! ');
    agent.add(`잠시 후 다시 시도해주시겠어요?`)
  }

  // [END set_intents]

  // [START match_intents]
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcomeIntent);
  intentMap.set('Default Fallback Intent', fallbackIntent);
  agent.handleRequest(intentMap);
  // [END match_intents]

});
