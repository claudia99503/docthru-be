import * as authService from '../services/userServices.js';

export const register = async (req, res, next) => {
  try {
    const { nickName, email, password } = req.body;

    const user = await authService.registerUser(nickName, email, password);
    res.status(201).json({ message: '회원가입 성공', userId: user.id });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken, userId } = await authService.loginUser(
      email,
      password
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 경험에 따라 다르게 수정예정
    });
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 얘도 7일정도면 적당할지 모르겠으나.. 수정 필요할수도
    });

    res.json({ message: '로그인 성공' });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user.userId);
    res.clearCookie('accessToken').clearCookie('refreshToken');
    res.json({ message: '로그아웃 성공' });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new UnauthorizedException('리프레시 토큰이 없습니다.');
  }

  try {
    const user = await authService.verifyRefreshToken(refreshToken);
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err) => {
      if (err) {
        throw new UnauthorizedException('리프레시 토큰이 만료되었습니다.');
      }

      const accessToken = generateAccessToken(user.id);
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });

      res.json({ message: '토큰 갱신 성공' });
    });
  } catch (error) {
    next(error);
  }
};

export const getOngoingChallenges = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const ongoingChallenges = await authService.getOngoingChallenges(userId);
    res.json(ongoingChallenges);
  } catch (error) {
    next(error);
  }
};

export const getCompletedChallenges = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const completedChallenges = await authService.getCompletedChallenges(
      userId
    );
    res.json(completedChallenges);
  } catch (error) {
    next(error);
  }
};

export const getAppliedChallenges = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const appliedChallenges = await authService.getAppliedChallenges(userId);
    res.json(appliedChallenges);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await authService.getCurrentUser(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await authService.getUserById(id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
