export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  const passwordRegex = /^([a-z]|[A-Z]|[0-9]|[!@#$%^&*])+$/;
  return (
    passwordRegex.test(password) &&
    password.length >= 8 &&
    password.length <= 14
  );
};

export const isValidNickname = (nickname) => {
  return nickname.length >= 1 && nickname.length <= 20;
};

export const validateUserInput = (nickname, email, password) => {
  const errors = [];

  if (!nickname) {
    errors.push('닉네임을 입력해 주세요');
  } else if (!isValidNickname(nickname)) {
    errors.push('닉네임은 1-20자 사이여야 합니다');
  }

  if (!email) {
    errors.push('이메일을 입력해 주세요');
  } else if (!isValidEmail(email)) {
    errors.push('유효한 이메일이 아닙니다');
  }

  if (!password) {
    errors.push('비밀번호를 입력해 주세요');
  } else if (!isValidPassword(password)) {
    errors.push(
      '비밀번호는 8-14자의 영문 대소문자, 숫자, 특수문자(!@#$%^&*)로 구성되어야 합니다'
    );
  }

  return errors;
};
