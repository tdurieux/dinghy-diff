import AbstractCachingExtractor from './AbstractCachingExtractor';
import TNode from '../../tree/TNode';

export default class PropertyExtractor extends AbstractCachingExtractor<Map<string, string | nu>> {

  protected computeValue(node: TNode): void {
    if (node.isPropertyNode()) return; // do not set value
    const grammarNode = node.getGrammarNode();
    const propertyMap = new Map<string, string | nu>();
    for (const wcv of grammarNode.weightedCVs) {
      propertyMap.set(wcv.path, node.accessProperty(wcv.path));
    }
    this.valueMap.set(node, propertyMap);
  }

}