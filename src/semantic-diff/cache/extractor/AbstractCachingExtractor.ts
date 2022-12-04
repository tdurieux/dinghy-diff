import TNode from '../../tree/TNode';

export default abstract class AbstractCachingExtractor<T> {

  protected valueMap = new Map<TNode, T>();

  public get(node: TNode): T {
    if (!this.valueMap.has(node)) {
      this.computeValue(node);
    }
    return this.valueMap.get(node)!!;
  }

  protected abstract computeValue(node: TNode): void;
}