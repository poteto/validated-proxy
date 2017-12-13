const { assign } = Object;

export default class Buffer {
  private target: object;
  private changes: object;
  [propName: string]: any;

  constructor(target: object) {
    this.target = target;
    this.changes = {};
  }

  public set<T>(key: PropertyKey, value: T): T {
    this.changes[key] = value;
    return value;
  }

  public execute(): object {
    return assign(this.target, this.changes);
  }
}
