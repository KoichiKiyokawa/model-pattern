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
  Query,
  limit as limitFn,
  orderBy as orderByFn,
  updateDoc,
  startAt,
  QueryConstraint,
  where,
  WhereFilterOp,
} from 'firebase/firestore'
import { firestore } from '../../modules/firebase'

export class BaseRepository<T> {
  get collectionName(): string {
    throw new Error('you should override collectionName')
  }

  get collectionReference() {
    return collection(firestore, this.collectionName) as CollectionReference<T>
  }

  protected getDocById(id: string) {
    return doc(firestore, `${this.collectionReference.path}/${id}`) as DocumentReference<T>
  }

  async find(id: string) {
    const doc = this.getDocById(id)
    const snap = await getDoc(doc)
    return { ...snap.data(), id: snap.id }
  }

  async all({
    limit,
    orderBy,
    offset,
    whereConditions,
  }: {
    limit?: number
    orderBy?: keyof T
    offset?: number
    whereConditions?: [keyof T, WhereFilterOp, unknown][]
  }) {
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

  async create(data: T) {
    const doc = await addDoc(this.collectionReference, data)
    return doc.id
  }

  async update(id: string, data: Partial<T>) {
    await updateDoc(this.getDocById(id), data)
  }

  async delete(id: string) {
    await deleteDoc(this.getDocById(id))
  }
}
