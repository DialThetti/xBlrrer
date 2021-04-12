# Scenes Package

This package defines all responsibilities to render different scenes and serve them as a state machine.

# Development

A Game should implement a set of Scenes, which are then registered in a SceneMachine like this:

```
const sceneMachine = new SceneMachine(this.context).addScenes([
        () => new LoadingScene(),
        () => new GameScene('forest-1'),
    ]);
```

You should register exactly one LoadingScene, which is a scene with `isLoadingScene = true` to ensure correct functionality.
