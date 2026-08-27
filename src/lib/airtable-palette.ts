/**
 * Airtable Blocks SDK palette tokens we actually use.
 * RGB is from packages/sdk/src/colors.ts `rgbTuplesByColor`.
 * Hex is the SDK formula: '#' + ((r<<16)|(g<<8)|b).toString(16).padStart(6,'0').
 * Light text when the token does not end with Light1 / Light2
 * (`shouldUseLightTextOnColor` in color_utils.ts).
 * Do not add tokens that are not referenced by a copied option.
 */
const RGB_BY_TOKEN = {
  blueBright: [45, 127, 249],
  blueLight1: [156, 199, 255],
  blueLight2: [207, 223, 255],
  cyanBright: [24, 191, 255],
  grayDark1: [68, 68, 68],
  grayLight1: [204, 204, 204],
  greenBright: [32, 201, 51],
  greenLight1: [147, 224, 136],
  greenLight2: [209, 247, 196],
  orangeLight1: [255, 169, 129],
  pinkBright: [255, 8, 194],
  pinkLight1: [249, 157, 226],
  purpleBright: [139, 70, 255],
  tealBright: [32, 217, 210],
  tealLight1: [114, 221, 195],
  yellowBright: [252, 180, 0],
  yellowLight1: [255, 214, 110],
} as const;

export type AirtableColorToken = keyof typeof RGB_BY_TOKEN;

export type AirtableSwatch = {
  background: string;
  color: string;
};

function rgbToHex(rgb: readonly [number, number, number]): string {
  const hexNumber = (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
  return `#${hexNumber.toString(16).padStart(6, "0")}`;
}

function usesLightText(token: AirtableColorToken): boolean {
  return !(token.endsWith("Light1") || token.endsWith("Light2"));
}

export function swatchForToken(token: AirtableColorToken): AirtableSwatch {
  return {
    background: rgbToHex(RGB_BY_TOKEN[token]),
    color: usesLightText(token) ? "#ffffff" : "#333333",
  };
}
