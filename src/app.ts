import { openPictureInPicture } from "./pip";

async function main(): Promise<void> {
  while (!Spicetify?.Player || !Spicetify?.Topbar?.Button) {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  const btn = new Spicetify.Topbar.Button(
    "lyricfloat",
    "lyrics",
    () => void openPictureInPicture(),
    false
  );
  if (btn.element) btn.element.style.alignSelf = "center";
}

export default main;
