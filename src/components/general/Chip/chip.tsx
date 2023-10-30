import React from "react";
import { IonChip, IonIcon, IonLabel } from "@ionic/react";
import { checkmark, closeCircle } from "ionicons/icons";

////////////////////////////////////////////////////////
/* Props */
////////////////////////////////////////////////////////

interface Props {
  id: string;
  label: string;
  clickFunction?: (a: string) => void;
  showCross?: boolean;
  showCheckmark?: boolean;
}

////////////////////////////////////////////////////////
/* Component */
////////////////////////////////////////////////////////

const Chip: React.FC<Props> = (props: Props) => {
  //////////////////////////////
  /* Variable Initialisation */
  //////////////////////////////

  const id: string = props.id;
  const label: string = props.label;
  const clickFunction: (a: string) => void = props.clickFunction
    ? props.clickFunction
    : (a: string) => {};
  const showCross = props.showCross ? true : false;
  const showCheckmark = props.showCheckmark ? true : false;

  const generatedColour = stringToHsl(label);
  const style = {
    color: getTextColourBasedOnBackgroundHsl(generatedColour),
    backgroundColor: generatedColour,
  };

  //////////////////////////////
  /* Functions */
  //////////////////////////////

  function stringToHsl(input: string) {
    const hue = hashCode(input) % 360;
    return `hsl(${hue}, 100%, 80%)`;
  }

  function getTextColourBasedOnBackgroundHsl(hsl: string) {
    // Get HSL components from stringToHsl
    const regex = /(hsl)|\(|\)|%/g;
    const cleanedHSL = hsl.replaceAll(regex, "");
    const hslArray = cleanedHSL.split(",");

    const rgb = HSLToRGB(
      Number.parseInt(hslArray[0]),
      Number.parseInt(hslArray[1]),
      Number.parseInt(hslArray[2])
    );

    return pickTextColorBasedOnBgColorAdvanced(rgb);
  }

  function hashCode(str: string): number {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  function HSLToRGB(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
  }

  function pickTextColorBasedOnBgColorAdvanced(rgbArray: number[]) {
    var uicolors = [rgbArray[0] / 255, rgbArray[1] / 255, rgbArray[2] / 255];
    var c = uicolors.map((col) => {
      if (col <= 0.03928) {
        return col / 12.92;
      }
      return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];

    const lightColour = "#FFFFFF";
    const darkColour = "#000000";

    return L > 0.179 ? darkColour : lightColour;
  }

  //////////////////////////////
  /* Return */
  //////////////////////////////

  return (
    <IonChip
      key={id + "-" + label}
      style={style}
      onClick={() => clickFunction(label)}
    >
      <IonLabel>{label}</IonLabel>
      {showCross ? <IonIcon icon={closeCircle} /> : <></>}
      {showCheckmark ? <IonIcon icon={checkmark} /> : <></>}
    </IonChip>
  );
};

export default Chip;
