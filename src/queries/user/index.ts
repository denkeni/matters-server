import { Context } from 'definitions'
import { toGlobalId, connectionFromArray } from 'common/utils'

import rootUser from './rootUser'
import subscriptions from './subscriptions'
import followers from './followers'
import followees from './followees'
import isFollower from './isFollower'
import isFollowee from './isFollowee'
import likerId from './likerId'
import avatar from './avatar'
import badges from './badges'
import userNameEditable from './userNameEditable'
import articleCount from './articleCount'
import draftCount from './draftCount'
import commentCount from './commentCount'
// import oauthType from './oauthType'
import UserActivity from './userActivity'
import notification from './notification'
import followerCount from './followerCount'
import followeeCount from './followeeCount'
import subscriptionCount from './subscriptionCount'
import totalWordCount from './totalWordCount'
import unreadNoticeCount from './unreadNoticeCount'
import unreadFolloweeArticles from './unreadFolloweeArticles'
import unreadResponseInfoPopUp from './unreadResponseInfoPopUp'
import Recommendation from './recommendation'
import { MAT, Transaction } from './transaction'
import { boost, score } from './oss'
import profileCover from './profileCover'
import LIKE from './like'

export default {
  Query: {
    viewer: (root: any, _: any, { viewer }: Context) => viewer,
    user: rootUser
  },
  User: {
    id: ({ id }: { id: string }) =>
      id ? toGlobalId({ type: 'User', id }) : '',
    avatar,
    likerId,
    info: (root: any) => root,
    settings: (root: any) => root,
    status: (root: any) => (root.id ? root : null),
    activity: (root: any) => root,
    recommendation: (root: any) => root,
    oss: (root: any) => root,
    // hasFollowed,
    subscriptions,
    // quotations,
    followers,
    followees,
    isFollower,
    isFollowee
  },
  Recommendation,
  UserInfo: {
    avatar,
    badges,
    userNameEditable,
    email: ({ email }: { email: string }) => email && email.replace(/#/g, '@'),
    totalWordCount,
    profileCover
  },
  UserSettings: {
    language: (
      { language }: { language: string },
      _: any,
      { viewer }: Context
    ) => language,
    notification
  },
  UserActivity,
  MAT,
  LIKE,
  Transaction,
  UserStatus: {
    MAT: (root: any) => root,
    LIKE: (root: any) => root,
    // TODO: remove field in OSS
    invitation: () => ({
      reward: null,
      left: null,
      sent: connectionFromArray([], {})
    }),
    articleCount,
    // viewCount,
    draftCount,
    commentCount,
    // quotationCount
    followerCount,
    followeeCount,
    subscriptionCount,
    unreadNoticeCount,
    unreadFolloweeArticles,
    unreadResponseInfoPopUp,
    totalWordCount
  },
  UserOSS: {
    boost,
    score
  }
}
