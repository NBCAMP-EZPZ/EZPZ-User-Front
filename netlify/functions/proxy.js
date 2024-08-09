const fetch = require('node-fetch');

exports.handler = async (event) => {
  const path = event.path;
  const url = `https://ezpz-alb-1989368963.ap-northeast-2.elb.amazonaws.com${path}`; // 실제 백엔드 서버의 URL로 요청을 전달

  const response = await fetch(url, {
    method: event.httpMethod,
    headers: {
      ...event.headers, // 기존 요청 헤더를 포함
      host: 'user.ezpzz.store',  // 'Host' 헤더를 설정
    },
    body: event.body, // 요청 본문을 그대로 전달
  });

  const responseBody = await response.text(); // 응답 본문을 텍스트로 변환

  return {
    statusCode: response.status, // 원본 응답 상태 코드 반환
    headers: {
      ...response.headers, // 원본 응답 헤더를 그대로 반환
      'Access-Control-Allow-Origin': '*', // CORS 허용
    },
    body: responseBody, // 원본 응답 본문 반환
  };
};