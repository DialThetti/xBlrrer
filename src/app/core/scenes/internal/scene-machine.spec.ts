import { Scene } from './scene';
import { SceneMachine } from './scene-machine';

describe('SceneMachine', () => {
    let sceneMachine;
    beforeEach(() => {
        sceneMachine = new SceneMachine();
    });
    it('should be created', () => {
        expect(sceneMachine).not.toBeUndefined();
        expect(sceneMachine.size).toEqual(0);
    });
    describe('addScene', () => {
        it('should add scenes to scenelist', () => {
            sceneMachine.addScene(() => ({ isLoadingScene: false, name: 's1' } as Scene));
            expect(sceneMachine.size).toEqual(1);
            expect(sceneMachine.loadingScene).toBeUndefined();
        });
        it('should not add loading scenes to scenelist', () => {
            sceneMachine.addScene(() => ({ isLoadingScene: true, name: 's2' } as Scene));
            expect(sceneMachine.size).toEqual(1);
            expect(sceneMachine.loadingScene.name).toEqual('s2');
        });
    });
    describe('addScenes', () => {
        it('should add scenes to scenelist', () => {
            sceneMachine.addScenes([
                () => ({ isLoadingScene: false, name: 's1' } as Scene),
                () => ({ isLoadingScene: true, name: 's2' } as Scene),
            ]);
            expect(sceneMachine.size).toEqual(2);
            expect(sceneMachine.loadingScene.name).toEqual('s2');
        });
    });

    it('should return the currentScene', () => {
        sceneMachine.addScenes([
            () => ({ isLoadingScene: false, name: 's1' } as Scene),
            () => ({ isLoadingScene: true, name: 's2' } as Scene),
        ]);
        sceneMachine.currentSceneName = 's1';
        expect(sceneMachine.currentScene.name).toEqual('s1');
        sceneMachine.currentSceneName = 'loadingScene';
        expect(sceneMachine.currentScene.name).toEqual('s2');
    });

    describe('setScene', () => {
        it('should switch to s1 without loading', async () => {
            sceneMachine.addScenes([
                () =>
                ({
                    isLoadingScene: false,
                    name: 's1',
                    load: () => {
                        /* NOOP */
                    },
                    start: () => {
                        /* NOOP */
                    },
                } as Scene),
                () => ({ isLoadingScene: true, name: 's2' } as Scene),
            ]);
            await sceneMachine.setScene('s1', false);
            expect(sceneMachine.currentSceneName).toEqual('s1');
        });
        it('should switch to s1 with loading', (done) => {
            sceneMachine.currentSceneName = 'other';
            sceneMachine.addScenes([
                () =>
                ({
                    isLoadingScene: false,
                    name: 's1',
                    load: () => {
                        /* NOOP */
                    },
                    start: () => {
                        /* NOOP */
                    },
                } as Scene),
                () => ({ isLoadingScene: true, name: 's2' } as Scene),
            ]);
            sceneMachine.setScene('s1').then(() => {
                expect(sceneMachine.currentSceneName).toEqual('s1');
                done();
            });
            expect(sceneMachine.currentSceneName).toEqual('loadingScene');
        });
    });
});
