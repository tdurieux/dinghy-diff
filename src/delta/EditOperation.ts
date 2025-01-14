import ChangeType from './ChangeType';
import TNode from '../tree/TNode';

export class EditOperation<T> {
  constructor(
    public type: ChangeType,
    public oldPath?: string,
    public newPath?: string,
    public oldContent?: TNode<T>,
    public newContent?: TNode<T>
  ) {}

  isDeletion(): Boolean {
    return this.type === ChangeType.DELETION;
  }

  isInsertion(): Boolean {
    return this.type === ChangeType.INSERTION;
  }

  isMove(): Boolean {
    return this.type === ChangeType.MOVE;
  }

  isUpdate(): Boolean {
    return this.type === ChangeType.UPDATE;
  }

  toString(): string {
    return (
      this.type +
      ' ' +
      (this.oldPath !== null ? this.oldPath + ' ' : '') +
      (this.oldPath !== null && this.newPath !== null ? '-> ' : '') +
      (this.newPath !== null ? this.newPath + ' ' : '') +
      (this.newContent !== null ? this.newContent + ' ' : '')
    );
  }
}
