import { EditOperation } from './EditOperation';
import ChangeType from './ChangeType';
import TNode from '../tree/TNode';

export class EditScript<T> {
  private editOperations: EditOperation<T>[] = [];
  private cost: number = 0;

  constructor(editOperations: EditOperation<T>[] | undefined, cost: number | undefined) {
    if (editOperations) this.editOperations = editOperations;
    if (cost) this.cost = cost;
  }

  getCost(): number {
    return this.cost;
  }

  appendDeletion(deletedNode: TNode<T>): void {
    this.editOperations.push(
      new EditOperation(ChangeType.DELETION, deletedNode.xPath(), undefined, deletedNode.copy())
    );
    this.cost += deletedNode.size();
  }

  [Symbol.iterator]() {
    return this.editOperations[Symbol.iterator]();
  }

  appendInsertion(insertedNode: TNode<T>): void {
    this.editOperations.push(
      new EditOperation(
        ChangeType.INSERTION,
        undefined,
        insertedNode.xPath(),
        undefined,
        insertedNode.copy(false)
      )
    );
    this.cost += insertedNode.size();
  }

  appendMove(oldPath: string, newPath: string, oldNode: TNode<T>, newNode: TNode<T>): void {
    this.editOperations.push(
      new EditOperation(ChangeType.MOVE, oldPath, newPath, oldNode.copy(false), newNode.copy(false))
    );
    this.cost++;
  }

  appendUpdate(oldNode: TNode<T>, updatedNode: TNode<T>) {
    this.editOperations.push(
      new EditOperation(
        ChangeType.UPDATE,
        updatedNode.xPath(),
        undefined,
        oldNode.copy(false),
        updatedNode.copy(false)
      )
    );
    this.cost++;
  }

  deletions() {
    return this.editOperations.filter((editOp) => editOp.isDeletion());
  }

  insertions() {
    return this.editOperations.filter((editOp) => editOp.isInsertion());
  }

  moves() {
    return this.editOperations.filter((editOp) => editOp.isMove());
  }

  size() {
    return this.editOperations.length;
  }

  updates() {
    return this.editOperations.filter((editOp) => editOp.isUpdate());
  }
}
