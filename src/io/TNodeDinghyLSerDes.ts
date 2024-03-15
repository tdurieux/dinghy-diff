import SerDes from './SerDes';
import ISerDesOptions from './options/ISerDesOptions';
import { Nullable } from '../Types';
import TNode from '../tree/TNode';
import TNodeBuilder from '../tree/TNodeBuilder';
import { dockerfileParser, coreTypes, shellParser } from '@tdurieux/dinghy';
import GrammarNode from '../grammar/GrammarNode';
import NodeType from '../grammar/NodeType';
import { AbstractNode } from '@tdurieux/dinghy/build/core/core-types';

export default abstract class TNodeDinghyLSerDes<T> extends SerDes<TNode<T>> {
  public constructor(private options: ISerDesOptions) {
    super();
  }

  protected abstract getData(
    type: string,
    text: Nullable<string>,
    ast: coreTypes.AbstractNode<any>
  ): T;

  public override buildString(node: TNode<T>): string {
    const jsonString = JSON.stringify(node);
    return jsonString;
  }

  public parseAST(ast: coreTypes.AbstractNode<any>, includeChildren = true): TNode<T> {
    const type = ast.type;
    // children
    const children = [];
    for (const childElement of ast.children) {
      if (childElement == null) continue;
      children.push(this.parseAST(childElement, includeChildren));
    }
    const text = ast instanceof coreTypes.AbstractValueNode ? ast.value : ast.type;

    let nodeType = NodeType.INNER;
    if (ast instanceof coreTypes.AbstractValueNode) {
      nodeType = NodeType.LEAF;
    }

    const builder = new TNodeBuilder<T>()
      .grammarNode(new GrammarNode(nodeType, type, []))
      .data(this.getData(type, text, ast))
      .children(children);

    return builder.build();
  }

  public override parseFromString(code: string, includeChildren: boolean = true): TNode<T> {
    let root: AbstractNode<any>;
    if (code.includes('FROM')) {
      root = dockerfileParser.parseDocker(code);
    } else {
      root = shellParser.parseShell(code);
    }
    return this.parseAST(root, includeChildren);
  }
}
