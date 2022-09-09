import { FeatherModule, Inject } from '../declarations';
import { ModuleLoader } from '../';

class TestService1 {
  foo(): string {
    return 'foo';
  }
}

class TestService2 {
  @Inject(TestService1)
  private s1!: TestService1;

  foobar(): string {
    return this.s1.foo() + 'bar';
  }
}
@FeatherModule({
  declares: [TestService1],
})
class Module1Service {}
@FeatherModule({
  declares: [TestService1, TestService2],
})
class Module2Services {}
@FeatherModule({
  imports: [Module2Services],
})
class ModuleJustImport {}

describe('Module loader', () => {
  it('should load a single service', () => {
    const module = ModuleLoader.load(Module1Service);
    const t1 = module.get(TestService1);
    expect(t1.foo()).toEqual('foo');
  });

  it('should load services with injections', () => {
    const module = ModuleLoader.load(Module2Services);
    const t1 = module.get(TestService1);
    const t2 = module.get(TestService2);
    expect(t1.foo() + t2.foobar()).toEqual('foofoobar');
  });

  it('should load services from other modules', () => {
    const module = ModuleLoader.load(ModuleJustImport);
    const t1 = module.get(TestService1);
    const t2 = module.get(TestService2);
    expect(t1.foo() + t2.foobar()).toEqual('foofoobar');
  });
});
