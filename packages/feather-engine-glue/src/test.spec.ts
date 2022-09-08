import { Inject } from './injectable';
import { FeatherModule, ModuleLoader } from './module-loader';
class TestService1 {
  foo(): number {
    return 1;
  }
}

class TestService2 {
  @Inject(TestService1)
  private s1!: TestService1;

  foo(): number {
    return 1 + this.s1.foo();
  }
}

@FeatherModule({
  declares: [TestService1],
})
class MyTestModule1 {}

describe('', () => {
  it('', () => {
    const module = ModuleLoader.load(MyTestModule1);
    const t1 = module.get(TestService1);
    expect(t1.foo()).toEqual(1);
  });
});

@FeatherModule({ declares: [TestService1, TestService2] })
class MyTestModule {}

describe('', () => {
  it('', () => {
    const module = ModuleLoader.load(MyTestModule);
    const t1 = module.get(TestService1);
    const t2 = module.get(TestService2);
    expect(t1.foo() + t2.foo()).toEqual(3);
  });
});
