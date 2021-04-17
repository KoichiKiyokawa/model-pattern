import { ValidatableEntity } from '../base/entity'

export class PostEntity extends ValidatableEntity<Post> {
  constructor(private readonly data: Post) {
    super()
  }

  validate(): typeof PostEntity.prototype.errors {
    this.errors = {}
    if (this.data.title.length > 30) this.addError('title', 'タイトルは30文字以下にしてください')
    if (this.data.body.length > 100000) this.addError('body', '本文が長すぎます')
    if (this.data.createdAt > new Date()) this.addError('createdAt', '未来の日付は選択できません')
    return this.errors
  }
}

// example
const post: Post = {
  title: 'hogehogehogggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
  body: 'hogehoggggggggggggggggggggggg',
  createdAt: new Date(),
  userId: 'user',
}

const err = new PostEntity(post).validate()
console.log(err)
