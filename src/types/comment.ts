export default /* GraphQL */ `
  extend type Mutation {
    putComment(input: PutCommentInput!): Comment!
    pinComment(input: PinCommentInput!): Comment!
    deleteComment(input: DeleteCommentInput!): Boolean
    reportComment(input: ReportCommentInput!): Boolean
    voteComment(input: VoteCommentInput!): Comment!
    unvoteComment(input: UnvoteCommentInput!): Comment!
  }

  type Comment implements Node {
    id: ID!
    state: CommentState!
    createdAt: DateTime!
    # Original article of this comment
    article: Article!
    content: String
    author: User!
    pinned: Boolean!
    upvotes: Int!
    downvotes: Int!
    quote: Boolean!
    myVote: Vote
    mentions: [User!]
    comments(input: ConnectionArgs!): CommentConnection!
    parentComment: Comment
  }

  extend type Article {
    commentCount: Int!
    pinCommentLimit: Int!
    pinCommentLeft: Int!
    pinnedComments: [Comment!]
    comments(input: CommentsInput!): CommentConnection!
  }

  type CommentConnection {
    pageInfo: PageInfo!
    edges: [CommentEdge!]
  }

  type CommentEdge {
    cursor: String!
    node: Comment!
  }

  input PutCommentInput {
    comment: CommentInput!
    id: ID
  }

  input CommentInput {
    content: String!
    quotation: String
    articleId: ID!
    parentId: ID
    mentions: [ID!]
  }

  input CommentsInput {
    author: ID
    quote: Boolean
    sort: CommentSort
    after: String
    first: Int
    parent: Boolean
  }

  enum CommentSort {
    oldest
    newest
    upvotes
  }

  input PinCommentInput {
    id: ID!
  }

  input DeleteCommentInput {
    id: ID!
  }

  input ReportCommentInput {
    id: ID!
    category: ID!
    description: String!
    assetIds: [ID!]
    contact: String
  }

  input VoteCommentInput {
    vote: Vote!
    id: ID!
  }

  input UnvoteCommentInput {
    id: ID!
  }

  enum Vote {
    up
    down
  }

  enum CommentState {
    active
    archived
    banned
  }
`
