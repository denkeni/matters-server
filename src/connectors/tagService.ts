// external
import DataLoader from 'dataloader'
// internal
import { GQLSearchInput, ItemData } from 'definitions'
import { BaseService } from './baseService'
import { BATCH_SIZE } from 'common/enums'

export class TagService extends BaseService {
  constructor() {
    super('tag')
    this.dataloader = new DataLoader(this.baseFindByIds)
  }

  create = async ({
    content
  }: {
    content: string
  }): Promise<{ id: string; content: string }> => {
    const [tag] = await this.findByContent(content)
    if (tag) {
      return tag
    }
    return await this.baseCreate({
      content
    })
  }

  search = async ({ key }: GQLSearchInput) =>
    await this.knex(this.table)
      .where('content', 'like', `%${key}%`)
      .limit(100)

  createArticleTags = async ({
    articleId,
    tagIds = []
  }: {
    [key: string]: any
  }) => {
    const items = tagIds.map((tagId: string) => ({ articleId, tagId }))
    return this.baseBatchCreate(items, 'article_tag')
  }

  findByContent = async (content: string) =>
    this.knex(this.table)
      .select()
      .where({ content })

  recommendTags = async ({
    limit = BATCH_SIZE,
    offset = 0
  }: {
    limit?: number
    offset?: number
  }) =>
    await this.knex('tag_count_view')
      .select()
      .orderBy('tag_score', 'desc')
      .limit(limit)
      .offset(offset)

  /**
   * Count tags by a given tag text.
   */
  countArticles = async ({ id: tagId }: { id: string }): Promise<number> => {
    const result = await this.knex('article_tag')
      .countDistinct('article_id')
      .where({ tagId })
      .first()
    return parseInt(result.count, 10)
  }

  findArticleIds = async (tagId: string) => {
    const result = await this.knex
      .select('article_id')
      .from('article_tag')
      .where({ tagId })

    return result.map(({ articleId }: { articleId: string }) => articleId)
  }
}
