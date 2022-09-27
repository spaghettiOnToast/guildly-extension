# Guildly Extension

## 👩🏾‍💻 Development

To contribute to this repository please read the contributing guidelines first.

To setup the repo on your machine, first clone it, then just run:

```
yarn      # setup dependencies
yarn dev  # run build process for all packages in watch mode
```

Now you need to load the locally built chrome extension into your browser, by loading an unpacked extension from path packages/extension/dist:

1. Open the Extension Management page by navigating to chrome://extensions.
2. Enable Developer Mode by clicking the toggle switch next to Developer mode.
3. Click the Load unpacked button and select the extension directory.

<img src="https://camo.githubusercontent.com/bba6e775823f099d509dedf7065e560de448e5123e3d9f71e60d843624b1e1f3/68747470733a2f2f77642e696d6769782e6e65742f696d6167652f4268754b474a6149654c4e50573965686e7335394e6677714b7846322f764f75376950626161706b414c65643936727a4e2e706e673f6175746f3d666f726d6174">

## Note

Currently the browser extension is in a non-stable state. The first guild connection and transaction will work, however further interaction will break it.

In order to reset, remove it from chrome://extensions, then follow the same steps above to add it again.
