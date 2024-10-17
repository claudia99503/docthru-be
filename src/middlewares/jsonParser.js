import bodyParser from 'body-parser';

const customJsonParser = (req, res, next) => {
  bodyParser.json()(req, res, (err) => {
    if (err) {
      console.error('JSON Parse Error:', err);
      // 본문이 비어있거나 'null'인 경우 빈 객체로 처리
      if (err.body === '' || err.body === 'null') {
        req.body = {};
        next();
      } else {
        // 그 외의 경우 기존 에러 처리
        next(err);
      }
    } else {
      next();
    }
  });
};

export default customJsonParser;
