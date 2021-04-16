import { BaseRepository } from '../base/repository'

export class PostRepository extends BaseRepository<Post> {
  get collectionName() {
    return 'posts'
  }

  async findByUserId(userId: string): Promise<Post> {
    const [res] = await super.all({ limit: 1, whereConditions: [['userId', '==', userId]] })
    return res
  }

  async specificUsers(userId: string): Promise<Post[]> {
    return await super.all({ whereConditions: [['userId', '==', userId]] })
  }

  async create(data: Omit<Post, 'createdAt'>) {
    return super.create({ ...data, createdAt: new Date() })
  }
}
