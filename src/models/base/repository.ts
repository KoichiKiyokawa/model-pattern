import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  limit as limitFn,
  orderBy as orderByFn,
  updateDoc,
  startAt,
  QueryConstraint,
  where,
  WhereFilterOp,
} from 'firebase/firestore'
import { firestore } from '../../modules/firebase'

export abstract class BaseRepository<T> {
  abstract get collectionName(): string

  get collectionReference(): CollectionReference<T> {
    return collection(firestore, this.collectionName) as CollectionReference<T>
  }

  protected getDocById(id: string): DocumentReference<T> {
    return doc(firestore, `${this.collectionReference.path}/${id}`) as DocumentReference<T>
  }

  async find(id: string): Promise<(T & { id: string }) | undefined> {
    const doc = this.getDocById(id)
    const snap = await getDoc(doc)
    const data = snap.data()
    if (data === undefined) return undefined

    return { ...data, id: snap.id }
  }

  async all(options?: {
    limit?: number
    orderBy?: keyof T
    offset?: number
    whereConditions?: [keyof T, WhereFilterOp, unknown][]
  }): Promise<(T & { id: string })[]> {
    const { limit, orderBy, offset, whereConditions } = options ?? {}
    const queries: QueryConstraint[] = []
    if (limit) queries.push(limitFn(limit))
    if (orderBy) queries.push(orderByFn(orderBy as string))
    if (offset) queries.push(startAt(offset))
    if (whereConditions) {
      queries.push(...whereConditions.map((cond) => where(...(cond as [string, WhereFilterOp, unknown]))))
    }

    const snap = await getDocs<T>(query(this.collectionReference, ...queries))
    return snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  }

  async create(data: T): Promise<string> {
    const doc = await addDoc(this.collectionReference, data)
    return doc.id
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    await updateDoc(this.getDocById(id), data)
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(this.getDocById(id))
  }
}
