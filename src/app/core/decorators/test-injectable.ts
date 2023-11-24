function InjectableTest<T extends { new (...args: any[]): {} }>(
  key: string,
  map: Map<string, {}>,
) {
  return (constructor: T) => {
    map.set(key, new constructor());
  };
}

const map = new Map<string, {}>();
@InjectableTest('test', map)
export class StoredClass {
  field = 'text';
}

export function InjectTest(key: string, map: Map<string, {}>) {
  return function (target: any, propertyKey: string) {
    target[propertyKey] = map.get(key);
  };
}

export class TestDI {
  @InjectTest('test', map) injection!: string;

  constructor() {
    console.log(this.injection);
  }
}
