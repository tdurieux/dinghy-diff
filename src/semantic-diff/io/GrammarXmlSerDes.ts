import Grammar from '../grammar/Grammar';
import SerDes from './SerDes';
import UnimplementedError from '../error/UnimplementedError';
import xmldom from '@xmldom/xmldom';
import GrammarNode from '../grammar/GrammarNode';
import IGrammarDeserializationOptions from './options/IGrammarDeserializationOptions';
import ComparisonType from '../grammar/ComparisonType';
import WeightedCV from '../grammar/WeightedCV';
import NodeType from '../grammar/NodeType';
import { getElementChildren, getTextContentWithoutChildren, RUNNING_IN_BROWSER } from '../Util';
import MalformedGrammarError from '../error/MalformedGrammarError';

export default class GrammarXmlSerDes extends SerDes<Grammar> {
  public constructor(private options: IGrammarDeserializationOptions) {
    super();
  }

  public override buildString(obj: Grammar): string {
    throw new UnimplementedError();
  }

  public override parseFromString(xml: string, includeChildren: boolean = true): Grammar {
    const root: Element = (RUNNING_IN_BROWSER ? new DOMParser() : new xmldom.DOMParser())
      .parseFromString(xml, 'text/xml')
      .childNodes.item(0) as Element;
    let inners: GrammarNode[] = [];
    let leaves: GrammarNode[] = [];
    for (const element of getElementChildren(root)) {
      switch (element.localName) {
        case this.options.GRAMMAR_INNERS_TAG:
          inners = this.parseGrammarNodes(element, NodeType.INNER);
          break;
        case this.options.GRAMMAR_LEAVES_TAG:
          leaves = this.parseGrammarNodes(element, NodeType.LEAF);
          break;
        default:
          throw new MalformedGrammarError();
      }
    }
    return new Grammar(inners, leaves);
  }

  private parseGrammarNodes(xmlDom: Element, nodeType: NodeType): GrammarNode[] {
    const grammarNodes = [];

    for (const grammarNodeElement of getElementChildren(xmlDom)) {
      const weightedCvs = [];

      const ordered = grammarNodeElement.hasAttribute(this.options.GRAMMAR_NODE_ORDERED_KEY)
        ? grammarNodeElement.getAttribute(this.options.GRAMMAR_NODE_ORDERED_KEY) == 'true'
        : undefined;

      for (const weightedCvElement of getElementChildren(grammarNodeElement)) {
        // TODO make default weight explicit

        let weight;
        if (
          weightedCvElement.hasAttribute(this.options.GRAMMAR_NODE_WEIGHT_KEY) &&
          weightedCvElement.getAttribute(this.options.GRAMMAR_NODE_WEIGHT_KEY) != null
        ) {
          let parsed = parseFloat(
            weightedCvElement.getAttribute(this.options.GRAMMAR_NODE_WEIGHT_KEY)!!
          );
          weight = isNaN(parsed) ? undefined : parsed;
        }

        const hasComparisonType = weightedCvElement.hasAttribute(
          this.options.GRAMMAR_NODE_COMPARISON_TYPE_KEY
        );
        const comparisonType =
          ComparisonType[
            (hasComparisonType
              ? weightedCvElement.getAttribute(this.options.GRAMMAR_NODE_COMPARISON_TYPE_KEY)
              : 'EQ') as keyof typeof ComparisonType
          ];
        const path = getTextContentWithoutChildren(weightedCvElement) ?? '';
        weightedCvs.push(new WeightedCV(path, weight, comparisonType));
      }
      grammarNodes.push(
        new GrammarNode(nodeType, grammarNodeElement.localName, weightedCvs, ordered)
      );
    }
    return grammarNodes;
  }
}
