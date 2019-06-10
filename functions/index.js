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
  const customSuggestions = new Suggestion({
    title: "다음과 같이 물어보세요~!",
    reply: "미래 예상 직업 정보",
  });
  customSuggestions.addReply_("서울 지역 채용 정보 알려줘");
  customSuggestions.addReply_("취업 하고 싶어.");
  customSuggestions.addReply_("자소서 잘 쓰는 방법?");
  // [END init]

  // [START set_intents]
  // [START welcomeIntent]
  function welcomeIntent(agent) {
    agent.add(new Card({
        title: '안녕하세요, 교통대 소프트웨어학과 인공지능 직업상단 챗봇입니다.',
        imageUrl: askMeGifImageUrl,
        text: '어떤 것이든 물어보세요!',
        buttonText: '고용정보원 바로가기',
        buttonUrl: keisUrl,
      })
    );
    agent.add(customSuggestions);
  }

  // [END welcomeIntent]

  // [START futureJobIntent]
  function futureJobIntent(agent) {
    const futureJob = agent.parameters['FutureJob_theme'];
    const gotFutureJob = futureJob.length > 0;

    if (gotFutureJob) {
      agent.add(` ${futureJob} 분야의 미래 직업 정보는 다음과 같습니다.`);
      agent.add(customSuggestions);
    } else if (!gotFutureJob) {
      const jobTypeSuggestions = new Suggestion({
        title: "분야를 골라주세요.",
        reply: "의식주",
      });
      jobTypeSuggestions.addReply_("건강");
      jobTypeSuggestions.addReply_("디자인");
      jobTypeSuggestions.addReply_("로봇");
      jobTypeSuggestions.addReply_("바이오");
      jobTypeSuggestions.addReply_("안전");
      jobTypeSuggestions.addReply_("에너지");
      jobTypeSuggestions.addReply_("연결");

      agent.add(jobTypeSuggestions);


    }

  }

// [END futureJobIntent]


// [START majorInfoIntent]
  function majorInfoIntent(agent) {
    agent.add('학과 정보 미지원.');
    agent.add(customSuggestions);
  }

// [END majorInfoIntent]


// [START recruitInfoIntent]
  function recruitInfoIntent(agent) {
    agent.add('채용 정보 미지원.');
    agent.add(customSuggestions);
  }

// [END recruitInfoIntent]


// [START schoolsInfoIntent]
  function schoolsInfoIntent(agent) {
    agent.add('학교 정보 미지원.');
    agent.add(customSuggestions);
  }

// [END schoolsInfoIntent]


