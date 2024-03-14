import IData from './IData';
import { Nullable } from '../Types';
import ICopyable from './ICopyable';
import { coreTypes } from '@tdurieux/dinghy';

export default class ASTData implements IData, ICopyable<ASTData> {
  constructor(
    private _type: string,
    private _text: Nullable<string>,
    public node: coreTypes.AbstractNode<any>
  ) {}

  equals(other: any): boolean {
    if (other == null) return false;
    if (other === this) return true;

    // instanceof check?
    if (!(other instanceof ASTData)) return false;

    if (this.label != other.label) return false;
    if (this.text != other.text) return false;
    // all properties equal
    return true;
  }

  get label(): string {
    return this._type;
  }

  get text(): Nullable<string> {
    return this._text;
  }

  set text(text: Nullable<string>) {
    this._text = text;
  }

  get attributes(): Map<string, string> {
    return new Map();
  }

  copy(): ASTData {
    return new ASTData(this._type, this._text, this.node);
  }
}
