import express from 'express';
import {
  getChallenges,
  getChallengeById,
  patchChallengeById,
  deleteChallengeById,
  getChallengesUrl,
  postChallengeParticipate,
  getApplication,
  createChallenge,
} from '../controllers/challengeController.js';
import { authenticateAccessToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /challenges:
 *   get:
 *     summary: 챌린지 목록 조회
 *     description: 페이지네이션, 정렬 및 필터링된 챌린지 목록을 반환합니다.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: 페이지 번호 (기본값: 1)
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         required: false
 *         description: 페이지 당 항목 수 (기본값: 10)
 *         schema:
 *           type: integer
 *       - in: query
 *         name: orderByField
 *         required: false
 *         description: 정렬 기준 필드 (기본값: id)
 *         schema:
 *           type: string
 *       - in: query
 *         name: orderByDir
 *         required: false
 *         description: 정렬 방향 (asc 또는 desc, 기본값: asc)
 *         schema:
 *           type: string
 *       - in: body
 *         name: filters
 *         description: 필터 조건
 *         schema:
 *           type: object
 *           properties:
 *             field:
 *               type: array
 *               items:
 *                 type: string
 *             docType:
 *               type: string
 *             progress:
 *               type: boolean
 *     responses:
 *       200:
 *         description: 챌린지 목록
 *       500:
 *         description: 서버 오류
 */
router.get('/', getChallenges);

router.get('/application', getApplication);
router.post('/application', authenticateAccessToken, createChallenge);
/**
 * @swagger
 * /challenges/{challengeId}:
 *   get:
 *     summary: 특정 챌린지 조회
 *     description: ID로 특정 챌린지를 조회합니다.
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         description: 챌린지 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 챌린지 상세 정보
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/:challengeId', authenticateAccessToken, getChallengeById);

/**
 * @swagger
 * /challenges/{challengeId}:
 *   patch:
 *     summary: 챌린지 수정
 *     description: 관리자가 챌린지를 수정합니다.
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         description: 챌린지 ID
 *         schema:
 *           type: string
 *       - in: body
 *         name: updateData
 *         description: 수정할 데이터
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             progress:
 *               type: boolean
 *     responses:
 *       200:
 *         description: 수정된 챌린지 정보
 *       403:
 *         description: 관리자 권한 부족
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.patch('/:challengeId', authenticateAccessToken, patchChallengeById);

/**
 * @swagger
 * /challenges/{challengeId}:
 *   delete:
 *     summary: 챌린지 삭제
 *     description: 관리자가 챌린지를 삭제합니다.
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         description: 챌린지 ID
 *         schema:
 *           type: string
 *       - in: body
 *         name: reason
 *         description: 삭제 사유
 *         schema:
 *           type: object
 *           properties:
 *             reason:
 *               type: string
 *     responses:
 *       204:
 *         description: 챌린지 삭제 성공
 *       403:
 *         description: 관리자 권한 부족
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete('/:challengeId', authenticateAccessToken, deleteChallengeById);

/**
 * @swagger
 * /challenges/{challengeId}/original:
 *   get:
 *     summary: 챌린지 URL 조회
 *     description: 특정 챌린지의 URL을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         description: 챌린지 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 챌린지 URL 정보
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/:challengeId/original', getChallengesUrl);

/**
 * @swagger
 * /challenges/{challengeId}/participations:
 *   post:
 *     summary: 챌린지 참여
 *     description: 사용자가 챌린지에 참여합니다.
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         description: 챌린지 ID
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 챌린지 참여 성공
 *       400:
 *         description: 잘못된 요청 (예: 마감된 챌린지)
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.post(
  '/:challengeId/participations',
  authenticateAccessToken,
  postChallengeParticipate
);

export default router;
