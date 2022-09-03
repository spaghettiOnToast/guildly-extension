export const getImage = () => {
  const images = [
    "assets/illustrations/warrior1.webp",
    "assets/illustrations/warrior2.webp",
    "assets/illustrations/armyLeft.png",
  ];
  const randomIndex = Math.floor(Math.random() * images.length);
  const image = images[randomIndex];
  return image;
};
