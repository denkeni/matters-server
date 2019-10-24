import { CACHE_KEYWORD, NODE_TYPES } from 'common/enums'
import {
  ActionFailedError,
  AuthenticationError,
  UserNotFoundError
} from 'common/errors'
import { fromGlobalId } from 'common/utils'
import { MutationToFollowUserResolver } from 'definitions'

const resolver: MutationToFollowUserResolver = async (
  _,
  { input: { id } },
  { viewer, dataSources: { userService, notificationService } }
) => {
  if (!viewer.id) {
    throw new AuthenticationError('visitor has no permission')
  }

  const { id: dbId } = fromGlobalId(id)

  if (viewer.id === dbId) {
    throw new ActionFailedError('cannot follow yourself')
  }

  const user = await userService.dataloader.load(dbId)
  if (!user) {
    throw new UserNotFoundError('target user does not exists')
  }

  await userService.follow(viewer.id, user.id)

  // trigger notificaiton
  notificationService.trigger({
    event: 'user_new_follower',
    actorId: viewer.id,
    recipientId: user.id
  })

  // Add custom data for cache invalidation
  user[CACHE_KEYWORD] = [
    {
      id: viewer.id,
      type: NODE_TYPES.user
    },
    {
      id: user.id,
      type: NODE_TYPES.user
    }
  ]

  return user
}

export default resolver
