export default abstract class SerDes<T> {
  public abstract parseFromString(xml: string, includeChildren: boolean): T;

  public abstract buildString(obj: T): string;
}