// [START employmentTipsIntent]
  function employmentTipsIntent(agent) {
    const tipType = agent.parameters['Tip_type'];
    const gotTipType = tipType.length > 0;

    if (gotTipType) {
      let title = "";
      let imageUrl = "";
      let text = "";
      let buttonText = "";
      let buttonUrl = "";
      switch (tipType) {
        case '이력서 작성법':
          title = "이력서 작성법📝";
          imageUrl = "https://ancorp.com/wp-content/uploads/2019/05/resume-icon-16.png";
          text = "이력서란? 인사담당자에게 수많은 지원자들 중에서...";
          buttonText = "자세히 보러 가기!";
          buttonUrl = "https://www.work.go.kr/empSpt/empGuide/empTrend/resumeSelfIntroGuide.do";
          break;
        case '자소서 작성법':
          title = "자소서 작성법📝";
          imageUrl = "https://t1.daumcdn.net/cfile/tistory/231AB33B56D9771609";
          text = "자기소개서란? 자기소개서는 인사담당자가 지원자의 성격과 태도...";
          buttonText = "자세히 보러 가기!";
          buttonUrl = "https://www.work.go.kr/empSpt/empGuide/empTrend/resumeSelfIntroGuide.do?pageCode=2";
          break;
        case '면접전략':
          title = "면접전략";
          imageUrl = "https://www.work.go.kr/static/images/job/img-interview-3step.png";
          text = "1️⃣면접의 이해 및 프로세스 2️⃣면접 유형별 맞춤 전략..."
          buttonText = "자세히 보러 가기!";
          buttonUrl = "https://www.work.go.kr/empSpt/empGuide/empTrend/interviewGuide.do";
          break;
        case '채용 트렌드':
          title = "채용 트렌드";
          imageUrl = "https://www.work.go.kr/static/images/banner-2019-trend.png";
          text = "채용 문화 트렌드) 계속되는 직무중심의...";
          buttonText = "자세히 보러 가기!";
          buttonUrl = "https://www.work.go.kr/empSpt/empTrend/empTrendIncrease.do";
          break;
        case '블라인드 채용':
          title = "블라인드 채용";
          imageUrl = "https://www.work.go.kr/static/images/job/img-UI-FES-W03C01C.png";
          text = "블라인드 채용이란? 영어 블라인드(BLIND)라는 단어와 채용의 합성어로...";
          buttonText = "자세히 보러가기!";
          buttonUrl = "https://www.work.go.kr/empSpt/empBlind/retrieveEmpBlind.do";
          break;
        case '대상별취업가이드':
          title = "대상별취업가이드";
          imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC_7B1TeZhYZfAtUUR61VGF6Wq9ADfF02i98sjlX8kofDbc0SYKQ";
          text = "취업지원 프로그램 및 입사지원...";
          buttonText = "자세히 보러가기!";
          buttonUrl = "https://www.work.go.kr/empSpt/empGuide/empTrend/TargetGuide.do?level=2";
          break;
        case '입사서류 발급 안내':
          title = "입사서류 발급 안내";
          imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDt5tlLsU0S7BePJ7ZJV70vlBiJj4EyizEOzLVSeh8crjv3Cm_dw";
          text = "입사 준비에 필요한 서류를 보다 빠르고 편리하게 발급 받아보실 수 있습니다.";
          buttonText = "자세히 확인!";
          buttonUrl = "https://www.work.go.kr/empSpt/empEtc/enterDocIssueSvc.do";
          break;
        default:
          title = "404 ERROR";
          imageUrl = "https://previews.123rf.com/images/arcady31/arcady311011/arcady31101100012/8157731-404-error-sign.jpg";
          text = "404 Not Found.";
          buttonText = "Not Found.";
          buttonUrl = "localhost:8080/404.404";
          break;


      }
      agent.add(new Card({
        title: title,
        imageUrl: imageUrl,
        text: text,
        buttonText: buttonText,
        buttonUrl: buttonUrl,
      }));
      agent.add(customSuggestions);

    } else if (!gotTipType) {
      const tipTypeSuggestions = new Suggestion({
        title: "어떤 종류의 취업가이드를 원하세요?",
        reply: '이력서 작성법',

      });
      tipTypeSuggestions.addReply_('자소서 작성법');
      tipTypeSuggestions.addReply_('면접전략');
      tipTypeSuggestions.addReply_('채용 트렌드');
      tipTypeSuggestions.addReply_('블라인드 채용');
      tipTypeSuggestions.addReply_('대상별취업가이드');
      tipTypeSuggestions.addReply_('입사서류 발급 안내');
      agent.add(tipTypeSuggestions);
    }

  }

// [END employmentTipsIntent]

// [START cancelIntent]
  function cancelIntent(agent) {
    agent.add(customSuggestions);
  }

// [END cancelIntent]
// [START fallbackIntent]
  function fallbackIntent(agent) {
    agent.add('어이쿠, 뭔가 문제가 있는 것 같아요! ');
    agent.add(`잠시 후 다시 시도해주시겠어요?`);
    agent.add(customSuggestions);
  }

// [END fallbackIntent]


// [END set_intents]

// [START match_intents]
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcomeIntent);
  intentMap.set('Let me know FutureJob', futureJobIntent);
  intentMap.set('Let me know MajorInfo', majorInfoIntent);
  intentMap.set('Let me know RecruitInfo', recruitInfoIntent);
  intentMap.set('Let me know SchoolsInfo', schoolsInfoIntent);
  intentMap.set('Let me show EmploymentTips', employmentTipsIntent);
  intentMap.set('Cancel', cancelIntent);
  intentMap.set('Default Fallback Intent', fallbackIntent);
  agent.handleRequest(intentMap);
// [END match_intents]

});
