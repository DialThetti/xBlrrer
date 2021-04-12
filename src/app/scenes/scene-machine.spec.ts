import { expect } from 'chai';
import { mock } from 'ts-mockito';
import Scene from './scene';
import SceneMachine from './scene-machine';

describe('SceneMachine', () => {
    let sceneMachine;
    beforeEach(() => {
        const context = mock<CanvasRenderingContext2D>();
        sceneMachine = new SceneMachine(context);
    });
    it('should be created', () => {
        expect(sceneMachine).not.to.be.undefined;
        expect(sceneMachine.size).to.equal(0);
    });
    describe('addScene', () => {
        it('should add scenes to scenelist', () => {
            sceneMachine.addScene(() => ({ isLoadingScene: false, name: 's1' } as Scene));
            expect(sceneMachine.size).to.equal(1);
            expect(sceneMachine.loadingScene).to.be.undefined;
        });
        it('should not add loading scenes to scenelist', () => {
            sceneMachine.addScene(() => ({ isLoadingScene: true, name: 's2' } as Scene));
            expect(sceneMachine.size).to.equal(1);
            expect(sceneMachine.loadingScene.name).to.equals('s2');
        });
    });
    describe('addScenes', () => {
        it('should add scenes to scenelist', () => {
            sceneMachine.addScenes([
                () => ({ isLoadingScene: false, name: 's1' } as Scene),
                () => ({ isLoadingScene: true, name: 's2' } as Scene),
            ]);
            expect(sceneMachine.size).to.equal(2);
            expect(sceneMachine.loadingScene.name).to.equals('s2');
        });
    });

    it('should return the currentScene', () => {
        sceneMachine.addScenes([
            () => ({ isLoadingScene: false, name: 's1' } as Scene),
            () => ({ isLoadingScene: true, name: 's2' } as Scene),
        ]);
        sceneMachine.currentSceneName = 's1';
        expect(sceneMachine.currentScene.name).to.equals('s1');
        sceneMachine.currentSceneName = 'loadingScene';
        expect(sceneMachine.currentScene.name).to.equals('s2');
    });

    describe('setScene', () => {
        it('should switch to s1 without loading', async () => {
            sceneMachine.addScenes([
                () => ({ isLoadingScene: false, name: 's1', load: () => {}, start: () => {} } as Scene),
                () => ({ isLoadingScene: true, name: 's2' } as Scene),
            ]);
            await sceneMachine.setScene('s1', false);
            expect(sceneMachine.currentSceneName).to.equals('s1');
        });
        it('should switch to s1 with loading', (done) => {
            sceneMachine.currentSceneName = 'other';
            sceneMachine.addScenes([
                () => ({ isLoadingScene: false, name: 's1', load: () => {}, start: () => {} } as Scene),
                () => ({ isLoadingScene: true, name: 's2' } as Scene),
            ]);
            sceneMachine.setScene('s1').then(() => {
                expect(sceneMachine.currentSceneName).to.equals('s1');
                done();
            });
            expect(sceneMachine.currentSceneName).to.equals('loadingScene');
        });
    });
});
